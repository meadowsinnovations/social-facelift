"""SQLite database helpers used by the Social Facelift ORM layer."""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from .env import load_env

load_env()

DEFAULT_DATABASE_URL = "sqlite:///data/dev.db"


def _parse_sqlite_url(url: str) -> Path:
    if not url.startswith("sqlite:///"):
        raise ValueError(
            "Only sqlite:/// URLs are supported in the local development stack."
        )
    raw_path = url[len("sqlite:///") :]
    return Path(raw_path).expanduser().resolve()


def _ensure_database_path(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)
DATABASE_PATH = _parse_sqlite_url(DATABASE_URL)
_ensure_database_path(DATABASE_PATH)


def get_connection() -> sqlite3.Connection:
    """Create a new SQLite connection with sane defaults."""

    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


@contextmanager
def db_session() -> Iterator[sqlite3.Connection]:
    """Context manager that yields a connection and commits/rolls back."""

    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


__all__ = ["db_session", "get_connection", "DATABASE_URL", "DATABASE_PATH"]
