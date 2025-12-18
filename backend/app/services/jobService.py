from  fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.jobdata import Jobs
from app.schemas.jobSchema import JobCreate, JobUpdate, JobResponse

class jobService:
    @staticmethod
    async def get_all_jobs(db: AsyncSession) -> list[JobResponse]:
        result = await db.execute(select(Jobs))
        jobs = result.scalars().all()
        return jobs
    
    @staticmethod
    async def get_job_by_id(job_id: int, db: AsyncSession) -> JobResponse:
        result = await db.execute(select(Jobs).where(Jobs.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        return job