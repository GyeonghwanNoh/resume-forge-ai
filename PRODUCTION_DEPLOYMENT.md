# ResumeForge AI - Production Deployment & Payment Guide

This guide covers:
1. **Deployment to Vercel (frontend) + Render (backend)**
2. **Preparing for Stripe payment integration**
3. **Environment variables and CORS setup**
4. **Verification steps**

---

## Part 1: Deployment Readiness Checklist

### ✅ Backend Readiness

- [x] FastAPI app with production CORS configuration
- [x] Environment-based configuration (not hardcoded)
- [x] Storage initialization (creates `data/` and `uploads/` automatically)
- [x] JSON files for MVP (easy to migrate to PostgreSQL later)
- [x] JWT authentication ready
- [x] User model with subscription fields:
  - `plan`: "free" or "pro"
  - `billing_status`: null | "active" | "canceled" | "past_due"
  - `stripe_customer_id`: for Stripe integration
  - `stripe_subscription_id`: for Stripe integration

### ✅ Frontend Readiness

- [x] Next.js 14 with App Router
- [x] API URL from environment variable
- [x] Pricing page with Stripe CTA placeholders
- [x] Auth hooks and token management
- [x] Production-safe build

---

## Part 2: Exact Vercel Deployment Steps

### Step 1: Push Code to GitHub (If Not Done)

```bash
cd c:\resume-forge-ai
git add .
git commit -m "Production deployment: payment prep + Stripe groundwork"
git push origin main
```

### Step 2: Deploy Frontend on Vercel

**In Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Click **Add New...**
3. Click **Project**
4. Select your GitHub repo `resume-forge-ai`
5. In the **Configure Project** dialog:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
6. Click **Deploy**

### Step 3: Add Frontend Environment Variables

After deployment starts:

1. Go to **Settings** → **Environment Variables**
2. Add these values:

```env
NEXT_PUBLIC_API_URL=https://<YOUR_BACKEND_URL>.onrender.com
NEXT_PUBLIC_APP_URL=https://<YOUR_FRONTEND_PROJECT>.vercel.app
```

3. Click **Save**
4. Redeploy frontend (go to **Deployments** → **Redeploy** on latest)

---

## Part 3: Exact Render Deployment Steps

### Step 1: Deploy Backend on Render

**In Render Dashboard:**

1. Go to https://dashboard.render.com
2. Click **New +**
3. Click **Web Service**
4. Select your GitHub repo
5. Configure:
   - **Name**: `resumeforge-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3.11`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Choose **Free tier** (or **Starter** for better uptime)
7. Click **Create Web Service**

### Step 2: Add Backend Environment Variables

On your Render service page:

1. Go to **Environment**
2. Add all these variables:

```env
ENVIRONMENT=production
SECRET_KEY=your-long-random-secret-key-here-at-least-32-chars
FRONTEND_URL=https://<YOUR_VERCEL_PROJECT>.vercel.app
CORS_ORIGINS=https://<YOUR_VERCEL_PROJECT>.vercel.app,http://localhost:3000,http://127.0.0.1:3000
OPENAI_API_KEY=sk-your-key-here-or-leave-empty-for-mock
DATA_DIR=data
UPLOAD_DIR=uploads
```

3. Click **Save Changes**
4. Service will auto-redeploy

### Step 3: Get Backend URL

After Render deployment completes:

1. Open your service
2. Copy the **URL** (looks like: `https://resumeforge-backend.onrender.com`)
3. Update Vercel with this URL (see **Step 3** above)

---

## Part 4: Production Environment Variables Reference

### Backend (.env on Render)

| Variable | Example | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | `production` | App mode |
| `SECRET_KEY` | (random 32+ chars) | JWT signing key |
| `FRONTEND_URL` | `https://resumeforge.vercel.app` | Allowed origin for CORS |
| `CORS_ORIGINS` | `https://resumeforge.vercel.app,http://localhost:3000` | Comma-separated allowed origins |
| `OPENAI_API_KEY` | `sk-...` | Optional; leave empty for mock responses |
| `DATA_DIR` | `data` | Local data directory |
| `UPLOAD_DIR` | `uploads` | Local uploads directory |

### Frontend (.env on Vercel)

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://resumeforge-backend.onrender.com` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | `https://resumeforge.vercel.app` | Frontend URL (for SEO/sharing) |

---

## Part 5: Post-Deployment Verification

### ✅ Backend Health Check

Open these URLs in a browser:

```
https://<YOUR_BACKEND>.onrender.com/health
https://<YOUR_BACKEND>.onrender.com/docs
```

Expected:
- `/health` returns: `{"status": "ok"}`
- `/docs` shows FastAPI Swagger UI

### ✅ Frontend Functionality Test

1. Open `https://<YOUR_FRONTEND>.vercel.app`
2. Click **Sign Up**
3. Register with test email
4. Verify you're logged in (should see dashboard)
5. Go to **Pricing** page
6. Verify Pro upgrade button is present (shows "Coming soon" alert for now)

### ✅ API Connection Test

In browser console on the frontend:

```javascript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Test auth endpoint
api.post('/api/auth/login', {
  email: 'test@example.com',
  password: 'test123',
}).then(res => console.log(res.data));
```

Expected: Should return error "Invalid credentials" or valid token response.

---

## Part 6: Common Deployment Issues & Fixes

### ❌ CORS Error in Browser

**Symptom**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix**:
1. Check Vercel frontend URL
2. Update Render env: `CORS_ORIGINS=https://<your-vercel-url>,http://localhost:3000`
3. Redeploy backend

### ❌ 404 on /api/auth/login

**Symptom**: `{"detail": "Not Found"}`

