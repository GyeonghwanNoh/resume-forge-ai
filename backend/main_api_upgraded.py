from fastapi import FastAPI, HTTPException, File, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json
import os
import uuid
import base64
from pathlib import Path
from typing import Optional, List
from dotenv import load_dotenv

# Import new services
from ai_service import AIService
from usage_service import UsageService

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
BASE_DIR = Path(__file__).resolve().parent


def resolve_storage_path(raw_path: str, default_path: Path) -> Path:
    p = Path(raw_path)
    if p.is_absolute():
        return p
    return (BASE_DIR / p).resolve()


DATA_DIR = resolve_storage_path(os.getenv("DATA_DIR", "data"), BASE_DIR / "data")
UPLOAD_DIR = resolve_storage_path(os.getenv("UPLOAD_DIR", "uploads"), BASE_DIR / "uploads")


def initialize_storage() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    required_json_files = [
        "users.json",
        "resumes.json",
        "analyses.json",
        "usage.json",
        "cover_letters.json",
        "interview_questions.json",
    ]

    for filename in required_json_files:
        file_path = DATA_DIR / filename
        if not file_path.exists():
            file_path.write_text("{}", encoding="utf-8")


initialize_storage()


def get_allowed_origins() -> List[str]:
    csv_origins = os.getenv("CORS_ORIGINS", "")
    origins = [o.strip().rstrip("/") for o in csv_origins.split(",") if o.strip()]
    defaults = [
        FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    merged = origins + defaults
    # preserve order, remove duplicates
    return list(dict.fromkeys(merged))


ALLOWED_ORIGINS = get_allowed_origins()

# Pydantic Models
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: str
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class JobAnalysisRequest(BaseModel):
    resume_id: str
    job_description: str

class BulletRewriteRequest(BaseModel):
    bullets: List[str]

# FastAPI App
app = FastAPI(title="ResumeForge AI API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility Functions
def hash_password(password: str) -> str:
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_token(user_id: str, email: str) -> str:
    token_data = f"{user_id}:{email}"
    return base64.b64encode(token_data.encode()).decode()

def decode_token(token: str) -> Optional[tuple]:
    try:
        token_data = base64.b64decode(token.encode()).decode()
        parts = token_data.split(":")
        if len(parts) == 2:
            return (parts[0], parts[1])
    except:
        pass
    return None

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        decoded = decode_token(token)
        if not decoded:
            raise HTTPException(status_code=401, detail="Invalid token")
        return decoded[0]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# JSON Database
def get_users_db():
    db_file = DATA_DIR / "users.json"
    if db_file.exists():
        with open(db_file, encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_users_db(data):
    with open(DATA_DIR / "users.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_user_by_email(email: str):
    users = get_users_db()
    for user_id, user_data in users.items():
        if user_data.get("email") == email:
            return user_data
    return None

def get_user_by_id(user_id: str):
    users = get_users_db()
    return users.get(user_id)

def get_resume(resume_id: str):
    db_file = DATA_DIR / "resumes.json"
    if not db_file.exists():
        return None
    with open(db_file, encoding="utf-8") as f:
        resumes = json.load(f)
    return resumes.get(resume_id)

# Routes
@app.get("/")
async def root():
    return {"message": "ResumeForge AI API running", "version": "2.0.0", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    users = get_users_db()
    users[user_id] = {
        "id": user_id,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True,
        "is_premium": False,
    }
    save_users_db(users)
    
    user = users[user_id]
    access_token = create_token(user["id"], user["email"])
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=user["id"], email=user["email"], created_at=user["created_at"], is_active=user["is_active"])
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_token(user["id"], user["email"])
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=user["id"], email=user["email"], created_at=user["created_at"], is_active=user["is_active"])
    )

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=user["id"], email=user["email"], created_at=user["created_at"], is_active=user["is_active"])

@app.get("/api/usage/summary")
async def get_usage_summary(authorization: str = Header(None)):
    """Get user's usage stats"""
    user_id = get_current_user_id(authorization)
    return UsageService.get_usage_summary(user_id)

@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    content = await file.read()
    resume_id = str(uuid.uuid4())
    
    resumes_db = {}
    db_file = DATA_DIR / "resumes.json"
    if db_file.exists():
        with open(db_file, encoding="utf-8") as f:
            resumes_db = json.load(f)
    
    resumes_db[resume_id] = {
        "id": resume_id,
        "user_id": user_id,
        "filename": file.filename,
        "original_text": content.decode("utf-8", errors="ignore"),
        "created_at": datetime.utcnow().isoformat(),
    }
    
    with open(db_file, "w", encoding="utf-8") as f:
        json.dump(resumes_db, f, indent=2, default=str)
    
    return {"id": resume_id, "filename": file.filename, "created_at": datetime.utcnow().isoformat(), "message": "Resume uploaded"}

@app.get("/api/resumes/list")
async def list_resumes(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    db_file = DATA_DIR / "resumes.json"
    if not db_file.exists():
        return []
    
    with open(db_file, encoding="utf-8") as f:
        resumes = json.load(f)
    return [r for r in resumes.values() if r.get("user_id") == user_id]

@app.post("/api/resumes/analyze/{resume_id}")
async def analyze_resume(resume_id: str, authorization: str = Header(None)):
    """Analyze resume with AI-powered scoring"""
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    
    # Check usage limits
    limit_check = UsageService.check_limit(user_id, "analyses", user.get("is_premium", False))
    if not limit_check["allowed"]:
        raise HTTPException(status_code=429, detail=limit_check["message"])
    
    resume = get_resume(resume_id)
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Perform AI analysis
    analysis_result = AIService.analyze_resume(resume["original_text"])
    
    # Increment usage
    UsageService.increment_usage(user_id, "analyses")
    
    # Save analysis
    analysis_id = str(uuid.uuid4())
    analyses_db = {}
    analyses_file = DATA_DIR / "analyses.json"
    if analyses_file.exists():
        with open(analyses_file, encoding="utf-8") as f:
            analyses_db = json.load(f)
    
    analyses_db[analysis_id] = {
        "id": analysis_id,
        "resume_id": resume_id,
        "user_id": user_id,
        "overall_score": analysis_result.get("overall_score", 70),
        "ats_score": analysis_result.get("ats_score", 65),
        "clarity_score": analysis_result.get("clarity_score", 68),
        "impact_score": analysis_result.get("impact_score", 62),
        "grammar_score": analysis_result.get("grammar_score", 75),
        "missing_keywords": analysis_result.get("missing_keywords", []),
        "weak_bullet_points": analysis_result.get("weak_bullet_points", []),
        "rewritten_bullets": analysis_result.get("rewritten_bullets", {}),
        "main_weaknesses": analysis_result.get("main_weaknesses", []),
        "created_at": datetime.utcnow().isoformat(),
    }
    
    with open(analyses_file, "w", encoding="utf-8") as f:
        json.dump(analyses_db, f, indent=2, default=str)
    
    # Return with usage info
    return {
        **analyses_db[analysis_id],
        "usage_remaining": UsageService.check_limit(user_id, "analyses", user.get("is_premium", False))["remaining"]
    }

@app.post("/api/resumes/analyze-for-job")
async def analyze_for_job(request: JobAnalysisRequest, authorization: str = Header(None)):
    """Compare resume against specific job description"""
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    
    # Check usage limits
    limit_check = UsageService.check_limit(user_id, "job_matches", user.get("is_premium", False))
    if not limit_check["allowed"]:
        raise HTTPException(status_code=429, detail=limit_check["message"])
    
    resume = get_resume(request.resume_id)
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Perform job matching analysis
    match_result = AIService.analyze_for_job(resume["original_text"], request.job_description)
    
    # Increment usage
    UsageService.increment_usage(user_id, "job_matches")
    
    return {
        **match_result,
        "resume_id": request.resume_id,
        "created_at": datetime.utcnow().isoformat(),
        "usage_remaining": UsageService.check_limit(user_id, "job_matches", user.get("is_premium", False))["remaining"]
    }

@app.post("/api/resumes/rewrite-bullets")
async def rewrite_bullets(request: BulletRewriteRequest, authorization: str = Header(None)):
    """Rewrite weak bullet points with AI"""
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    
    # Check usage limits
    limit_check = UsageService.check_limit(user_id, "bullet_rewrites", user.get("is_premium", False))
    if not limit_check["allowed"]:
        raise HTTPException(status_code=429, detail=limit_check["message"])
    
    # Rewrite bullets
    result = AIService.rewrite_bullets(request.bullets)
    
    # Increment usage
    UsageService.increment_usage(user_id, "bullet_rewrites")
    
    return {
        **result,
        "usage_remaining": UsageService.check_limit(user_id, "bullet_rewrites", user.get("is_premium", False))["remaining"]
    }

@app.post("/api/resumes/cover-letter")
async def generate_cover_letter(request: dict, authorization: str = Header(None)):
    """Generate tailored cover letter"""
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    
    # Check usage limits
    limit_check = UsageService.check_limit(user_id, "cover_letters", user.get("is_premium", False))
    if not limit_check["allowed"]:
        raise HTTPException(status_code=429, detail=limit_check["message"])
    
    resume_id = request.get("resume_id")
    job_description = request.get("job_description", "")
    
    resume = get_resume(resume_id)
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate cover letter
    cover_letter = AIService.generate_cover_letter(resume["original_text"], job_description)
    
    # Increment usage
    UsageService.increment_usage(user_id, "cover_letters")
    
    return {
        "id": str(uuid.uuid4()),
        "cover_letter": cover_letter,
        "created_at": datetime.utcnow().isoformat(),
        "usage_remaining": UsageService.check_limit(user_id, "cover_letters", user.get("is_premium", False))["remaining"]
    }

@app.post("/api/resumes/interview-questions")
async def generate_interview_questions(request: dict, authorization: str = Header(None)):
    """Generate targeted interview questions"""
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    
    # Check usage limits
    limit_check = UsageService.check_limit(user_id, "interview_questions", user.get("is_premium", False))
    if not limit_check["allowed"]:
        raise HTTPException(status_code=429, detail=limit_check["message"])
    
    job_description = request.get("job_description", "")
    
    # Generate questions
    questions = AIService.generate_interview_questions(job_description)
    
    # Increment usage
    UsageService.increment_usage(user_id, "interview_questions")
    
    return {
        "questions": questions,
        "usage_remaining": UsageService.check_limit(user_id, "interview_questions", user.get("is_premium", False))["remaining"]
    }
