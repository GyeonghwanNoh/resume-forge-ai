# Stripe Integration Checklist

This document tracks the steps needed to add Stripe payments to ResumeForge AI.

**Status**: 🟡 Groundwork complete, integration pending

---

## What's Already Done ✅

- [x] User model has subscription fields (`plan`, `billing_status`, `stripe_customer_id`, `stripe_subscription_id`)
- [x] Backend `subscription_service.py` created with plan limits and helper functions
- [x] Frontend pricing page has upgrade button with Stripe CTA placeholder
- [x] Auth endpoints return user's plan and billing status
- [x] `PricingCard` component supports onClick handler for upgrade flow
- [x] Architecture is Stripe-ready (no conflicts with existing code)

---

## Phase 1: Stripe Account & Keys ⏳

### 1.1 Create Stripe Account

- [ ] Go to https://stripe.com/en-ie/
- [ ] Sign up for free account
- [ ] Verify email
- [ ] Complete account setup (business type, country, etc.)

### 1.2 Get API Keys

- [ ] Go to Stripe Dashboard → **Developers** → **API keys**
- [ ] Copy **Publishable Key** (starts with `pk_test_`)
- [ ] Copy **Secret Key** (starts with `sk_test_`)
- [ ] Save both securely (don't commit to GitHub)

### 1.3 Create Product and Price

In Stripe Dashboard:

- [ ] Go to **Products** → **Add product**
- [ ] Name: `ResumeForge AI Pro`
- [ ] Description: `Unlimited resume analyses, cover letters, and interview prep`
- [ ] Price: `$19/month`
- [ ] Billing period: `Monthly`
- [ ] Copy **Price ID** (starts with `price_test_`)

---

## Phase 2: Backend Implementation ⏳

### 2.1 Install Stripe SDK

```bash
cd backend
pip install stripe
pip freeze > requirements.txt
```

### 2.2 Add Environment Variables

In backend `.env` (and later Render):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### 2.3 Create Billing Endpoints

Add to `backend/main_api_upgraded.py`:

```python
# TODO: Add these endpoints

@router.post("/api/billing/checkout")
async def create_checkout(current_user: dict = Depends(get_current_user)):
    """
    Create Stripe Checkout session for Pro upgrade
    Returns: { "session_id": "cs_test_..." }
    """
    # 1. Get user by ID
    # 2. Check if already pro (return error)
    # 3. Create/get Stripe customer:
    #    - If user has stripe_customer_id, use it
    #    - Else: stripe.Customer.create(email=user.email)
    #    - Update user.stripe_customer_id
    # 4. Create checkout session:
    #    session = stripe.checkout.Session.create(
    #      customer=stripe_customer_id,
    #      payment_method_types=["card"],
    #      line_items=[{
    #        "price": STRIPE_PRICE_ID_PRO,
    #        "quantity": 1,
    #      }],
    #      mode="subscription",
    #      success_url="https://your-vercel-url.app/dashboard?payment=success",
    #      cancel_url="https://your-vercel-url.app/pricing?payment=canceled",
    #    )
    # 5. Return { "session_id": session.id }
    pass


@router.post("/api/billing/webhook")
async def handle_stripe_webhook(request: Request):
    """
    Stripe webhook endpoint for subscription events
    Call: POST https://backend-url/api/billing/webhook
    
    Handles:
    - checkout.session.completed → user upgraded to pro
    - customer.subscription.updated → subscription status change
    - customer.subscription.deleted → user downgraded to free
    """
    # 1. Get webhook signature from headers
    # 2. Verify signature with STRIPE_WEBHOOK_SECRET
    # 3. Parse event body
    # 4. Handle event.type:
    
    # if event["type"] == "checkout.session.completed":
    #   session = event["data"]["object"]
    #   user_id = session["metadata"]["user_id"]  # (set in checkout endpoint)
    #   stripe_subscription_id = session["subscription"]
    #   update_user(user_id, {
    #     "plan": "pro",
    #     "billing_status": "active",
    #     "stripe_subscription_id": stripe_subscription_id,
    #   })
    
    # if event["type"] == "customer.subscription.updated":
    #   sub = event["data"]["object"]
    #   status = sub["status"]  # active, past_due, canceled, etc.
    #   find_user_by_stripe_sub_id(sub["id"])
    #   update_user(user_id, {"billing_status": status})
    
    # if event["type"] == "customer.subscription.deleted":
    #   find_user_by_stripe_sub_id(...)
    #   downgrade_to_free(user_id)
    
    return {"status": "ok"}


@router.get("/api/billing/portal")
async def get_billing_portal(current_user: dict = Depends(get_current_user)):
    """
    Create Stripe billing portal session for subscription management
    User can update card, cancel subscription, view invoices, etc.
    
    Returns: { "url": "https://billing.stripe.com/..." }
    """
    # 1. Get user's stripe_customer_id
    # 2. Create billing portal session:
    #    session = stripe.BillingPortal.Session.create(
    #      customer=stripe_customer_id,
    #      return_url="https://your-vercel-url.app/dashboard",
    #    )
    # 3. Return { "url": session.url }
    pass
```

### 2.4 Update `subscription_service.py`

Expand functions to call Stripe API (currently they're placeholders):

```python
def upgrade_to_pro(user_id: str, email: str):
    """
    TODO: Implement Stripe checkout session creation
    Current: Returns placeholder
    New: Call stripe.checkout.Session.create()
    """
    pass

def cancel_subscription(user_id: str, stripe_customer_id: str):
    """
    TODO: Implement Stripe subscription cancellation
    Current: Returns placeholder
    New: Call stripe.Subscription.delete(stripe_subscription_id)
    """
    pass
```

### 2.5 Test Backend Locally

```bash
# 1. Update .env with test keys
# 2. Run backend
python main.py

# 3. Test checkout endpoint
curl -X POST http://localhost:8000/api/billing/checkout \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json"

# 4. Use Stripe CLI to test webhooks
stripe listen --forward-to http://localhost:8000/api/billing/webhook

# 5. Trigger test event
stripe trigger payment_intent.succeeded
```

---

## Phase 3: Frontend Implementation ⏳

### 3.1 Install Stripe React SDK

```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/js
```

### 3.2 Add Environment Variables

In Vercel (and local `.env.local`):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3.3 Update Pricing Page

Modify `frontend/app/pricing/page.tsx`:

```typescript
'use client';

import { loadStripe } from '@stripe/js';
import api from '@/lib/api';

export default function PricingPage() {
  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    try {
      // 1. Call backend checkout endpoint
      const response = await api.post('/api/billing/checkout');
      const { session_id } = response.data;

      // 2. Load Stripe
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

      // 3. Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId: session_id });
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... existing pricing page JSX ...
    <PricingCard
      highlighted
      name="Pro"
      price="$19"
      ctaLabel={loading ? 'Processing...' : 'Upgrade to Pro'}
      onClick={handleUpgrade}
      disabled={loading}
      features={[...]}
    />
  );
}
```

### 3.4 Create Billing Portal Link (Optional)

Add a "Manage Subscription" button on dashboard:

```typescript
// In frontend/app/dashboard/page.tsx or new billing page

const handleBillingPortal = async () => {
  try {
    const response = await api.get('/api/billing/portal');
    window.location.href = response.data.url;
  } catch (error) {
    alert('Failed to open billing portal');
  }
};

return (
  <button onClick={handleBillingPortal}>
    Manage Subscription
  </button>
);
```

### 3.5 Test Frontend Locally

```bash
cd frontend
# 1. Update .env.local with test key
# 2. npm run dev
# 3. Go to pricing page
# 4. Click "Upgrade to Pro"
# 5. Use test card: 4242 4242 4242 4242, exp: 12/99, CVC: 123
```

---

## Phase 4: Deployment ⏳

### 4.1 Deploy Backend with Stripe Keys

On Render:

- [ ] Go to service **Environment** variables
- [ ] Add:
  ```env
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_PRICE_ID_PRO=price_test_...
  STRIPE_WEBHOOK_SECRET=whsec_test_...
  ```
- [ ] Click **Save** → Auto-redeploy

### 4.2 Deploy Frontend with Stripe Key

On Vercel:

- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add:
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```
- [ ] Click **Save**
- [ ] Go to **Deployments** → **Redeploy** latest

### 4.3 Configure Stripe Webhook

In Stripe Dashboard:

- [ ] Go to **Developers** → **Webhooks** → **Add endpoint**
- [ ] Endpoint URL: `https://<your-backend>.onrender.com/api/billing/webhook`
- [ ] Events to send:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`
- [ ] Click **Create endpoint**
- [ ] Copy **Signing secret** (starts with `whsec_`)
- [ ] Update Render env: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Redeploy backend

---

## Phase 5: Testing ⏳

### 5.1 Full End-to-End Flow

- [ ] Sign up on production site
- [ ] Go to pricing page
- [ ] Click "Upgrade to Pro"
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify user's plan updated to "pro" in database
- [ ] Verify user can now access unlimited features
- [ ] Verify email to user (optional, requires email setup)

### 5.2 Cancellation Flow

- [ ] User logs in with Pro plan
- [ ] Click "Manage Subscription"
- [ ] In Stripe portal, cancel subscription
- [ ] Verify user downgraded to "free" plan
- [ ] Verify feature limits enforced again

### 5.3 Webhook Testing

```bash
# In terminal
stripe listen --forward-to https://<your-backend>.onrender.com/api/billing/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted

# Check logs that events were processed
```

---

## Phase 6: Migration to Live Keys ⏳

When ready to accept real payments:

### 6.1 Stripe Dashboard

- [ ] Go to **Developers** → **API keys**
- [ ] Switch to **Live** tab
- [ ] Copy live keys (no `_test_` in names):
  - Publishable: `pk_live_...`
  - Secret: `sk_live_...`

### 6.2 Update Environment Variables

On Render backend:

- [ ] Update `STRIPE_SECRET_KEY=sk_live_...`
- [ ] Update `STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] Update `STRIPE_WEBHOOK_SECRET=whsec_live_...`
- [ ] Redeploy

On Vercel frontend:

- [ ] Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] Redeploy

