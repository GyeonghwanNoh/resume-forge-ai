from fastapi import APIRouter, HTTPException, Depends, status
from datetime import timedelta
from .schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from .security import create_access_token
from .crud import create_user, authenticate_user, get_user_by_id
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    """Register a new user"""
    user = create_user(email=user_data.email, password=user_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user"""
    user = authenticate_user(email=credentials.email, password=credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = None):
    """Get current logged-in user"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    from .security import decode_token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        created_at=user["created_at"],
        is_active=user["is_active"]
    )
