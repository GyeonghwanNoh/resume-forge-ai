"""
Subscription and billing service for ResumeForge AI.

This module handles freemium plan logic and prepares the foundation for
future Stripe integration. It is intentionally kept simple for MVP.

When Stripe is integrated:
1. Use these service functions to validate plan access
2. Call Stripe API for payment/subscription operations
3. Update user stripe_customer_id and stripe_subscription_id fields
4. Implement webhook handlers for subscription events
"""

from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class Plan(str, Enum):
    FREE = "free"
    PRO = "pro"


# Plan feature limits (monthly)
PLAN_LIMITS = {
    "free": {
        "analyses": 3,
        "cover_letters": 2,
        "interview_sessions": 2,
        "bullet_rewrites": 5,
    },
    "pro": {
        "analyses": float("inf"),
        "cover_letters": float("inf"),
        "interview_sessions": float("inf"),
        "bullet_rewrites": float("inf"),
    },
}


def get_plan_limits(plan: str) -> Dict[str, Any]:
    """Get feature limits for a plan."""
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])


def can_perform_action(plan: str, action: str, usage_count: int) -> bool:
    """
    Check if user can perform an action based on their plan and monthly usage.
    
    Args:
        plan: "free" or "pro"
        action: "analyses", "cover_letters", "interview_sessions", "bullet_rewrites"
        usage_count: current usage count this month
    
    Returns:
        True if action is allowed, False if limit reached
    """
    limits = get_plan_limits(plan)
    limit = limits.get(action, 0)
    return usage_count < limit


def upgrade_to_pro(user_id: str) -> Dict[str, Any]:
    """
    Prepare upgrade to Pro plan.
    
    In current MVP: just updates the plan field.
    After Stripe integration: This will:
    1. Create Stripe checkout session
    2. Return checkout URL to frontend
    3. Handle payment completion via webhook
    
    Args:
        user_id: User ID to upgrade
    
    Returns:
        Dict with upgrade info (plan, status, stripe_session_id when ready)
    """
    return {
        "plan": "pro",
        "status": "pending_payment",
        "message": "Upgrade to Pro ready for Stripe integration",
        "next_step": "Connect Stripe Checkout session URL here",
    }


def cancel_subscription(user_id: str) -> Dict[str, Any]:
    """
    Cancel Pro subscription and downgrade to Free.
    
    After Stripe integration: This will call Stripe API to cancel subscription.
    
    Args:
        user_id: User ID to downgrade
    
    Returns:
        Confirmation dict
    """
    return {
        "plan": "free",
        "status": "downgraded",
        "message": "Subscription canceled, plan downgraded to Free",
    }


def get_billing_portal_url(user_id: str, stripe_customer_id: Optional[str]) -> Optional[str]:
    """
    Get Stripe billing portal URL for user subscription management.
    
    After Stripe integration: Call Stripe API to create/get portal session.
    
    Args:
        user_id: User ID
        stripe_customer_id: Stripe customer ID (if available)
    
    Returns:
        Portal URL or None if not available
    """
    if not stripe_customer_id:
        return None
    
    # TODO: Implement Stripe billing portal creation
    return None
