from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    profile_info: Optional[Dict] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    profile_info: Optional[Dict] = {}
    created_at: datetime

    @field_validator('user_id', mode='before')
    @classmethod
    def convert_uuid_to_string(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True 
