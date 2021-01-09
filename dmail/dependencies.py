from typing import Generator

from fastapi import Form

from dmail import models
from dmail.db import SessionLocal


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def parse_message(
    from_: str = Form(..., alias="from"),
    to: str = Form(...),
    subject: str = Form(...),
    text: str = Form(...),
) -> models.Message:

    address = to.split("@")[0].lstrip("<")
    message = models.Message(
        from_user=from_, to_user=address, subject=subject, text=text.strip()
    )
    return message
