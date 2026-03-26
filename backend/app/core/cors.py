from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings


def configure_cors(app: FastAPI) -> None:
    settings = get_settings()

    # Allow your frontend dev server to call the API. Tighten in production.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings["CORS_ALLOW_ORIGINS"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

