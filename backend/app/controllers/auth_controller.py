from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database.connection import get_db
from app.schemas.authSchema import UserCreate, UserLogin, UserResponse
from app.services.authService import AuthService
from app.utils.response import success_response
from app.schemas.response import APIResponse

security = HTTPBearer()

class AuthController:

    @staticmethod
    async def register(user_data: UserCreate,db: AsyncSession = Depends(get_db)) -> APIResponse:
        user = await AuthService.register_user(user_data, db)
        return success_response(
            data=user.model_dump(),
            message="User registered successfully",
            status_code=status.HTTP_201_CREATED
        )

    @staticmethod
    async def login(login_data: UserLogin,db: AsyncSession = Depends(get_db)) -> APIResponse:
        result = await AuthService.authenticate_user(login_data, db)
        result["user"] = result["user"].model_dump()
        return success_response(
            data=result,
            message="Login successful"
        )

    @staticmethod
    async def get_me(credentials: HTTPAuthorizationCredentials = Depends(security),db: AsyncSession = Depends(get_db)) -> APIResponse:
        token = credentials.credentials
        current_user = await AuthService.get_current_user(token, db)
        return success_response(
            data=current_user.model_dump(),
            message="Current user fetched successfully"
        )
