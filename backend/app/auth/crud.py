from typing import Optional
import uuid
from app.db.database import JSONDatabase
from app.config import settings
from .security import get_password_hash, verify_password

db = JSONDatabase(settings.DATA_DIR)


def get_user_by_email(email: str):
    """Get user by email"""
    users = db.find("users", email=email)
    return users[0] if users else None


def get_user_by_id(user_id: str):
    """Get user by ID"""
    return db.get("users", user_id)


def create_user(email: str, password: str):
    """Create a new user"""
    # Check if user already exists
    if get_user_by_email(email):
        return None
    
    user_id = str(uuid.uuid4())
    user_data = {
        "id": user_id,
        "email": email,
        "hashed_password": get_password_hash(password),
        "created_at": __import__('datetime').datetime.utcnow().isoformat(),
        "is_active": True,
    }
    return db.insert("users", user_id, user_data)


def authenticate_user(email: str, password: str):
    """Authenticate user by email and password"""
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.get("hashed_password", "")):
        return None
    return user
