from fastapi import FastAPI, HTTPException, File, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import json
import os
import uuid
from pathlib import Path
from typing import Optional, List

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DATA_DIR = Path("./data")
UPLOAD_DIR = Path("./uploads")

# Create directories
DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
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

class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
    score: int
    issues: List[str]
    suggestions: List[str]
    created_at: str

# FastAPI App
app = FastAPI(
    title="ResumeForge AI API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
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

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# JSON Database Functions
def get_users_db():
    db_file = DATA_DIR / "users.json"
    if db_file.exists():
        with open(db_file) as f:
            return json.load(f)
    return {}

def save_users_db(data):
    with open(DATA_DIR / "users.json", "w") as f:
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

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "ResumeForge AI API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    users = get_users_db()
    users[user_id] = {
        "id": user_id,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True,
    }
    save_users_db(users)
    
    user = users[user_id]
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
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

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
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

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        created_at=user["created_at"],
        is_active=user["is_active"]
    )

@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    try:
        content = await file.read()
        resume_id = str(uuid.uuid4())
        
        # Save resume
        resumes_db = {}
        db_file = DATA_DIR / "resumes.json"
        if db_file.exists():
            with open(db_file) as f:
                resumes_db = json.load(f)
        
        resumes_db[resume_id] = {
            "id": resume_id,
            "user_id": user_id,
            "filename": file.filename,
            "original_text": content.decode("utf-8", errors="ignore"),
            "created_at": datetime.utcnow().isoformat(),
        }
        
        with open(db_file, "w") as f:
            json.dump(resumes_db, f, indent=2, default=str)
        
        return {
            "id": resume_id,
            "filename": file.filename,
            "created_at": datetime.utcnow().isoformat(),
            "message": "Resume uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")

@app.get("/api/resumes/list")
async def list_resumes(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    db_file = DATA_DIR / "resumes.json"
    if not db_file.exists():
        return []
    
    with open(db_file) as f:
        resumes = json.load(f)
    
    user_resumes = [r for r in resumes.values() if r.get("user_id") == user_id]
    return user_resumes

@app.post("/api/resumes/analyze/{resume_id}")
async def analyze_resume(resume_id: str, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    db_file = DATA_DIR / "resumes.json"
    if not db_file.exists():
        raise HTTPException(status_code=404, detail="Resume not found")
    
    with open(db_file) as f:
        resumes = json.load(f)
    
    resume = resumes.get(resume_id)
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Mock analysis
    analysis_id = str(uuid.uuid4())
    analyses_db = {}
    analyses_file = DATA_DIR / "analyses.json"
    if analyses_file.exists():
        with open(analyses_file) as f:
            analyses_db = json.load(f)
    
    analyses_db[analysis_id] = {
        "id": analysis_id,
        "resume_id": resume_id,
        "user_id": user_id,
        "score": 72,
        "issues": [
            "Bullet points are too vague",
            "Missing quantifiable results",
            "No GitHub or portfolio links"
        ],
        "suggestions": [
            "Use strong action verbs (Developed, Implemented, Optimized)",
            "Add metrics and impact (e.g., '30% improvement')",
            "Include technical keywords and frameworks"
        ],
        "created_at": datetime.utcnow().isoformat(),
    }
    
    with open(analyses_file, "w") as f:
        json.dump(analyses_db, f, indent=2, default=str)
    
    return analyses_db[analysis_id]

@app.post("/api/resumes/improve")
async def improve_resume(request: dict, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    return {
        "original": "Worked on backend.",
        "improved": "Developed and optimized REST APIs using Python and FastAPI, achieving 30% improvement in system performance and reducing API latency by 45%."
    }

@app.post("/api/resumes/cover-letter")
async def generate_cover_letter(request: dict, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    return {
        "id": str(uuid.uuid4()),
        "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Engineer position...",
        "created_at": datetime.utcnow().isoformat()
    }

@app.post("/api/resumes/interview-questions")
async def generate_interview_questions(request: dict, authorization: str = Header(None)):
    return {
        "questions": [
            "Explain RESTful API design principles.",
            "What is the difference between async and sync programming?",
            "How would you design a scalable database?",
            "Describe a challenging project and how you solved it.",
            "What design patterns are you familiar with?",
            "How do you handle errors in your code?",
            "Explain microservices architecture.",
            "What is your experience with testing?",
            "How do you optimize database queries?",
            "Tell us about your experience with DevOps/CI-CD."
        ]
    }
