# Inkognito Backend (Production-Ready API)

This backend wraps the existing pipeline (`inkognito_pipeline.py`) into a deployable FastAPI service with:
- Signup/Login with JWT auth
- Database persistence for users + report jobs
- Background execution of report pipeline
- Railway deployment config (`Procfile`, `railway.json`, `Dockerfile`)

## Tech Stack
- FastAPI
- SQLAlchemy
- JWT (python-jose)
- Passlib bcrypt
- PostgreSQL (recommended for Railway)

## Project Structure
- `app/main.py` - FastAPI app entrypoint
- `app/api/routes/auth.py` - signup/login/me
- `app/api/routes/reports.py` - trigger pipeline, list reports, fetch result
- `app/models/` - SQLAlchemy models
- `app/services/report_service.py` - background pipeline job
- `inkognito_pipeline.py` - original pipeline engine

## Environment
1. `.env` is already created locally in this workspace.
2. For Railway, add all variables from `.env.example` into Railway Variables.
3. Use a strong `SECRET_KEY` in production. App startup is blocked in production if default secret is used.
4. Set `DATABASE_URL` to Railway PostgreSQL connection string.

## Local Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API base: `http://127.0.0.1:8000/api/v1`

## API Endpoints
- `GET /api/v1/healthz`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/reports/run` (async job)
- `GET /api/v1/reports`
- `GET /api/v1/reports/{report_id}`
- `GET /api/v1/reports/{report_id}/result`
- `GET /api/v1/reports/{report_id}/download`

## Example Flow
1. Signup
2. Login to get bearer token
3. Call `/reports/run` with intake payload
4. Poll `/reports/{report_id}` until status becomes `COMPLETED`
5. Fetch `/reports/{report_id}/result`

## Railway Deploy
1. Push this repository to GitHub.
2. Create a new Railway project from the repo.
3. Add PostgreSQL plugin.
4. Set env vars from `.env.example` in Railway Variables.
5. Railway will use `railway.json`/`Procfile` and start the API.

## Production Notes
- Rotate exposed API keys if they were ever committed/shared.
- Add a task queue (RQ/Celery) for heavy load instead of in-process background tasks.
- Add Alembic migrations before schema changes in production.
- Add request rate-limiting and audit logging for compliance.
