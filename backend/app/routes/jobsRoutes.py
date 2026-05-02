from fastapi import APIRouter
from app.controllers.jobController import jobController
from app.schemas.response import APIResponse


router = APIRouter(prefix="/jobs", tags=["Jobs"])
router.post("/scrape", response_model=APIResponse)(jobController.scrape_job_url)
router.get("/", response_model=APIResponse)(jobController.get_all_jobs)
router.get("/{job_id}", response_model=APIResponse)(jobController.get_job_by_id)
