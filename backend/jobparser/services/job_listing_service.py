
from dataclasses import dataclass
from functools import lru_cache
from math import ceil
from sqlalchemy import PrimaryKeyConstraint, String, create_engine, select, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from app.core.config import settings
from app.schemas.job import JobPostingResponse
from app.schemas.scrape import ListedJobsPageResponse


class JobListingError(Exception):
    """Raised when a job cannot be saved to PostgreSQL."""


@dataclass(frozen=True)
class ListedJobSaveResult:
    id: str
    job_id: str | None = None
    already_listed: bool = False


class Base(DeclarativeBase):
    pass


class ListedJob(Base):
    __tablename__ = "listed_jobs"
    __table_args__ = (PrimaryKeyConstraint("company_name", "job_id", "source_url"),)

    id: Mapped[str] = mapped_column(String(6), nullable=False, unique=True)
    company_name: Mapped[str] = mapped_column(String, nullable=False)
    job_id: Mapped[str] = mapped_column(String, nullable=False)
    source_url: Mapped[str] = mapped_column(String, nullable=False)
    payload_json: Mapped[dict] = mapped_column(JSONB, nullable=False)


class JobIdSequence(Base):
    __tablename__ = "job_id_sequence"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)


@lru_cache
def _get_engine():
    database_url = settings.database_url
    if not database_url:
        raise JobListingError("DATABASE_URL is not configured.")
    return create_engine(_normalize_database_url(database_url), pool_pre_ping=True)


def _normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url


def save_listed_job(job: JobPostingResponse) -> ListedJobSaveResult:
    payload_json = job.model_dump(mode="json")
    payload_json.pop("x_post", None)
    company_name = _normalize_unique_value(job.company_name)
    external_job_id = _normalize_unique_value(job.job_id)
    source_url = str(job.source_url)

    try:
        engine = _get_engine()
        _prepare_listed_jobs_table(engine)

        with Session(engine) as session:
            listed_job = session.get(ListedJob, (company_name, external_job_id, source_url))
            if listed_job is not None:
                return ListedJobSaveResult(
                    id=job.id,
                    job_id=job.job_id,
                    already_listed=True,
                )

            listed_job = ListedJob(
                id=job.id,
                company_name=company_name,
                job_id=external_job_id,
                source_url=source_url,
                payload_json=payload_json,
            )
            session.add(listed_job)
            session.commit()
    except SQLAlchemyError as exc:
        raise JobListingError(f"Failed to save listed job to PostgreSQL: {exc}") from exc
    except Exception as exc:
        raise JobListingError(f"Failed to save listed job: {exc}") from exc

    return ListedJobSaveResult(id=job.id, job_id=job.job_id)


def list_listed_jobs(
    *,
    page: int = 1,
    page_size: int = 6,
    keyword: str | None = None,
    location: str | None = None,
    work_mode: str | None = None,
    job_type: str | None = None,
    experience_level: str | None = None,
) -> ListedJobsPageResponse:
    try:
        engine = _get_engine()
        _prepare_listed_jobs_table(engine)

        with Session(engine) as session:
            rows = session.scalars(select(ListedJob.payload_json)).all()
    except SQLAlchemyError as exc:
        raise JobListingError(f"Failed to fetch listed jobs from PostgreSQL: {exc}") from exc
    except Exception as exc:
        raise JobListingError(f"Failed to fetch listed jobs: {exc}") from exc

    jobs = [JobPostingResponse.model_validate(row) for row in rows]
    filtered_jobs = [
        job
        for job in jobs
        if _matches_filters(
            job,
            keyword=keyword,
            location=location,
            work_mode=work_mode,
            job_type=job_type,
            experience_level=experience_level,
        )
    ]
    filtered_jobs.sort(key=lambda job: job.created_at, reverse=True)

    safe_page = max(page, 1)
    safe_page_size = min(max(page_size, 1), 50)
    total = len(filtered_jobs)
    total_pages = max(ceil(total / safe_page_size), 1)
    start = (safe_page - 1) * safe_page_size
    items = filtered_jobs[start : start + safe_page_size]

    return ListedJobsPageResponse(
        items=items,
        total=total,
        page=safe_page,
        page_size=safe_page_size,
        total_pages=total_pages,
    )


def get_listed_job(job_id: str) -> JobPostingResponse | None:
    try:
        engine = _get_engine()
        _prepare_listed_jobs_table(engine)

        with Session(engine) as session:
            payload = session.scalar(
                select(ListedJob.payload_json).where(ListedJob.id == job_id).limit(1)
            )
    except SQLAlchemyError as exc:
        raise JobListingError(f"Failed to fetch listed job from PostgreSQL: {exc}") from exc
    except Exception as exc:
        raise JobListingError(f"Failed to fetch listed job: {exc}") from exc

    if payload is None:
        return None

    return JobPostingResponse.model_validate(payload)


