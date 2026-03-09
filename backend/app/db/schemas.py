from datetime import datetime
from typing import Optional, Literal


class UserSchema:
    def __init__(
        self,
        id: str,
        email: str,
        hashed_password: str,
        created_at: Optional[str] = None,
        is_active: bool = True,
        plan: Literal["free", "pro"] = "free",
        billing_status: Optional[str] = None,
        stripe_customer_id: Optional[str] = None,
        stripe_subscription_id: Optional[str] = None,
    ):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.is_active = is_active
        self.plan = plan  # "free" or "pro"
        self.billing_status = billing_status  # null, "active", "canceled", "past_due"
        self.stripe_customer_id = stripe_customer_id  # Stripe customer ID
        self.stripe_subscription_id = stripe_subscription_id  # Stripe subscription ID


class ResumeSchema:
    def __init__(self, id: str, user_id: str, filename: str, original_text: str, created_at: Optional[str] = None):
        self.id = id
        self.user_id = user_id
        self.filename = filename
        self.original_text = original_text
        self.created_at = created_at or datetime.utcnow().isoformat()


class AnalysisSchema:
    def __init__(self, id: str, resume_id: str, user_id: str, score: int, issues: list, suggestions: list, created_at: Optional[str] = None):
        self.id = id
        self.resume_id = resume_id
        self.user_id = user_id
        self.score = score
        self.issues = issues
        self.suggestions = suggestions
        self.created_at = created_at or datetime.utcnow().isoformat()
