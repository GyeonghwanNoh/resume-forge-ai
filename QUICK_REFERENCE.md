# ResumeForge AI - Quick Reference: Deployment & Payment

This is a quick reference guide. For detailed steps, see:
- **Deployment**: [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
- **Payment**: [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)

---

## 📋 Deployment Checklist

### Before Deployment (Local)

```bash
# 1. Commit all changes
git add .
git commit -m "Production deployment: Stripe payment prep"
git push origin main

# 2. Test locally
cd backend && python main.py
# (in another terminal)
cd frontend && npm run dev

# 3. Verify:
# - Backend: http://localhost:8000/health → {"status": "ok"}
# - Frontend: http://localhost:3000 → Loads without errors
```

### Deploy Backend (Render)

**Timeline**: ~5 minutes

```bash
# No commands needed - Render deploys from GitHub automatically

# But: After deployment, add environment variables in Render Dashboard:
# Settings → Environment → Add these:

ENVIRONMENT=production
SECRET_KEY=generate-a-random-secret-key-at-least-32-chars
FRONTEND_URL=https://your-vercel-project.vercel.app
CORS_ORIGINS=https://your-vercel-project.vercel.app,http://localhost:3000,http://127.0.0.1:3000
OPENAI_API_KEY=sk-your-key-or-leave-empty
DATA_DIR=data
UPLOAD_DIR=uploads
```

### Deploy Frontend (Vercel)

**Timeline**: ~2 minutes

```bash
# No commands needed - Vercel deploys from GitHub automatically

# But: After deployment, add environment variables in Vercel Dashboard:
# Settings → Environment Variables → Add these:

NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-vercel-project.vercel.app
```

### Verify Deployment

```bash
# 1. Backend health
curl https://<your-backend>.onrender.com/health
# Expected: {"status": "ok"}

# 2. Frontend loads
open https://<your-frontend>.vercel.app
# Expected: Homepage loads, no errors in console

# 3. API works
curl -X POST https://<your-backend>.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test"}'
# Expected: {"detail": "Invalid credentials"} or valid token
```

---

## 💳 Payment (Stripe) Checklist

### Phase 1: Stripe Account (5 minutes)

```bash
# 1. Create account at https://stripe.com
# 2. Get API keys: Stripe Dashboard → Developers → API keys
#    - Publishable: pk_test_...
#    - Secret: sk_test_...
# 3. Create product & price:
#    - Stripe Dashboard → Products → Add product
#    - Name: ResumeForge AI Pro
#    - Price: $19/month
#    - Get price ID: price_test_...
```

### Phase 2: Backend Setup (15 minutes)

```bash
# 1. Install Stripe
cd backend
pip install stripe
pip freeze > requirements.txt

# 2. Add to Render environment variables:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...  # (get from Stripe → Webhooks)

# 3. Deploy backend with new variables
# (Render auto-redeploys when env vars change)
```

### Phase 3: Frontend Setup (5 minutes)

```bash
# 1. Install Stripe React
cd frontend
npm install @stripe/react-stripe-js @stripe/js

# 2. Add to Vercel environment variables:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# 3. Redeploy frontend
```

### Phase 4: Testing (10 minutes)

```bash
# 1. Open pricing page
open https://your-vercel-app.vercel.app/pricing

# 2. Click "Upgrade to Pro"

# 3. Use test card
Card: 4242 4242 4242 4242
Exp: 12/99
CVC: 123

# 4. Verify user upgraded
# - Check user's plan field in database
# - Should be "pro" instead of "free"
```

### Phase 5: Live Keys (2 minutes)

```bash
# When ready for real payments:

# 1. Get live keys from Stripe Dashboard → Developers → API keys (Live tab)
# 2. Update Render environment:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# 3. Update Vercel environment:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Both auto-redeploy
```

---

## 🔗 Exact Environment Variables

### Backend (Render)

| Name | Example | Required | 
|------|---------|----------|
| `ENVIRONMENT` | `production` | ✅ |
| `SECRET_KEY` | `randomstring32chars...` | ✅ |
| `FRONTEND_URL` | `https://app.vercel.app` | ✅ |
| `CORS_ORIGINS` | `https://app.vercel.app,http://localhost:3000` | ✅ |
| `OPENAI_API_KEY` | `sk-...` | ❌ (optional) |
| `DATA_DIR` | `data` | ✅ |
| `UPLOAD_DIR` | `uploads` | ✅ |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | ❌ (for payments) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | ❌ (for payments) |
| `STRIPE_PRICE_ID_PRO` | `price_test_...` or `price_live_...` | ❌ (for payments) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_test_...` or `whsec_live_...` | ❌ (for payments) |

### Frontend (Vercel)

| Name | Example | Required |
|------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://backend.onrender.com` | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://app.vercel.app` | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | ❌ (for payments) |

---

## 🛠️ Git Commands

### Initial Setup

```bash
cd c:\resume-forge-ai

git init
git add .
git commit -m "Initial: ResumeForge AI with Stripe payment prep"
git branch -M main
git remote add origin https://github.com/GyeonghwanNoh/resume-forge-ai.git
git push -u origin main
```

### After Making Changes

```bash
cd c:\resume-forge-ai

git add .
git commit -m "Descriptive message about changes"
git push origin main

# Vercel and Render auto-deploy when you push to main
```

---

## 📊 User Model with Subscription Fields

Current fields (existing):
- `id`: Unique user ID
- `email`: User email
- `hashed_password`: Bcrypt hashed password
- `created_at`: Account creation timestamp
- `is_active`: Account status

**New fields** (payment-ready):
- `plan`: `"free"` or `"pro"` (default: `"free"`)
- `billing_status`: `null` | `"active"` | `"canceled"` | `"past_due"`
- `stripe_customer_id`: Stripe customer ID (when upgraded)
- `stripe_subscription_id`: Stripe subscription ID (when upgraded)

---

## 📚 Plan Features

### Free Tier (Default)
- ✅ 3 resume analyses/month
- ✅ 3 job match analyses
- ✅ 2 cover letters
- ✅ 2 interview prep sessions
- ✅ 5 bullet rewrites

### Pro Tier ($19/month)
- ✅ Unlimited analyses
- ✅ Unlimited job matching
- ✅ Unlimited cover letters & prep
- ✅ Unlimited bullet rewrites
- ✅ Advanced ATS optimization
- ✅ Priority AI processing

---

## 🚀 Ready to Deploy?

1. **Backend**: Push to GitHub → Render auto-deploys
2. **Frontend**: Push to GitHub → Vercel auto-deploys
3. **Environment vars**: Add manually in each dashboard
4. **Test**: Run verification curl commands above

---

## 🎯 Next: Stripe Integration?

1. Create Stripe account (https://stripe.com)
2. Follow [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md) checklist
3. Install Stripe SDK in backend and frontend
4. Implement billing endpoints
5. Test with test keys
6. Switch to live keys

---

**Documentation Files**:
- [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - Detailed deployment steps
- [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md) - Complete Stripe integration guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Beginner-friendly deployment (original)
