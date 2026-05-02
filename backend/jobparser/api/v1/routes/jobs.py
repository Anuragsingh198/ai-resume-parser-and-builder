
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.job import JobPostingResponse
from app.schemas.scrape import (
    JobListResponse,
    JobScrapeRequest,
    JobScrapeResponse,
    JobTextExtractRequest,
    ListedJobsPageResponse,
)
from app.core.config import settings
from app.services.gemini_service import JobExtractionError, extract_job_posting
from app.services.job_listing_service import (
    JobListingError,
    get_listed_job,
    list_listed_jobs,
    save_listed_job,
)
from app.services.twitter_service import TwitterPostService
from app.services.web_scrap import ScrapeError, scrape_job_body_content

router = APIRouter()


@router.post("/scrape", response_model=JobScrapeResponse, summary="Scrape job page body text")
def scrape_job(request: JobScrapeRequest) -> JobScrapeResponse:
    try:
        content = scrape_job_body_content(str(request.url))
    except ScrapeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"{exc} Some career sites block automated scraping. "
                "Use Job Description Text mode and paste the visible job text instead."
            ),
        ) from exc

    return JobScrapeResponse(url=request.url, content=content)


@router.post(
    "/extract",
    response_model=JobPostingResponse,
    summary="Scrape and extract structured job data",
)
def extract_job(request: JobScrapeRequest) -> JobPostingResponse:
    try:
        content = scrape_job_body_content(str(request.url))
        return extract_job_posting(content, str(request.url))
    except ScrapeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except JobExtractionError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc


@router.post(
    "/extract-text",
    response_model=JobPostingResponse,
    summary="Extract structured job data from pasted text",
)
def extract_job_from_text(request: JobTextExtractRequest) -> JobPostingResponse:
    source_url = str(request.source_url) if request.source_url else "https://manual-input.local"

    try:
        return extract_job_posting(request.text, source_url)
    except JobExtractionError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc


@router.post(
    "/list",
    response_model=JobListResponse,
    summary="Save extracted job data to PostgreSQL",
)
def list_job(job: JobPostingResponse, post_to_x: bool = Query(default=False)) -> JobListResponse:
    try:
        result = save_listed_job(job)
        
        # Handle X (Twitter) posting if requested
        x_posted = False
        if post_to_x and job.x_post:
            try:
                if (settings.twitter_api_key and settings.twitter_api_secret and 
                    settings.twitter_access_token and settings.twitter_access_token_secret):
                    
                    twitter_service = TwitterPostService(
                        consumer_key=settings.twitter_api_key,
                        consumer_secret=settings.twitter_api_secret,
                        access_token=settings.twitter_access_token,
                        access_token_secret=settings.twitter_access_token_secret
                    )
                    twitter_service.post_tweet(job.x_post)
                    x_posted = True
            except Exception as twitter_exc:
                # Log error but don't fail the job listing
                print(f"Failed to post to X: {twitter_exc}")

        if result.already_listed:
            return JobListResponse(
                id=result.id,
                job_id=result.job_id,
                status="already_listed",
                message="Job is already listed.",
            )

        message = "Job listed successfully."
        if x_posted:
            message = "Job listed and posted to X successfully."

        return JobListResponse(
            id=result.id,
            job_id=result.job_id,
            status="listed",
            message=message,
        )
    except JobListingError as exc:
        detail = str(exc)
        status_code = (
            status.HTTP_503_SERVICE_UNAVAILABLE
            if "DATABASE_URL is not configured" in detail
            else status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        raise HTTPException(
            status_code=status_code,
            detail=detail,
        ) from exc


@router.get(
    "/listed",
    response_model=ListedJobsPageResponse,
    summary="Get listed jobs with filters and pagination",
)
def get_listed_jobs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=6, ge=1, le=50),
    keyword: str | None = None,
    location: str | None = None,
    work_mode: str | None = None,
    job_type: str | None = None,
    experience_level: str | None = None,
) -> ListedJobsPageResponse:
    try:
        return list_listed_jobs(
            page=page,
            page_size=page_size,
            keyword=keyword,
            location=location,
            work_mode=work_mode,
            job_type=job_type,
            experience_level=experience_level,
        )
    except JobListingError as exc:
        detail = str(exc)
        status_code = (
            status.HTTP_503_SERVICE_UNAVAILABLE
            if "DATABASE_URL is not configured" in detail
            else status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        raise HTTPException(status_code=status_code, detail=detail) from exc


@router.get(
    "/listed/{id}",
    response_model=JobPostingResponse,
    summary="Get one listed job by internal id",
)
def get_listed_job_detail(id: str) -> JobPostingResponse:
    try:
        job = get_listed_job(id)
    except JobListingError as exc:
        detail = str(exc)
        status_code = (
            status.HTTP_503_SERVICE_UNAVAILABLE
            if "DATABASE_URL is not configured" in detail
            else status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        raise HTTPException(status_code=status_code, detail=detail) from exc

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listed job not found.",
        )

    return job
