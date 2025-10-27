"""Minimal environment loader for local development."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Mapping


def load_env(env_file: str = ".env") -> Mapping[str, str]:
    """Load key/value pairs from the given .env file into ``os.environ``.

    The implementation is intentionally tiny so we do not depend on
    ``python-dotenv`` which is unavailable in this execution environment.
    Empty lines and comments are ignored. Values are stripped of surrounding
    whitespace and double quotes.
    """

    path = Path(env_file)
    if not path.exists():
        return os.environ

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"')
        os.environ.setdefault(key, value)
    return os.environ


__all__ = ["load_env"]
