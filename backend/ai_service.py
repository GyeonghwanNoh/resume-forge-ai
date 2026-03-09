import os
from typing import Optional
import json
from pathlib import Path

# Check if using real OpenAI or mock
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
USE_REAL_AI = bool(OPENAI_API_KEY and OPENAI_API_KEY.startswith("sk-"))

if USE_REAL_AI:
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)

# Response schemas
class ScoreBreakdown:
    def __init__(self, overall: int, ats: int, clarity: int, impact: int, grammar: int):
        self.overall = overall
        self.ats = ats
        self.clarity = clarity
        self.impact = impact
        self.grammar = grammar

class ResumeAnalysisResult:
    def __init__(self, score_breakdown, missing_keywords, weak_bullets, rewritten_bullets, weaknesses):
        self.score_breakdown = score_breakdown
        self.missing_keywords = missing_keywords
        self.weak_bullets = weak_bullets
        self.rewritten_bullets = rewritten_bullets
        self.weaknesses = weaknesses


class AIService:
    @staticmethod
    def analyze_resume(resume_text: str) -> dict:
        """Analyze resume with structured scoring"""
        if USE_REAL_AI:
            return AIService._analyze_with_openai(resume_text)
        else:
            return AIService._analyze_mock(resume_text)
    
    @staticmethod
    def _analyze_with_openai(resume_text: str) -> dict:
        """Real OpenAI analysis"""
        prompt = f"""Analyze this resume and return ONLY valid JSON (no markdown, no code blocks):

Resume:
{resume_text[:2000]}

Return exactly this JSON structure with these exact keys:
{{
  "overall_score": <0-100>,
  "ats_score": <0-100>,
  "clarity_score": <0-100>,
  "impact_score": <0-100>,
  "grammar_score": <0-100>,
  "missing_keywords": ["keyword1", "keyword2"],
  "weak_bullet_points": ["weak bullet 1", "weak bullet 2"],
  "rewritten_bullets": {{"weak bullet 1": "improved version"}},
  "main_weaknesses": ["weakness 1", "weakness 2", "weakness 3"]
}}"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1500
            )
            
            result_text = response.choices[0].message.content
            # Try to parse JSON
            result = json.loads(result_text)
            return result
        except Exception as e:
            print(f"OpenAI error: {e}")
            return AIService._analyze_mock(resume_text)
    
    @staticmethod
    def _analyze_mock(resume_text: str) -> dict:
        """Mock analysis for testing/free users"""
        has_github = "github" in resume_text.lower()
        has_projects = "project" in resume_text.lower()
        has_metrics = any(c.isdigit() for c in resume_text)
        
        # Determine scores based on resume content
        base_score = 60
        base_score += 10 if has_github else 0
        base_score += 10 if has_projects else 0
        base_score += 10 if has_metrics else 0
        
        return {
            "overall_score": min(base_score, 95),
            "ats_score": 65,
            "clarity_score": 68,
            "impact_score": 62,
            "grammar_score": 75,
            "missing_keywords": [
                "REST API", "Docker", "Git", "SQL", "CI/CD",
                "AWS", "Linux", "JSON", "Testing", "Agile"
            ],
            "weak_bullet_points": [
                "Worked on backend development",
                "Helped with team projects",
                "Learned various technologies"
            ],
            "rewritten_bullets": {
                "Worked on backend development": "Architected and deployed REST APIs using Python/FastAPI, serving 10K+ daily requests with 99.5% uptime",
                "Helped with team projects": "Collaborated with cross-functional team to deliver 5+ features; led code reviews and mentored 2 junior developers",
                "Learned various technologies": "Mastered Docker, Kubernetes, and AWS Lambda; implemented CI/CD pipeline reducing deployment time by 70%"
            },
            "main_weaknesses": [
                "Resume lacks quantifiable metrics (use numbers!)",
                "Missing GitHub/portfolio link",
                "Weak action verbs (use: Architected, Optimized, Deployed instead of Worked, Helped, Learned)",
                "No deployment/DevOps experience mentioned",
                "Missing cloud platform mentions (AWS, GCP, Azure)"
            ]
        }
    
    @staticmethod
    def analyze_for_job(resume_text: str, job_description: str) -> dict:
        """Compare resume against job description for match score"""
        if USE_REAL_AI:
            return AIService._match_with_openai(resume_text, job_description)
        else:
            return AIService._match_mock(resume_text, job_description)
    
    @staticmethod
    def _match_with_openai(resume_text: str, job_description: str) -> dict:
        """Real OpenAI job matching"""
        prompt = f"""Compare this resume against a job description and return ONLY valid JSON:

Resume:
{resume_text[:1500]}

Job Description:
{job_description[:1500]}

