from fastapi import APIRouter

from app.schemas.health import HealthReport
from app.services.health_service import build_health_report

router = APIRouter()


@router.get("", response_model=HealthReport, summary="Get server health report")
def get_health_report() -> HealthReport:
    return build_health_report()

