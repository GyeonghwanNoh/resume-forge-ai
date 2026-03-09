# ResumeForge AI - Frontend (Next.js 14)

This folder is the frontend app deployed to **Vercel**.

---

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: http://localhost:3000

---

## Production Build Commands

```bash
npm run build
npm run start
```

---

## Deploy to Vercel (Simple Click Path)

1. Go to Vercel dashboard
2. Click **Add New...**
3. Click **Project**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default OK)
   - **Install Command**: `npm install` (default OK)
6. Add environment variables (below)
7. Click **Deploy**

---

## Frontend Environment Variables (Vercel)

Set these in **Project → Settings → Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://<YOUR_BACKEND_PROJECT>.onrender.com
NEXT_PUBLIC_APP_URL=https://<YOUR_FRONTEND_PROJECT>.vercel.app
```

> Important: `NEXT_PUBLIC_API_URL` must be your Render backend URL, not localhost.

---

## Verify After Deploy

- Open deployed frontend URL
- Signup
- Login
- Upload resume
- Analyze resume

If API calls fail, check `NEXT_PUBLIC_API_URL` first.

---

## Quick Troubleshooting

### Frontend still calling localhost

- Update `NEXT_PUBLIC_API_URL` in Vercel
- Redeploy frontend

### CORS error in browser

- Backend `CORS_ORIGINS` is missing your Vercel URL
- Update Render env and redeploy backend

---

## File references

- API client: [lib/api.ts](lib/api.ts)
- Env example: [.env.example](.env.example)
- Global deploy guide: [../DEPLOYMENT.md](../DEPLOYMENT.md)
