"""Populate the database with baseline data for local development."""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timedelta, timezone

from orm import db_session
from orm.env import load_env

from .apply_migrations import apply_migrations

load_env()

DEFAULT_EMAIL = "founder@example.com"
DEFAULT_FACELIFT_SLUG = os.environ.get("DEFAULT_FACELIFT_SLUG", "baseline-refresh")


def seed() -> None:
    apply_migrations()

    with db_session() as conn:
        existing_user = conn.execute(
            "SELECT id FROM users WHERE email = ?", (DEFAULT_EMAIL,)
        ).fetchone()
        if existing_user:
            print("Seed data already present; skipping new inserts.")
            return

        now = datetime.now(timezone.utc)

        user_id = str(uuid.uuid4())
        profile_id = str(uuid.uuid4())
        subscription_id = str(uuid.uuid4())
        facelift_id = str(uuid.uuid4())

        conn.execute(
            "INSERT INTO users(id, email, created_at) VALUES (?, ?, ?)",
            (user_id, DEFAULT_EMAIL, now.isoformat()),
        )

        conn.execute(
            "INSERT INTO profiles(id, user_id, display_name, bio, avatar_url)"
            " VALUES (?, ?, ?, ?, ?)",
            (
                profile_id,
                user_id,
                "Avery Founder",
                "Founder validating the facelift pipeline.",
                "https://cdn.example.com/avatars/founder.png",
            ),
        )

        conn.execute(
            "INSERT INTO subscriptions(id, user_id, plan, status, current_period_start, current_period_end)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                subscription_id,
                user_id,
                "pro",
                "active",
                now.isoformat(),
                (now + timedelta(days=30)).isoformat(),
            ),
        )

        conn.execute(
            "INSERT INTO facelifts(id, user_id, slug, title, status, created_at, updated_at)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                facelift_id,
                user_id,
                DEFAULT_FACELIFT_SLUG,
                "Baseline Social Facelift",
                "in_progress",
                now.isoformat(),
                now.isoformat(),
            ),
        )

        task_payloads = [
            {
                "title": "Audit existing social profiles",
                "status": "complete",
                "sort_order": 1,
                "summary": "Collected analytics and audience sentiment data.",
                "assets": [
                    {
                        "kind": "report",
                        "uri": "https://cdn.example.com/assets/audit-report.pdf",
                        "metadata": {"pages": 12, "tool": "Sprout Social"},
                    }
                ],
            },
            {
                "title": "Draft refreshed content pillars",
                "status": "in_review",
                "sort_order": 2,
                "summary": "Three messaging pillars designed for the fall campaign.",
                "assets": [
                    {
                        "kind": "doc",
                        "uri": "https://cdn.example.com/assets/content-pillars.docx",
                        "metadata": {"format": "docx", "version": 2},
                    }
                ],
            },
            {
                "title": "Produce launch-ready creative set",
                "status": "pending",
                "sort_order": 3,
                "summary": "Awaiting brand feedback before exporting final assets.",
                "assets": [
                    {
                        "kind": "image",
                        "uri": "https://cdn.example.com/assets/creative-preview.png",
                        "metadata": {"dimensions": "1200x1200", "variant": "A"},
                    }
                ],
            },
        ]

        for payload in task_payloads:
            task_id = str(uuid.uuid4())
            conn.execute(
                "INSERT INTO tasks(id, facelift_id, title, status, sort_order, summary)"
                " VALUES (?, ?, ?, ?, ?, ?)",
                (
                    task_id,
                    facelift_id,
                    payload["title"],
                    payload["status"],
                    payload["sort_order"],
                    payload["summary"],
                ),
            )

            for asset in payload["assets"]:
                conn.execute(
                    "INSERT INTO assets(id, task_id, kind, uri, metadata)"
                    " VALUES (?, ?, ?, ?, ?)",
                    (
                        str(uuid.uuid4()),
                        task_id,
                        asset["kind"],
                        asset["uri"],
                        json.dumps(asset["metadata"], sort_keys=True),
                    ),
                )

        print("Seed data inserted successfully.")


if __name__ == "__main__":
    seed()
