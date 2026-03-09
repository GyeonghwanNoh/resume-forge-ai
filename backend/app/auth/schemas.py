from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


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


class ResumeUpload(BaseModel):
    filename: str
    content: str


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    original_text: str
    created_at: str


class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
    user_id: str
    score: int
    issues: list
    suggestions: list
    created_at: str


class CoverLetterRequest(BaseModel):
    job_description: str
    resume_id: str


class InterviewQuestionsRequest(BaseModel):
    job_description: str


class ImproveResumeRequest(BaseModel):
    resume_id: str
    issues_to_fix: list
