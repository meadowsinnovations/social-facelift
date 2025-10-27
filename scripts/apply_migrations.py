"""Apply SQL migrations stored in the ``migrations`` directory."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

from orm import db_session

MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "migrations"


def iter_migration_files() -> Iterable[Path]:
    return sorted(
        (path for path in MIGRATIONS_DIR.glob("*.sql") if path.is_file()),
        key=lambda path: path.name,
    )


def apply_migrations() -> None:
    with db_session() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                filename TEXT PRIMARY KEY,
                applied_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        for path in iter_migration_files():
            already_applied = conn.execute(
                "SELECT 1 FROM schema_migrations WHERE filename = ?",
                (path.name,),
            ).fetchone()
            if already_applied:
                continue

            sql = path.read_text(encoding="utf-8")
            conn.executescript(sql)
            conn.execute(
                "INSERT INTO schema_migrations(filename) VALUES (?)",
                (path.name,),
            )
            print(f"Applied migration {path.name}")


if __name__ == "__main__":
    apply_migrations()
