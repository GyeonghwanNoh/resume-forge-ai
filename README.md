# ResumeForge AI - SaaS MVP

AI-powered resume improvement platform for non-native English speakers and early-career developers.

## 🚀 Overview

ResumeForge AI is a production-ready MVP built for solo deployment. It helps users:
- Analyze resumes with AI scoring (0-100)
- Optimize for ATS (Applicant Tracking Systems)
- Generate customized cover letters
- Prepare for technical interviews
- Improve weak bullet points with AI

## 📋 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls

**Backend:**
- FastAPI (Python)
- OpenAI API integration
- JSON-based storage (easy migration to PostgreSQL)
- JWT authentication

**Deployment:**
- Frontend → Vercel
- Backend → Railway or Render

## 🚀 Fastest Deployment Path (Recommended)

Choose your guide based on what you need:

### For Deployment Only
Start here: [DEPLOYMENT.md](DEPLOYMENT.md)
- Beginner-friendly, click-by-click instructions
- Vercel + Render setup
- 10 minutes to production

### For Production Deployment + Payment Integration
Start here: [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
- Detailed verification steps
- Production environment variables
- Data persistence warning
- Stripe payment prep (groundwork included)

### For Quick Reference
Use: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Command checklists
- Environment variable table
- Git commands
- Stripe timeline

### For Stripe Payment Implementation
Follow: [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)
- 6-phase integration plan
- Code templates for backend endpoints
- Testing checklist
- Common issues & fixes
- Migration from test to live keys

## 🏗️ Project Structure

```
resume-forge-ai/
├── frontend/          # Next.js 14 frontend
│   ├── app/          # Pages (landing, auth, dashboard)
│   ├── components/   # Reusable components
│   ├── lib/          # API clients and utilities
│   └── public/       # Assets
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── auth/     # JWT authentication
│   │   ├── resumes/  # Resume management
│   │   ├── ai/       # OpenAI integration
│   │   ├── db/       # JSON database layer
│   │   └── main.py   # FastAPI app
│   ├── data/         # JSON storage files
│   └── requirements.txt
└── README.md
```

## 🔧 Setup Instructions

### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add:
# - OPENAI_API_KEY from OpenAI
# - SECRET_KEY (generate a random string)
```

5. **Run backend:**
```bash
python main.py
```

Server runs at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL if backend is not localhost:8000
```

4. **Run frontend:**
```bash
npm run dev
```

App runs at `http://localhost:3000`

## 📌 Core Features

### 1. Resume Upload & Parsing
- Supports PDF, DOCX, TXT
- Automatic text extraction
- Stores in JSON database

### 2. AI Resume Analysis
```
Score: 0-100
Issues:
- Bullet points too vague
- Missing quantifiable results
- Weak action verbs

Suggestions:
- Use stronger verbs (Developed vs Built)
- Add metrics and impact
- Include technical keywords
```

### 3. Resume Improvement
- AI-powered rewriting
- Fixes identified issues
- Uses strong action verbs
- Adds measurable impact

### 4. Cover Letter Generator
- Takes job description
- Generates customized letter
- Uses resume context
- Professional format

### 5. Interview Questions
- Job description analysis
- 10 technical questions
- Role-specific preparation

### 6. Freemium Model
- **Free:** 3 analyses/month
- **Pro:** Unlimited ($9.99/month)

## 🔐 Authentication

- Email + password signup/login
- JWT tokens (30 min expiry)
- Secure password hashing (bcrypt)
- Client-side token storage

## 🗄️ Database

Currently uses JSON files in `data/` directory:
- `users.json` - User accounts
- `resumes.json` - Uploaded resumes
- `analyses.json` - Analysis results
- `cover_letters.json` - Generated letters
- `interview_questions.json` - Generated questions

**Easy migration path:** Replace JSONDatabase with PostgreSQL connector (same interface).

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Render)
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy

## 🌐 Production Deployment Guide (Vercel + Render)

For the beginner-friendly version with UI click paths, use [DEPLOYMENT.md](DEPLOYMENT.md).

### 1) Push project to GitHub

