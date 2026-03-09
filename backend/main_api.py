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

# Configuration
SECRET_KEY = "dev-secret-key-change-in-production"
FRONTEND_URL = "http://localhost:3000"
DATA_DIR = Path("./data")
UPLOAD_DIR = Path("./uploads")

# Create directories
DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

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

# FastAPI App
app = FastAPI(title="ResumeForge AI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
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

# Routes
@app.get("/")
async def root():
    return {"message": "ResumeForge AI API running", "version": "1.0.0", "docs": "/docs"}

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

@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    
    content = await file.read()
    resume_id = str(uuid.uuid4())
    
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
    
    return {"id": resume_id, "filename": file.filename, "created_at": datetime.utcnow().isoformat(), "message": "Resume uploaded"}

@app.get("/api/resumes/list")
async def list_resumes(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    db_file = DATA_DIR / "resumes.json"
    if not db_file.exists():
        return []
    
    with open(db_file) as f:
        resumes = json.load(f)
    return [r for r in resumes.values() if r.get("user_id") == user_id]

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
        "issues": ["Bullet points are too vague", "Missing quantifiable results", "No GitHub links"],
        "suggestions": ["Use strong action verbs", "Add metrics and impact", "Include technical keywords"],
        "created_at": datetime.utcnow().isoformat(),
    }
    
    with open(analyses_file, "w") as f:
        json.dump(analyses_db, f, indent=2, default=str)
    
    return analyses_db[analysis_id]

@app.post("/api/resumes/improve")
async def improve_resume(request: dict, authorization: str = Header(None)):
    get_current_user_id(authorization)
    return {"original": "Worked on backend.", "improved": "Developed REST APIs using Python and FastAPI, achieving 30% performance improvement."}

@app.post("/api/resumes/cover-letter")
async def generate_cover_letter(request: dict, authorization: str = Header(None)):
    get_current_user_id(authorization)
    return {"id": str(uuid.uuid4()), "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Engineer position at your company...", "created_at": datetime.utcnow().isoformat()}

@app.post("/api/resumes/interview-questions")
async def generate_interview_questions(request: dict, authorization: str = Header(None)):
    return {"questions": ["Explain RESTful API design", "What is async programming?", "How to design scalable databases?", "Describe a challenging project", "What design patterns do you know?", "How do you handle errors?", "Explain microservices", "Your testing experience?", "Optimize database queries?", "Your DevOps/CI-CD experience?"]}
