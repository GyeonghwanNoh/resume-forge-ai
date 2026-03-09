from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Header
from typing import Optional
from app.resumes.parser import parse_resume
from app.resumes.crud import create_resume, get_resume, get_user_resumes, create_analysis, create_cover_letter, create_interview_questions
from app.ai.service import ai_service
from app.auth.security import decode_token
from app.resumes.schemas import AnalysisResponse, CoverLetterRequest, InterviewQuestionsRequest, ImproveResumeRequest
from app.config import settings

router = APIRouter(prefix="/api/resumes", tags=["resumes"])


def get_current_user_id(authorization: str = Header(None)) -> str:
    """Extract user ID from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload.get("sub")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), authorization: str = Header(None)):
    """Upload and parse a resume file"""
    user_id = get_current_user_id(authorization)
    
    try:
        content = await file.read()
        resume_text = parse_resume(file.filename, content)
        
        resume = create_resume(
            user_id=user_id,
            filename=file.filename,
            original_text=resume_text
        )
        
        return {
            "id": resume["id"],
            "filename": resume["filename"],
            "created_at": resume["created_at"],
            "message": "Resume uploaded successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error uploading resume")


@router.get("/list")
async def list_resumes(authorization: str = Header(None)):
    """List all resumes for current user"""
    user_id = get_current_user_id(authorization)
    resumes = get_user_resumes(user_id)
    return resumes


@router.get("/{resume_id}")
async def get_resume_detail(resume_id: str, authorization: str = Header(None)):
    """Get resume details"""
    user_id = get_current_user_id(authorization)
    resume = get_resume(resume_id)
    
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume


@router.post("/analyze/{resume_id}")
async def analyze_resume(resume_id: str, authorization: str = Header(None)):
    """Analyze a resume"""
    user_id = get_current_user_id(authorization)
    resume = get_resume(resume_id)
    
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Check freemium limits
    analyses = get_user_resumes(user_id)
    if len(analyses) >= settings.FREE_ANALYSES_PER_MONTH:
        raise HTTPException(status_code=429, detail="Free analysis limit exceeded")
    
    # Analyze using AI
    analysis_result = ai_service.analyze_resume(resume["original_text"])
    
    analysis = create_analysis(
        resume_id=resume_id,
        user_id=user_id,
        score=analysis_result.get("score", 50),
        issues=analysis_result.get("issues", []),
        suggestions=analysis_result.get("suggestions", [])
    )
    
    return AnalysisResponse(
        id=analysis["id"],
        resume_id=analysis["resume_id"],
        score=analysis["score"],
        issues=analysis["issues"],
        suggestions=analysis["suggestions"],
        created_at=analysis["created_at"]
    )


@router.post("/improve")
async def improve_resume(request: ImproveResumeRequest, authorization: str = Header(None)):
    """Improve resume by rewriting weak sections"""
    user_id = get_current_user_id(authorization)
    resume = get_resume(request.resume_id)
    
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    improved_text = ai_service.improve_resume(resume["original_text"], request.issues_to_fix)
    
    return {
        "original": resume["original_text"],
        "improved": improved_text
    }


@router.post("/cover-letter")
async def generate_cover_letter(request: CoverLetterRequest, authorization: str = Header(None)):
    """Generate a cover letter based on resume and job description"""
    user_id = get_current_user_id(authorization)
    resume = get_resume(request.resume_id)
    
    if not resume or resume["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    cover_letter = ai_service.generate_cover_letter(resume["original_text"], request.job_description)
    
    letter_record = create_cover_letter(
        resume_id=request.resume_id,
        user_id=user_id,
        job_description=request.job_description,
        cover_letter_text=cover_letter
    )
    
    return {
        "id": letter_record["id"],
        "cover_letter": cover_letter,
        "created_at": letter_record["created_at"]
    }


@router.post("/interview-questions")
async def generate_interview_questions(request: InterviewQuestionsRequest, authorization: str = Header(None)):
    """Generate interview questions based on job description"""
    user_id = get_current_user_id(authorization)
    
    questions = ai_service.generate_interview_questions(request.job_description)
    
    return {
        "questions": questions
    }
