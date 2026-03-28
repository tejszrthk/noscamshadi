from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import SignupRequest


def _normalize_username(raw: str) -> str:
    cleaned = "".join(ch for ch in raw.lower().strip() if ch.isalnum() or ch in {"_", "."})
    return cleaned or "user"


def _build_unique_username(db: Session, payload: SignupRequest) -> str:
    if payload.username:
        base = _normalize_username(payload.username)
    else:
        email_local = payload.email.split("@", 1)[0]
        base = _normalize_username(email_local)

    candidate = base
    suffix = 1
    while db.query(User).filter(User.username == candidate).first():
        candidate = f"{base}{suffix}"
        suffix += 1

    return candidate


def create_user(db: Session, payload: SignupRequest) -> User:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account with this email already exists",
        )

    username = _build_unique_username(db, payload)
    if payload.username and username != _normalize_username(payload.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is already taken",
        )

    user = User(
        email=payload.email.lower(),
        username=username,
        full_name=payload.full_name.strip(),
        password_hash=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive",
        )
    return user