def _matches_filters(
    job: JobPostingResponse,
    *,
    keyword: str | None,
    location: str | None,
    work_mode: str | None,
    job_type: str | None,
    experience_level: str | None,
) -> bool:
    if work_mode and job.work_mode != work_mode:
        return False
    if job_type and job.job_type != job_type:
        return False
    if experience_level:
        if "-" in experience_level:
            try:
                min_exp, max_exp = map(float, experience_level.split("-"))
                job_min_val = job.experience_years.min if job.experience_years.min is not None else 0.0
                job_max_val = job.experience_years.max if job.experience_years.max is not None else float("inf")
                
                # Check if the requested range overlaps with the job's experience range
                if min_exp > job_max_val or max_exp < job_min_val:
                    return False
            except ValueError:
                # Fallback to categorical matching if parsing fails
                if job.experience_level != experience_level:
                    return False
        else:
            if job.experience_level != experience_level:
                return False

    if keyword:
        normalized_keyword = keyword.lower().strip()
        searchable = " ".join(
            [
                job.title or "",
                job.company_name or "",
                job.description or "",
                " ".join(job.skills),
            ]
        ).lower()
        if normalized_keyword not in searchable:
            return False

    if location:
        normalized_location = location.lower().strip()
        
        # Check all locations in the array
        locations_text = " ".join([
            " ".join([loc.city or "", loc.state or "", loc.country or ""])
            for loc in job.locations
        ]).lower()
        
        combined_text = f"{locations_text} {job.work_mode or ''}".lower()
        
        if normalized_location not in combined_text:
            return False

    return True


def _normalize_unique_value(value: str | None) -> str:
    normalized = " ".join((value or "unknown").strip().lower().split())
    return normalized or "unknown"


BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def generate_next_job_id() -> str:
    engine = _get_engine()
    _prepare_listed_jobs_table(engine)
    with Session(engine) as session:
        seq = JobIdSequence()
        session.add(seq)
        session.commit()
        num = seq.id

    if num == 0:
        return BASE62_CHARS[0] * 6
    res = []
    while num:
        num, rem = divmod(num, 62)
        res.append(BASE62_CHARS[rem])
    res.reverse()
    encoded = "".join(res)
    if len(encoded) < 6:
        encoded = BASE62_CHARS[0] * (6 - len(encoded)) + encoded
    return encoded


def _prepare_listed_jobs_table(engine) -> None:
    Base.metadata.create_all(engine, tables=[ListedJob.__table__, JobIdSequence.__table__])

    with engine.begin() as connection:
        connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS listed_jobs_id_idx ON listed_jobs (id)"))
        connection.execute(text("ALTER TABLE listed_jobs ALTER COLUMN id TYPE text USING id::text"))
        connection.execute(text("ALTER TABLE listed_jobs DROP COLUMN IF EXISTS listed_at"))
        connection.execute(
            text("ALTER TABLE listed_jobs ADD COLUMN IF NOT EXISTS company_name text")
        )
        connection.execute(text("ALTER TABLE listed_jobs ADD COLUMN IF NOT EXISTS job_id text"))
        connection.execute(
            text("UPDATE listed_jobs SET company_name = 'unknown' WHERE company_name IS NULL")
        )
        connection.execute(text("UPDATE listed_jobs SET job_id = id::text WHERE job_id IS NULL"))
        connection.execute(text("ALTER TABLE listed_jobs ALTER COLUMN company_name SET NOT NULL"))
        connection.execute(text("ALTER TABLE listed_jobs ALTER COLUMN job_id SET NOT NULL"))
        connection.execute(
            text(
                """
                DO $$
                DECLARE constraint_name text;
                BEGIN
                    SELECT conname INTO constraint_name
                    FROM pg_constraint
                    WHERE conrelid = 'listed_jobs'::regclass
                    AND contype = 'p'
                    LIMIT 1;

                    IF constraint_name IS NOT NULL
                    AND constraint_name != 'listed_jobs_pkey' THEN
                        EXECUTE format(
                            'ALTER TABLE listed_jobs DROP CONSTRAINT %I',
                            constraint_name
                        );
                    END IF;
                END $$;
                """
            )
        )
        connection.execute(
            text("ALTER TABLE listed_jobs DROP CONSTRAINT IF EXISTS listed_jobs_pkey")
        )
        connection.execute(
            text(
                """
                ALTER TABLE listed_jobs
                ADD CONSTRAINT listed_jobs_pkey PRIMARY KEY (company_name, job_id, source_url)
                """
            )
        )
