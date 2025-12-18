from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # PostgreSQL
    DATABASE_URL: str = "postgresql+asyncpg://neondb_owner:npg_Pe78yatChwNK@ep-weathered-bar-ad0rsivv-pooler.c-2.us-east-1.aws.neon.tech/neondb"
    # Format: postgresql+asyncpg://username:password@host:port/database_name
    # Note: SSL is configured in connection.py for asyncpg compatibility
    
    # JWT
    SECRET_KEY: str = "djfjshiugwfbwiuebfqwnbiufwifhbiwhf87y42389wehfwe9h"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    # Cloud Storage (Cloudinary)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

#Job api credentials
    APPLICATION_ID:str = 'bb4cfadd'
    API_KEY:str = 'a9a8160d8bb8682d405b841e2f3004a9'

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://localhost:5174",  
    ]
    
    # Rate Limiting
    RATE_LIMIT_PER_HOUR: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

