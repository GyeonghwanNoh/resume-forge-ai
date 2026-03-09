# ResumeForge AI - Backend (FastAPI)

This folder is the backend app deployed to **Render**.

---

## Local Development

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

Backend URL: http://localhost:8000

Docs: http://localhost:8000/docs

---

## Production Start Command (Render)

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Deploy to Render (Simple Click Path)

1. Open Render dashboard
2. Click **New +**
3. Click **Web Service**
4. Select your GitHub repo
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables below
7. Click **Create Web Service**

You can also use [render.yaml](render.yaml).

---

## Backend Environment Variables (Render)

```env
ENVIRONMENT=production
SECRET_KEY=replace-with-a-long-random-secret-string
FRONTEND_URL=https://<YOUR_FRONTEND_PROJECT>.vercel.app
CORS_ORIGINS=https://<YOUR_FRONTEND_PROJECT>.vercel.app,http://localhost:3000,http://127.0.0.1:3000
OPENAI_API_KEY=
DATA_DIR=data
UPLOAD_DIR=uploads
```

---

## CORS Update Rule (Important)

If your Vercel URL changes:

1. Open Render service → **Environment**
2. Update:

```env
FRONTEND_URL=https://<NEW_FRONTEND_URL>.vercel.app
CORS_ORIGINS=https://<NEW_FRONTEND_URL>.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

3. Save and redeploy/restart backend

---

## Verify Backend After Deploy

Open in browser:

- `https://<YOUR_BACKEND_PROJECT>.onrender.com/health`
- `https://<YOUR_BACKEND_PROJECT>.onrender.com/docs`

---

## MVP Storage Limitation

This project currently uses local JSON files and local uploads.

On Render, local disk may reset on redeploy/restart.

So this setup is suitable for MVP demos/testing, but not long-term durable storage.