### 6.3 Test with Real Card

- [ ] Use a real (but cheap) credit card for $0.50 test charge
- [ ] Verify charge appears in Stripe Dashboard
- [ ] Verify user upgraded to pro
- [ ] Verify user received subscription confirmation email

---

## Common Issues & Fixes

### ❌ "No such customer" error

**Cause**: User doesn't have `stripe_customer_id` set yet

**Fix**: Update checkout endpoint to create customer if missing

### ❌ Webhook not processing

**Cause**: Webhook secret mismatch or invalid signature

**Fix**: 
1. Copy exact signing secret from Stripe Dashboard
2. Verify endpoint URL matches exactly
3. Check backend logs for signature errors

### ❌ User still has "free" plan after payment

**Cause**: Webhook handler not updating database

**Fix**:
1. Check webhook endpoint is receiving events (use Stripe CLI)
2. Verify database update logic in webhook handler
3. Check user ID is being extracted correctly

### ❌ Stripe checkout won't load

**Cause**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` not set or incorrect

**Fix**:
1. Verify env var is in Vercel
2. Redeploy frontend
3. Check browser DevTools console for exact error

---

## Final Verification Before Launch

- [ ] Test checkout flow end-to-end (signup → upgrade → Stripe → success)
- [ ] Test cancellation flow (Stripe portal → downgrade)
- [ ] Test webhook delivery (Stripe events → user updated)
- [ ] No test keys in production environment variables
- [ ] No hardcoded Stripe credentials in code
- [ ] User sees appropriate error messages if payment fails
- [ ] Billing status updates in real-time (or within few seconds)
- [ ] No email send failures (if you've added email notifications)
- [ ] Documentation updated for team

---

## After Launch Considerations

- [ ] Monitor Stripe dashboard for payment failures
- [ ] Set up Slack/email alerts for failed charges
- [ ] Plan email notifications for failed payments
- [ ] Add customer support for payment issues
- [ ] Monitor database growth (consider archiving old analyses)
- [ ] Plan upgrade to managed database if JSON files grow too large
- [ ] Consider adding usage analytics (how many users, conversion rate, etc.)

---

**Good luck with Stripe integration! 🎉**
