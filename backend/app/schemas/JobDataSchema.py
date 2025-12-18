from pydantic import BaseModel, Field
from datetime import datetime
from pytz import timezone
class JobData(BaseModel):
    company_name:str = Field(..., min_length=1 , max_length=255)
    job_description:str = Field(..., min_length=10)
    position:str = Field(..., min_length=1 , max_length=255)
    keywords:list[str] = Field(..., min_length=1)
    resume_style:str = Field(..., min_length=1 , max_length=255)
    use_demo_content:bool = Field(default=False)
    created_at:datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at:datetime = Field(default_factory=datetime.now(timezone.utc), nullable=True)

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# class  AllJobData(BaseModel):
#     jobs:list[JobData] = Field(..., min_length=1)
#     total:int = Field(..., ge=0)
#     page:int = Field(..., ge=1)
#     limit:int = Field(..., ge=1)
#     total_pages:int = Field(..., ge=1)
#     has_next:bool = Field(..., default=False)
#     has_previous:bool = Field(..., default=False)
#     next_page:int = Field(..., ge=1, nullable=True)
#     previous_page:int = Field(..., ge=1, nullable=True)
#     created_at:datetime = Field(default_factory=datetime.now(timezone.utc))
#     updated_at:datetime = Field(default_factory=datetime.now(timezone.utc), nullable=True)

#     class Config:
#         from_attributes = True
#         json_encoders = {
#             datetime: lambda v: v.isoformat()
#         }
