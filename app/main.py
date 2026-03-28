import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401 - ensure ORM models are imported before create_all
from app.api.router import api_router
from app.core.config import settings
from app.db.session import Base, engine


logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, debug=settings.debug)
    origins = ["*"]
    if settings.cors_origins.strip() != "*":
        origins = [v.strip() for v in settings.cors_origins.split(",") if v.strip()]
    allow_credentials = origins != ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup() -> None:
        if settings.environment.lower() == "production" and settings.secret_key == "change-me-in-production":
            raise RuntimeError("SECRET_KEY must be set to a non-default value in production")
        Base.metadata.create_all(bind=engine)

    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
