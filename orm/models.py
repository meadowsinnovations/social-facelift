"""Dataclasses that model the Social Facelift domain entities."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass(slots=True)
class Profile:
    id: str
    user_id: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


@dataclass(slots=True)
class Subscription:
    id: str
    user_id: str
    plan: str
    status: str
    current_period_start: datetime
    current_period_end: Optional[datetime] = None


@dataclass(slots=True)
class Asset:
    id: str
    task_id: str
    kind: str
    uri: str
    metadata: Optional[dict] = None


@dataclass(slots=True)
class Task:
    id: str
    facelift_id: str
    title: str
    status: str
    sort_order: int
    summary: Optional[str] = None
    assets: List[Asset] = field(default_factory=list)


@dataclass(slots=True)
class Facelift:
    id: str
    user_id: str
    slug: str
    title: str
    status: str
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = field(default_factory=list)


@dataclass(slots=True)
class User:
    id: str
    email: str
    created_at: datetime
    profile: Optional[Profile] = None
    facelifts: List[Facelift] = field(default_factory=list)
    subscriptions: List[Subscription] = field(default_factory=list)
