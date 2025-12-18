from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Machine readable error code")
    message: str = Field(..., description="Human readable error message")
    field: Optional[str] = Field(
        None, description="Optional field name related to the error"
    )
    meta: Optional[Dict[str, Any]] = Field(
        default=None, description="Optional contextual metadata"
    )


class APIResponse(BaseModel):
    success: bool = Field(default=True, description="Indicates request success")
    message: str = Field(default="Request successful")
    data: Optional[Any] = Field(default=None, description="Primary response payload")
    errors: Optional[list[ErrorDetail]] = Field(
        default=None, description="List of errors when success is False"
    )
    meta: Optional[Dict[str, Any]] = Field(
        default=None, description="Additional metadata (pagination, etc.)"
    )

