from fastapi import APIRouter, Depends, status
from app.controllers.auth_controller import AuthController
from app.schemas.response import APIResponse
from app.schemas.authSchema import UserCreate, UserLogin

router = APIRouter(prefix="/auth", tags=["Auth"])


router.post("/register",response_model=APIResponse,status_code=status.HTTP_201_CREATED)(AuthController.register)
router.post("/login",response_model=APIResponse)(AuthController.login)
router.get("/me",response_model=APIResponse)(AuthController.get_me)
