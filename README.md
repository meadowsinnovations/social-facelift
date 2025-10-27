# Social Facelift database toolkit

This repository contains a lightweight SQLite-based toolkit for managing the
Social Facelift domain data during local development. It avoids third-party
package dependencies so it can run in restricted environments while still
providing an ORM-friendly structure, migrations, and seed data.

## Getting started

1. Copy the example environment file and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

2. Apply the SQL migrations to create the schema and seed the default facelift
   workflow:

   ```bash
   python -m scripts.seed
   ```

   Running the seed command automatically applies any pending migrations and
   inserts a single baseline facelift for the demo user. The script is
   idempotent and will skip inserts if the sample user already exists.

3. Connect to the database using any SQLite-capable tooling. The default
   database URL is `sqlite:///data/dev.db`, configurable through the
   `DATABASE_URL` environment variable.

## Project structure

- `orm/` – Environment loading, connection helpers, and dataclasses modelling
  the domain entities (`User`, `Profile`, `Facelift`, `Task`, `Asset`, and
  `Subscription`).
- `migrations/` – SQL files executed in order to build and evolve the schema.
- `scripts/` – Command line helpers for applying migrations and seeding data.
- `.env.example` – Default environment configuration for local development.

## Seed dataset overview

The seed script provisions a workspace owner (`founder@example.com`) with:

- A linked profile providing name, avatar, and bio details.
- An active `pro` subscription covering the next 30 days.
- A `baseline-refresh` facelift containing three tasks that represent the core
  phases of a social media facelift:
  - Auditing existing performance (with a metrics report asset).
  - Drafting refreshed content pillars (with a document asset).
  - Producing launch-ready creative (with a preview image asset).

This baseline data makes it easy to experiment with repository methods or to
stub API responses before wiring in a production data source.
