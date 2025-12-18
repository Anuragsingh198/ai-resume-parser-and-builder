# scheduler.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.fetchJobData import fetch_jobs
import logging

logger = logging.getLogger(__name__)

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(fetch_jobs, "interval", hours=24)
    scheduler.start()
    logger.info("Scheduler started successfully")
