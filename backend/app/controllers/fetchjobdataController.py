from app.services.fetchJobData import fetchData
from app.database.connection import get_db
from app.schemas.jobSchemas import AllJobData


class fetchJobDataController:
    @staticmethod
    async def fetch_job_data():
        async with get_db() as db:
            try:
                jobs = await fetchData.fetch_job_data()
                db.add_all(jobs)
                await db.commit()
                return AllJobData(
                    jobs=jobs,
                    total=len(jobs),
                    page=1,
                    limit=200,
                    total_pages=1,
                    has_next=False,
                    has_previous=False,
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch job data: {e}")
            finally:
                await db.close()