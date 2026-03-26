from fastapi import FastAPI

from app.api.router import api_router
from app.core.cors import configure_cors
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings["APP_TITLE"], version=settings["APP_VERSION"])
    configure_cors(app)
    app.include_router(api_router)
    return app


app = create_app()
