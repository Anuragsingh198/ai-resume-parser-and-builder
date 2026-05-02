from datetime import UTC, datetime
from time import monotonic

from app.core.config import settings
from app.schemas.health import HealthReport

_START_TIME = monotonic()


def build_health_report() -> HealthReport:
    return HealthReport(
        service=settings.app_name,
        environment=settings.app_env,
        version=settings.app_version,
        timestamp=datetime.now(UTC),
        uptime_seconds=round(monotonic() - _START_TIME, 3),
    )
