"""Shared request dependencies."""
from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, Request

from app import database
from app.database import Db


def get_db(request: Request) -> Iterator[Db]:
    """One database session per request, closed when the response is done."""
    db = database.connect(request.app.state.config.db_url)
    try:
        yield db
    finally:
        db.close()


DB = Annotated[Db, Depends(get_db)]