```bash
git add .
git commit -m "Prepare production deployment for Vercel + Render"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2) Deploy backend on Render

- Service type: **Web Service**
- Root directory: `backend`
- Build command:

```bash
pip install -r requirements.txt
```

- Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Backend environment variables:

```env
ENVIRONMENT=production
SECRET_KEY=<long-random-secret>
FRONTEND_URL=https://<your-frontend>.vercel.app
CORS_ORIGINS=https://<your-frontend>.vercel.app,http://localhost:3000
OPENAI_API_KEY=<optional>
DATA_DIR=data
UPLOAD_DIR=uploads
```

### 3) Deploy frontend on Vercel

- Framework: Next.js
- Root directory: `frontend`
- Build command: `npm run build` (default)

Frontend environment variables:

```env
NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com
NEXT_PUBLIC_APP_URL=https://<your-frontend>.vercel.app
```

### 4) Verify release

- Backend health: `https://<your-backend>.onrender.com/health`
- Backend docs: `https://<your-backend>.onrender.com/docs`
- Frontend loads and login/signup works
- Resume upload + analyze flow works end-to-end

## ✅ Pre-Launch Checklist

- [ ] Backend is deployed on Render and `/health` returns OK
- [ ] Frontend is deployed on Vercel
- [ ] `NEXT_PUBLIC_API_URL` points to Render backend URL
- [ ] `CORS_ORIGINS` includes Vercel frontend URL
- [ ] `SECRET_KEY` is set (not default)
- [ ] Signup/login works in production
- [ ] Resume upload/analyze works in production
- [ ] No localhost URLs in production env vars

## ⚠ Most Likely Deployment Errors

1. **CORS blocked in browser**
	- Cause: Missing Vercel URL in backend CORS env

2. **Upload fails with 401/403**
	- Cause: Missing token or auth header

3. **Frontend calls localhost in production**
	- Cause: `NEXT_PUBLIC_API_URL` not set in Vercel

4. **Render boot fails**
	- Cause: wrong start command or wrong root directory

5. **Data resets after redeploy**
	- Cause: JSON/local file storage on ephemeral disk

## 🛠 Quick Fixes

- Re-check Vercel env:
  - `NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com`
- Re-check Render env:
  - `CORS_ORIGINS=https://<your-frontend>.vercel.app,http://localhost:3000`
- Re-deploy both services after changing env vars
- For auth issues, clear browser local storage and login again
- For long-term persistence, plan migration from JSON files to managed DB/object storage

## 📊 API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes/list` - List user's resumes
- `POST /api/resumes/analyze/{id}` - Analyze
- `POST /api/resumes/improve` - Improve
- `POST /api/resumes/cover-letter` - Generate cover letter
- `POST /api/resumes/interview-questions` - Generate questions

## 🎯 Future Features (Premium)

### 1. Advanced ATS Analysis
- Keyword optimization
- Format compliance checking
- Industry-specific recommendations

### 2. Multi-Language Support
- Automatically detect & improve non-native English
- Grammar and tone refinement
- Localization for different markets

### 3. Job Matching Engine
- Compare resume with job descriptions
- Identify skill gaps
- Suggest learning resources
- Track job applications

## 💡 Growth Strategies

### Strategy 1: Content + SEO
- Blog: "Resume tips for international students"
- Free resume templates
- Interview question database
- Target: Non-native English + career switchers
- Growth: Organic search + social media

### Strategy 2: B2B University Partnerships
- Partner with international universities
- Offer free tier to students
- Convert to paid when job hunting
- Build student community
- Growth: Word-of-mouth referrals

## 💰 Pricing Model

| Plan | Cost | Features |
|------|------|----------|
| Free | $0 | 3 analyses/month, 2 cover letters |
| Pro | $9.99/month | Unlimited, advanced ATS, priority support |

**Expansion:** Add Team plan ($24.99/month) for career advisors.

## 🛠️ Development Notes

### Code Quality
- Clean separation of concerns
- Modular AI service
- Reusable components
- Type-safe (TypeScript)
- Environment-based config

### Scaling Considerations
- JSON→PostgreSQL (same interface)
- Redis for session caching
- Queue system for AI processing (Celery)
- CDN for assets (Cloudflare)

## 📝 Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=sk-...
SECRET_KEY=your-secret-key
ENVIRONMENT=production
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://api.resumeforge.com
NEXT_PUBLIC_APP_URL=https://resumeforge.com
```

## 🐛 Common Issues

**Issue:** CORS errors
**Solution:** Update FRONTEND_URL in backend .env

**Issue:** OpenAI rate limit
**Solution:** Add queue system or upgrade OpenAI plan

**Issue:** JSON files not found
**Solution:** Backend creates them automatically

## 📞 Support

For questions, check the individual README files:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 📄 License

MIT License - Feel free to modify and deploy
