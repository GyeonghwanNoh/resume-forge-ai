import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # API Configuration
    API_TITLE = "ResumeForge AI API"
    API_VERSION = "1.0.0"
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # JWT Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Storage
    DATA_DIR = os.getenv("DATA_DIR", "./data")
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
    
    # Ensure directories exist
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = ENVIRONMENT == "development"
    
    # Freemium limits
    FREE_ANALYSES_PER_MONTH = 3
    FREE_COVER_LETTERS_PER_MONTH = 2


settings = Settings()
