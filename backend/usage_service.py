import json
from pathlib import Path
from datetime import datetime

DATA_DIR = Path(__file__).resolve().parent / "data"
USAGE_DB = DATA_DIR / "usage.json"

# Free tier limits per month
FREE_TIER_LIMITS = {
    "analyses": 3,
    "job_matches": 3,
    "cover_letters": 2,
    "interview_questions": 2,
    "bullet_rewrites": 5
}

class UsageService:
    @staticmethod
    def get_usage_db():
        """Load usage data"""
        if USAGE_DB.exists():
            with open(USAGE_DB, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}
    
    @staticmethod
    def save_usage_db(data):
        """Save usage data"""
        DATA_DIR.mkdir(exist_ok=True)
        with open(USAGE_DB, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    
    @staticmethod
    def get_month_key():
        """Get current month key (YYYY-MM)"""
        return datetime.now().strftime("%Y-%m")
    
    @staticmethod
    def get_user_usage(user_id: str) -> dict:
        """Get user's current month usage"""
        usage_db = UsageService.get_usage_db()
        month_key = UsageService.get_month_key()
        
        if user_id not in usage_db:
            usage_db[user_id] = {}
        
        if month_key not in usage_db[user_id]:
            usage_db[user_id][month_key] = {key: 0 for key in FREE_TIER_LIMITS.keys()}
            UsageService.save_usage_db(usage_db)
        
        return usage_db[user_id][month_key]
    
    @staticmethod
    def increment_usage(user_id: str, feature: str) -> dict:
        """Increment usage counter"""
        usage_db = UsageService.get_usage_db()
        month_key = UsageService.get_month_key()
        
        if user_id not in usage_db:
            usage_db[user_id] = {}
        
        if month_key not in usage_db[user_id]:
            usage_db[user_id][month_key] = {key: 0 for key in FREE_TIER_LIMITS.keys()}
        
        usage_db[user_id][month_key][feature] = usage_db[user_id][month_key].get(feature, 0) + 1
        UsageService.save_usage_db(usage_db)
        
        return usage_db[user_id][month_key]
    
    @staticmethod
    def check_limit(user_id: str, feature: str, is_premium: bool = False) -> dict:
        """Check if user has hit limit"""
        if is_premium:
            return {"allowed": True, "usage": 0, "limit": 999, "message": "Premium: Unlimited"}
        
        usage = UsageService.get_user_usage(user_id)
        current = usage.get(feature, 0)
        limit = FREE_TIER_LIMITS.get(feature, 3)
        
        return {
            "allowed": current < limit,
            "usage": current,
            "limit": limit,
            "remaining": max(0, limit - current),
            "message": f"{current}/{limit} uses this month" if current < limit else "Free tier limit reached. Upgrade to continue."
        }
    
    @staticmethod
    def get_usage_summary(user_id: str) -> dict:
        """Get all usage stats"""
        usage = UsageService.get_user_usage(user_id)
        month_key = UsageService.get_month_key()
        
        return {
            "month": month_key,
            "limits": FREE_TIER_LIMITS,
            "usage": usage,
            "remaining": {
                key: max(0, FREE_TIER_LIMITS.get(key, 3) - usage.get(key, 0))
                for key in FREE_TIER_LIMITS.keys()
            }
        }
