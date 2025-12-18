from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.users import User as UserModel
from app.schemas.authSchema import UserCreate, UserLogin, UserResponse
from app.utils.jwt_handler import create_access_token, verify_token
from datetime import datetime
from uuid import UUID
import bcrypt


class AuthService:

    @staticmethod
    async def register_user(user_data: UserCreate, db: AsyncSession) -> UserResponse:
        result = await db.execute(select(UserModel).where(UserModel.email == user_data.email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = bcrypt.hashpw(
            user_data.password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        new_user = UserModel(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password,
            profile_info=user_data.profile_info or {},
            saved_resumes=[],
            created_at=datetime.utcnow()
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return UserResponse.model_validate(new_user)

    @staticmethod
    async def authenticate_user(login_data: UserLogin, db: AsyncSession):
        result = await db.execute(select(UserModel).where(UserModel.email == login_data.email))
        user = result.scalar_one_or_none()

        if not user or not bcrypt.checkpw(
            login_data.password.encode('utf-8'),
            user.hashed_password.encode('utf-8')
        ):
            raise HTTPException(status_code=401, detail="Incorrect email or password")

        token = create_access_token(data={"sub": str(user.user_id)})
        user_response = UserResponse.model_validate(user)

        return {"access_token": token, "token_type": "bearer", "user": user_response}

    @staticmethod
    async def get_current_user(token: str, db: AsyncSession) -> UserResponse:
        payload = verify_token(token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        try:
            uuid_obj = UUID(user_id)
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid user ID")

        result = await db.execute(select(UserModel).where(UserModel.user_id == uuid_obj))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserResponse.model_validate(user)
