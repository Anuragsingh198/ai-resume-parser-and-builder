from sqlalchemy import Column, Integer, String, JSON, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database.connection import Base


class Jobs(Base):
    __tablename__ = 'jobs'
    
    job_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    job_location = Column(String(255), nullable=False)
    job_type = Column(String(255), nullable=False)
    job_salary = Column(Integer, nullable=False)
    job_posted_date = Column(DateTime, nullable=False)
    job_company = Column(String(255), nullable=False)
    job_url = Column(String(255), nullable=False)
    job_created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    job_updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
