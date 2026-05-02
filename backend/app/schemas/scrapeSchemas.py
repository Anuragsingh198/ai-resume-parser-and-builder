from pydantic import BaseModel, HttpUrl


class JobScrapeRequest(BaseModel):
    url: HttpUrl


class JobScrapeResponse(BaseModel):
    url: str
    title: str | None = None
    body_text: str
    text_length: int
