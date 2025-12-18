from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.database.connection import init_db, close_db_connection, engine
from app.routes.auth import router as auth_router
from app.routes.jobsRoutes import router as jobs_router
from app.utils.response import success_response
from app.schemas.response import APIResponse
from app.models.users import User  # Import User model to register with SQLAlchemy
from app.models.jobdata import Jobs  # Import Jobs model to register with SQLAlchemy
from sqlalchemy import text
import logging
from utils.shcedular import start_scheduler
logging.basicConfig(level=logging.INFO)
app = FastAPI(title="AI Resume Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()
    start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db_connection()

app.include_router(auth_router)
app.include_router(jobs_router)

@app.get("/", response_model=APIResponse)
async def root():
    return success_response({"message": "Welcome to AI Resume Builder API"}, "Service running")


@app.get("/health", response_model=APIResponse)
async def health_check():
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        return success_response({"db": "connected"}, "Service healthy")
    except Exception as e:
        return success_response({"db": "error", "error": str(e)}, "Service unhealthy", status.HTTP_503_SERVICE_UNAVAILABLE)
