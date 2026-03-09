# ResumeForge AI Deployment Guide (Beginner Friendly)

This guide helps you deploy **existing code** with minimum confusion:

- Frontend → **Vercel**
- Backend → **Render**

---

## 0) Before You Start

You need:

- A GitHub account
- A Vercel account (login with GitHub recommended)
- A Render account (login with GitHub recommended)
- (Optional) OpenAI API key

---

## 1) Push Project to GitHub (Copy-Paste)

Run this from the project root:

```bash
git add .
git commit -m "deployment docs + production config"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

If `remote origin already exists`, run:

```bash
git remote set-url origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 2) Deploy Backend on Render

### Click path in Render

1. Open Render dashboard
2. Click **New +**
3. Click **Web Service**
4. Select your GitHub repo
5. Configure using values below

### Exact Render settings

- **Name**: `resumeforge-backend` (or any name)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**:

```bash
pip install -r requirements.txt
```

- **Start Command**:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Backend environment variables (exact)

Add these in Render → your service → **Environment** tab:

```env
ENVIRONMENT=production
SECRET_KEY=replace-with-a-long-random-secret-string
FRONTEND_URL=https://<YOUR_FRONTEND_PROJECT>.vercel.app
CORS_ORIGINS=https://<YOUR_FRONTEND_PROJECT>.vercel.app,http://localhost:3000,http://127.0.0.1:3000
OPENAI_API_KEY=
DATA_DIR=data
UPLOAD_DIR=uploads
```

> If you have OpenAI key, put it in `OPENAI_API_KEY`. If empty, app still works with mock AI responses.

### Save backend URL

After deploy, copy your backend URL:

```text
https://<YOUR_BACKEND_PROJECT>.onrender.com
```

---

## 3) Deploy Frontend on Vercel

### Click path in Vercel

1. Open Vercel dashboard
2. Click **Add New...**
3. Click **Project**
4. Import your GitHub repo
5. In project setup, set values below

### Exact Vercel settings

- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (default is fine)
- **Output Directory**: leave default
- **Install Command**: `npm install` (default is fine)

### Frontend environment variables (exact)

In Vercel project → **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://<YOUR_BACKEND_PROJECT>.onrender.com
NEXT_PUBLIC_APP_URL=https://<YOUR_FRONTEND_PROJECT>.vercel.app
```

---

## 4) Update CORS After Frontend URL Is Final

If your frontend URL changes (for example new Vercel project name):

1. Go to Render backend service
2. Open **Environment**
3. Update these values:

```env
FRONTEND_URL=https://<NEW_FRONTEND_URL>.vercel.app
CORS_ORIGINS=https://<NEW_FRONTEND_URL>.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

4. Click **Save Changes**
5. Trigger redeploy (or manual restart)

---

## 5) Live Site Test Checklist (After Deploy)

### Backend checks

Open in browser:

- `https://<YOUR_BACKEND_PROJECT>.onrender.com/health`
- `https://<YOUR_BACKEND_PROJECT>.onrender.com/docs`

Expected:

- `/health` returns status ok
- `/docs` opens FastAPI Swagger page

### Frontend checks

Open:

- `https://<YOUR_FRONTEND_PROJECT>.vercel.app`

Test this flow:

1. Signup
2. Login
3. Upload resume
4. Analyze resume
5. Open dashboard

---

## 6) Fast Troubleshooting

### A) CORS error in browser console

Fix: update `CORS_ORIGINS` in Render with exact Vercel URL, save, redeploy.

### B) Frontend calls localhost in production

Fix: check Vercel env `NEXT_PUBLIC_API_URL` is Render URL, then redeploy frontend.

### C) Upload fails with 401

Fix:

1. login again
2. clear browser local storage
3. retry

### D) Render service does not start

Check:

- Root Directory = `backend`
- Start Command = `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 7) Important MVP Limitation (Local JSON Storage)

Current app stores data in local JSON files and local uploads.

On Render, local disk may reset on redeploy/restart.

So for MVP:

- OK for demos and early testing
- Not ideal for long-term persistent production data

When ready, migrate storage to managed DB/object storage.
