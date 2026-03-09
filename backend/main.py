import os
import uvicorn

# Canonical production app (includes usage limits + advanced analysis routes)
from main_api_upgraded import app


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
