from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthReport(BaseModel):
    status: Literal["ok"] = "ok"
    service: str
    environment: str
    version: str
    timestamp: datetime = Field(description="Server timestamp in UTC.")
    uptime_seconds: float = Field(ge=0)

