import uuid
from datetime import datetime

from pydantic import BaseModel


class JobResponse(BaseModel):
    job_id: uuid.UUID
    job_title: str
    job_description: str
    job_location: str
    job_type: str
    job_salary: int
    job_posted_date: datetime
    job_company: str
    job_url: str
    job_created_at: datetime
    job_updated_at: datetime

    class Config:
        from_attributes = True


class JobCreate(BaseModel):
    job_title: str
    job_description: str
    job_location: str
    job_type: str
    job_salary: int
    job_posted_date: datetime
    job_company: str
    job_url: str


class JobUpdate(BaseModel):
    job_title: str | None = None
    job_description: str | None = None
    job_location: str | None = None
    job_type: str | None = None
    job_salary: int | None = None
    job_posted_date: datetime | None = None
    job_company: str | None = None
    job_url: str | None = None
