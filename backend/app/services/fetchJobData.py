import requests
from app.database.connection import SessionLocal
from app.models.jobdata import Jobs as JobModel
from app.config.settings import settings
from sqlalchemy.dialects.postgresql import insert
import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

async def fetch_jobs():
    try:
        url = (
            f"https://api.adzuna.com/v1/api/jobs/in/search/1"
            f"?app_id={settings.APPLICATION_ID}"
            f"&app_key={settings.API_KEY}"
            f"&what=software developer"
            f"&results_per_page=200"
        )

        res = requests.get(url)
        res.raise_for_status() 
        data = res.json()
        
        async with SessionLocal() as db:
            try:
                for job in data.get("results", []):
                    job_id_str = str(job.get("id", ""))
                    try:
                        job_uuid = uuid.UUID(job_id_str)
                    except (ValueError, TypeError):
                        job_uuid = uuid.uuid5(uuid.NAMESPACE_DNS, job_id_str)
                    
                    created_str = job.get("created", "")
                    if created_str.endswith("Z"):
                        created_str = created_str.replace("Z", "+00:00")
                    job_posted_date_aware = datetime.datetime.fromisoformat(created_str)
                    if job_posted_date_aware.tzinfo is not None:
                        job_posted_date = job_posted_date_aware.astimezone(datetime.timezone.utc).replace(tzinfo=None)
                    else:
                        job_posted_date = job_posted_date_aware
                    
                    salary_min = job.get("salary_min")
                    salary_max = job.get("salary_max")
                    job_salary = salary_max if salary_max else (salary_min if salary_min else 0)
                    
                    job_values = {
                        "job_id": job_uuid,
                        "job_title": job.get("title", "No Title"),
                        "job_description": job.get("description", "")[:5000] if job.get("description") else "No description",
                        "job_location": job.get("location", {}).get("display_name", "Unknown"),
                        "job_type": job.get("contract_time", "full_time"),
                        "job_salary": job_salary,
                        "job_posted_date": job_posted_date,
                        "job_company": job.get("company", {}).get("display_name", "Unknown Company"),
                        "job_url": job.get("redirect_url", ""),
                        "job_created_at": datetime.datetime.utcnow(),
                        "job_updated_at": datetime.datetime.utcnow(),
                    }
                    
                    stmt = insert(JobModel).values(**job_values)
                    
                    update_dict = {k: v for k, v in job_values.items() if k != "job_id"}
                    stmt = stmt.on_conflict_do_update(
                        index_elements=['job_id'],
                        set_=update_dict
                    )
                    
                    await db.execute(stmt)

                await db.commit()
            except Exception as e:
                await db.rollback()
                raise

        job_count = len(data.get('results', []))
        print(f"Job data has been fetched correctly! Synced {job_count} jobs successfully.")
        logger.info(f"Job data fetched successfully. Synced {job_count} jobs.")
    except requests.exceptions.RequestException as e:
        error_msg = f"Error fetching job data from API: {str(e)}"
        print(error_msg)
        logger.error(error_msg)
        raise
    except Exception as e:
        error_msg = f"Error processing job data: {str(e)}"
        print(error_msg)
        logger.error(error_msg)
        raise
