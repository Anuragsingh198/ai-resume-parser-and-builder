from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl

from app.schemas.job import JobPostingResponse


class JobScrapeRequest(BaseModel):
    url: HttpUrl = Field(description="Public job posting URL to scrape.")


class JobScrapeResponse(BaseModel):
    url: HttpUrl
    content: str = Field(description="Plain text content from the page body.")


class JobTextExtractRequest(BaseModel):
    text: str = Field(min_length=50, description="Plain job description text to extract.")
    source_url: HttpUrl | None = Field(
        default=None,
        description="Original job posting URL, if available.",
    )


class JobListResponse(BaseModel):
    id: str
    job_id: str | None = None
    status: str = "listed"
    message: str | None = None


class ListedJobsPageResponse(BaseModel):
    items: list[JobPostingResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