Return exactly this JSON:
{{
  "match_score": <0-100>,
  "found_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "weak_alignment_areas": ["area1", "area2"],
  "recommendations": ["rec1", "rec2"]
}}"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1200
            )
            return json.loads(response.choices[0].message.content)
        except:
            return AIService._match_mock(resume_text, job_description)
    
    @staticmethod
    def _match_mock(resume_text: str, job_description: str) -> dict:
        """Mock job matching"""
        # Extract common keywords
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        keywords = ["python", "java", "react", "sql", "aws", "docker", "git", "api", "database"]
        found = [k for k in keywords if k in resume_lower and k in job_lower]
        missing = [k for k in keywords if k in job_lower and k not in resume_lower]
        
        match_score = 50 + (len(found) * 5)
        
        return {
            "match_score": min(match_score, 95),
            "found_keywords": found,
            "missing_keywords": missing,
            "weak_alignment_areas": [
                "Project complexity doesn't align with role level",
                "Missing deployment experience",
                "Limited evidence of system design skills"
            ],
            "recommendations": [
                "Add more technical depth to project descriptions",
                "Include tools from job description (Docker, Kubernetes, etc.)",
                "Highlight scalability and performance improvements"
            ]
        }
    
    @staticmethod
    def rewrite_bullets(weak_bullets: list) -> dict:
        """Rewrite weak bullet points"""
        if USE_REAL_AI:
            return AIService._rewrite_with_openai(weak_bullets)
        else:
            return AIService._rewrite_mock(weak_bullets)
    
    @staticmethod
    def _rewrite_with_openai(weak_bullets: list) -> dict:
        """OpenAI bullet rewrite"""
        prompt = f"""Rewrite these weak resume bullets with strong action verbs and metrics:

{json.dumps(weak_bullets)}

Return JSON with "rewritten" key containing a list of improved bullets."""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800
            )
            return json.loads(response.choices[0].message.content)
        except:
            return AIService._rewrite_mock(weak_bullets)
    
    @staticmethod
    def _rewrite_mock(weak_bullets: list) -> dict:
        """Mock bullet rewrite"""
        improvements = {
            "Worked on": "Architected, Implemented, Optimized, Deployed",
            "Helped with": "Led, Spearheaded, Directed, Orchestrated",
            "Learned": "Mastered, Achieved proficiency in, Successfully implemented",
            "Did tasks": "Executed, Delivered, Shipped, Launched",
            "Was responsible for": "Owned, Managed, Oversaw, Took ownership of"
        }
        
        rewritten = []
        for bullet in weak_bullets[:3]:
            improved = bullet
            for weak, strong in improvements.items():
                if weak.lower() in bullet.lower():
                    improved = bullet.replace(weak, strong.split(",")[0].strip())
                    break
            if " " not in improved[-10:]:
                improved += ", achieving measurable impact"
            rewritten.append(improved)
        
        return {"rewritten": rewritten}
    
    @staticmethod
    def generate_cover_letter(resume_text: str, job_description: str) -> str:
        """Generate tailored cover letter"""
        if USE_REAL_AI:
            return AIService._cover_letter_openai(resume_text, job_description)
        else:
            return AIService._cover_letter_mock()
    
    @staticmethod
    def _cover_letter_openai(resume_text: str, job_description: str) -> str:
        """OpenAI cover letter"""
        prompt = f"""Write a professional cover letter for this job:

Resume:
{resume_text[:1000]}

Job Description:
{job_description[:1000]}

Write a compelling 3-4 paragraph cover letter that highlights relevant skills."""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=600
            )
            return response.choices[0].message.content
        except:
            return AIService._cover_letter_mock()
    
    @staticmethod
    def _cover_letter_mock() -> str:
        """Mock cover letter"""
        return """Dear Hiring Manager,

I am excited to apply for the Software Engineer position at your company. With my experience in building scalable backend systems and contributing to high-impact projects, I am confident I can deliver immediate value to your team.

Throughout my career, I have developed expertise in Python, REST APIs, and cloud technologies. I am particularly drawn to your role because of its focus on system design and performance optimization—areas where I have consistently delivered results.

I would welcome the opportunity to discuss how my technical skills and problem-solving approach can contribute to your team's success. Thank you for considering my application.

Best regards"""
    
    @staticmethod
    def generate_interview_questions(job_description: str) -> list:
        """Generate targeted interview questions"""
        if USE_REAL_AI:
            return AIService._questions_openai(job_description)
        else:
            return AIService._questions_mock()
    
    @staticmethod
    def _questions_openai(job_description: str) -> list:
        """OpenAI questions"""
        prompt = f"""Based on this job description, generate 10 likely technical interview questions:

{job_description[:1000]}

Return as JSON: {{"questions": ["q1", "q2", ...]}}"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1000
            )
            result = json.loads(response.choices[0].message.content)
            return result.get("questions", AIService._questions_mock())
        except:
            return AIService._questions_mock()
    
    @staticmethod
    def _questions_mock() -> list:
        """Mock questions"""
        return [
            "Explain the difference between REST and GraphQL APIs",
            "Design a database schema for a social media application",
            "How would you optimize a slow database query?",
            "Describe your experience with Docker and containerization",
            "Walk us through a challenging bug you fixed",
            "How do you approach system design and scalability?",
            "What testing strategies do you use in your projects?",
            "Explain your experience with Git and version control",
            "How do you handle errors and exceptions in production?",
            "Tell us about your experience with CI/CD pipelines"
        ]
