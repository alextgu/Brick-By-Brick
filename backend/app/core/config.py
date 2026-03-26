import os
from typing import List
from pydantic_settings import BaseSettings

def _parse_csv(value: str) -> List[str]:
    return [part.strip() for part in value.split(",") if part.strip()]

class Settings(BaseSettings):
    # App
    APP_TITLE: str = "Brick By Brick API"
    APP_VERSION: str = "0.1.0"
    CORS_ALLOW_ORIGINS: str = "*"

    # Twelve Labs
    TWELVE_LABS_API_KEY: str
    TWELVE_LABS_INDEX_ID: str

    # Gemini
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"

    def get_cors_origins(self) -> List[str]:
        return _parse_csv(self.CORS_ALLOW_ORIGINS)

settings = Settings()


def get_settings() -> dict:
    """
    Return a simple dict for the rest of the app to consume.

    Kept as a dict (instead of passing the Settings object around) so modules like
    `main.py` / `cors.py` can access config via string keys.
    """
    return {
        "APP_TITLE": settings.APP_TITLE,
        "APP_VERSION": settings.APP_VERSION,
        "CORS_ALLOW_ORIGINS": settings.get_cors_origins(),
    }