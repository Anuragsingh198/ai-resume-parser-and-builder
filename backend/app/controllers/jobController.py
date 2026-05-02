from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.services.jobService import jobService
from app.services.jobScraperService import JobScraperService
from app.schemas.jobSchema import JobResponse
from app.schemas.scrapeSchemas import JobScrapeRequest
from app.schemas.response import APIResponse
from app.utils.response import success_response
from app.utils.response import error_response


security = HTTPBearer()

class  jobController: 
    @staticmethod
    async def get_all_jobs(credentials: HTTPAuthorizationCredentials = Depends(security),db: AsyncSession = Depends(get_db)) -> APIResponse:
        try:
            jobs = await jobService.get_all_jobs(db)
            return success_response(
                data=jobs,
                message="Jobs fetched successfully",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    async def get_job_by_id(job_id: int, credentials: HTTPAuthorizationCredentials = Depends(security),db: AsyncSession = Depends(get_db)) -> APIResponse:
        try:
            job = await jobService.get_job_by_id(job_id, db)
            return success_response(
                data=job,
                message="Job fetched successfully",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return error_response(
                message=str(e), 
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    async def scrape_job_url(payload: JobScrapeRequest) -> APIResponse:
        try:
            scraped_content = await JobScraperService.scrape_job_page(str(payload.url))
            return success_response(
                data=scraped_content.model_dump(),
                message="Job page scraped successfully",
                status_code=status.HTTP_200_OK,
            )
        except Exception as e:
            if hasattr(e, "status_code"):
                raise e
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
