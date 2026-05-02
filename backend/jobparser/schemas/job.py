from datetime import date, datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator

JobType = Literal["full_time", "part_time", "contract", "internship", "temporary", "other"]
ExperienceLevel = Literal["entry", "junior", "mid", "senior", "lead", "executive", "other"]
SalaryPeriod = Literal["hour", "day", "week", "month", "year", "other"]
WorkMode = Literal["remote", "hybrid", "in_office", "unknown"]


class JobLocation(BaseModel):
    city: str | None = None
    state: str | None = None
    country: str | None = None
    remote: bool | None = None


class JobSalary(BaseModel):
    min: float | None = None
    max: float | None = None
    currency: str | None = Field(default=None, examples=["INR", "USD"])
    period: SalaryPeriod | None = None


class JobExperienceYears(BaseModel):
    min: float | None = Field(default=None, ge=0)
    max: float | None = Field(default=None, ge=0)


class ExtractedJobFields(BaseModel):
    job_id: str | None = Field(
        default=None,
        description="External/source job id from the job board, not the internal UUID.",
    )

    @field_validator("job_id")
    @classmethod
    def validate_job_id(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v_clean = v.strip()
        if v_clean.isalnum() and len(v_clean) <= 15:
            return v_clean
        return None

    title: str | None = None
    company_name: str | None = None
    locations: list[JobLocation] = Field(default_factory=list)
    work_mode: WorkMode | None = None
    job_type: JobType | None = None
    experience_level: ExperienceLevel | None = None
    experience_years: JobExperienceYears = Field(default_factory=JobExperienceYears)
    salary: JobSalary = Field(default_factory=JobSalary)
    description: str | None = None
    requirements: list[str] = Field(default_factory=list)
    responsibilities: list[str] = Field(default_factory=list)
    benefits: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    education: str | None = None
    posted_at: date | None = None
    opened_at: date | None = None
    closed_at: date | None = None
    application_url: HttpUrl | None = None
    source_name: str | None = None
    company_id: UUID | None = None
    x_post: str | None = Field(default=None, description="Generated X (Twitter) summary post with hashtags and link")

    @model_validator(mode="before")
    @classmethod
    def migrate_location_to_locations(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # If locations is empty/missing but singular location exists, migrate it
            if not data.get("locations") and data.get("location"):
                data["locations"] = [data.pop("location")]
        return data


class JobPostingResponse(ExtractedJobFields):
    id: str
    source_url: HttpUrl
    created_at: datetime
    updated_at: datetime
