import uuid
from pydantic import BaseModel, Field
from datetime import datetime

class Job(BaseModel):
    id:uuid.UUID = Field(default_factory=uuid.uuid4)
    title:str = Field(..., min_length=1 , max_length=255)
    description:str = Field(..., min_length=10)
    company:str = Field(..., min_length=1 , max_length=255)
    location:str = Field(..., min_length=1 , max_length=255)
    salary:int = Field(..., gt=0)
    created_at:datetime = Field(default_factory=datetime.utcnow)
    updated_at:datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