**Fix**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel ends with backend URL (no trailing slash)
2. Check backend is running: visit `/health` endpoint
3. Verify `CORS_ORIGINS` includes your Vercel URL

### ❌ Upload fails with 401

**Symptom**: File upload returns `{"detail": "Not authenticated"}`

**Fix**:
1. Clear browser **Local Storage** (DevTools → Application → Local Storage)
2. Sign out and sign back in
3. Retry upload

### ❌ Render service won't start

**Symptom**: "Build failed" or "Service crashed"

**Fix**:
1. Check **Build Command**: `pip install -r requirements.txt`
2. Check **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Check **Root Directory**: `backend`
4. View Render logs (bottom of service page) for error details

---

## Part 7: Data Persistence Warning

⚠️ **Important for MVP**

Current app stores data in **local JSON files**:
- `data/users.json`
- `data/resumes.json`
- `data/analyses.json`
- etc.

**On Render's free tier:**
- Local files may be reset when service restarts or redeploys
- Not suitable for production data

**Upgrade path:**
1. **Short term (MVP)**: Use free tier for demos/testing only
2. **Medium term**: Move to PostgreSQL (managed via Render)
3. **Long term**: Add S3 for uploads, managed database for data

---

## Part 8: Payment Integration Prep - What We've Done

✅ **Backend**:
- Added user model fields: `plan`, `billing_status`, `stripe_customer_id`, `stripe_subscription_id`
- Created `subscription_service.py` with plan limits and validation functions
- Auth endpoints now return `plan` and `billing_status`

✅ **Frontend**:
- Pricing page detects logged-in users
- Pro "Upgrade" button shows loading state
- Placeholder for Stripe Checkout integration

✅ **Architecture**:
- No Stripe SDK dependencies yet (keep it simple)
- Service functions ready for Stripe API calls
- User model prepared for payment data

---

## Part 9: Next Steps for Stripe Integration

When you're ready to add Stripe payments, follow this checklist:

### Phase 1: Stripe Account Setup

- [ ] Create Stripe account at https://stripe.com
- [ ] Get **Publishable Key** and **Secret Key** from Dashboard
- [ ] Get **Webhook Signing Secret** (for events)

### Phase 2: Backend Stripe Setup

- [ ] Install Stripe SDK: `pip install stripe`
- [ ] Add to `.env`:
  ```env
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  STRIPE_PRICE_ID_PRO=price_... (get this from Stripe)
  ```
- [ ] Create `/api/billing/checkout` endpoint (returns Stripe session ID)
- [ ] Create `/api/billing/webhook` endpoint (handles Stripe events)
- [ ] Implement in `subscription_service.py`:
  - `create_checkout_session(user_id, email)`
  - `handle_webhook_event(event)`
  - `update_user_plan_after_payment(user_id, stripe_subscription_id)`

### Phase 3: Frontend Stripe Setup

- [ ] Install Stripe SDK: `npm install @stripe/react-stripe-js @stripe/js`
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel env
- [ ] Update pricing page `handleUpgrade()`:
  ```typescript
  // 1. Call POST /api/billing/checkout
  // 2. Get stripe_session_id from response
  // 3. Redirect: const stripe = await loadStripe(key);
  //    await stripe.redirectToCheckout({ sessionId })
  ```

### Phase 4: Testing

- [ ] Use Stripe test keys (`pk_test_`, `sk_test_`)
- [ ] Test credit card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)
- [ ] Test webhook delivery with `stripe listen --forward-to localhost:8000/api/billing/webhook`
- [ ] Verify user's `stripe_customer_id` and `plan` update after payment

### Phase 5: Launch

- [ ] Switch to Stripe **live keys** (no `_test_` in key names)
- [ ] Update backend `.env` on Render with live keys
- [ ] Test one more time with real card
- [ ] Launch to users

---

## Stripe Integration Code Skeleton

Here's what the backend endpoints should look like (add to `main_api_upgraded.py`):

```python
# TODO: Add these endpoints once Stripe SDK is installed

@router.post("/api/billing/checkout")
async def create_checkout(current_user: dict = Depends(get_current_user)):
    """Create Stripe checkout session"""
    # 1. Check user plan (if already pro, return error)
    # 2. Create Stripe customer if stripe_customer_id is null
    # 3. Create checkout session via stripe.checkout.Session.create()
    # 4. Return { "session_id": session.id }
    pass

@router.post("/api/billing/webhook")
async def handle_stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    # 1. Verify webhook signature
    # 2. Handle event types:
    #    - charge.succeeded: upgrade user to pro
    #    - customer.subscription.deleted: downgrade to free
    # 3. Update user model via database
    pass

@router.get("/api/billing/portal")
async def get_billing_portal(current_user: dict = Depends(get_current_user)):
    """Get Stripe billing portal URL for subscription management"""
    # 1. Get user's stripe_customer_id
    # 2. Create Stripe billing session via stripe.BillingPortal.Session.create()
    # 3. Return { "url": session.url }
    pass
```

---

## Final Checklist Before Launch

- [ ] Both Vercel and Render deployments successful
- [ ] Backend `/health` returns 200 OK
- [ ] Frontend loads and login/signup work
- [ ] Pricing page shows without errors
- [ ] `NEXT_PUBLIC_API_URL` is correctly set in Vercel
- [ ] `CORS_ORIGINS` includes your Vercel URL in Render
- [ ] All tests pass locally before pushing
- [ ] GitHub has latest code committed and pushed
- [ ] No `.env` files committed (only `.env.example`)
- [ ] No localhost URLs in production environment variables

---

**Ready to go live!** 🚀
