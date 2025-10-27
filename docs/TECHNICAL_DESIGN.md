# Social Facelift Technical Design

## 1. Technical Objectives
- Deliver fast, accurate profile audits with AI-generated feedback.
- Support responsive web and native mobile clients with shared logic.
- Provide secure integrations with third-party social networks and Stripe.
- Enable rapid iteration through modular, testable services.

## 2. System Architecture Overview
```
+------------------+       +----------------+       +-----------------+
| Web & Mobile UI  | <---> | BFF / API Gate | <---> | Core Services   |
+------------------+       +----------------+       +-----------------+
         |                          |                         |
         |                          v                         v
         |                +----------------+         +-----------------+
         |                | Auth Service   |         | AI Orchestration|
         |                +----------------+         +-----------------+
         v                          |                         |
+------------------+                |                         |
| CDN & Asset Svc  |                |                         |
+------------------+                v                         v
                         +----------------+         +-----------------+
                         | Data Services  | <-----> | Third-Party APIs|
                         +----------------+         +-----------------+
```

- **Frontend:** React (Next.js) web app with Expo React Native mobile client sharing UI primitives via a design system. Deployed via Vercel and Expo Application Services.
- **Backend:** Node.js (TypeScript) monorepo using NestJS for structured modules. GraphQL API served via Apollo Gateway as the Backend for Frontend (BFF).
- **AI Services:** Python microservice leveraging OpenAI and Stability APIs for text and image generation. Interacts asynchronously through a task queue (BullMQ + Redis) for long-running jobs like mockups.
- **Data Layer:** PostgreSQL for relational data, Redis for caching/session storage, S3-compatible object storage for uploaded assets and generated media.

## 3. Modules & Responsibilities
- **Auth & Billing:**
  - Magic link + OAuth login (Clerk/Auth0) combined with Stripe Billing portal.
  - Role management for Free, Pro, and Agency tiers.
- **Profile Intake:**
  - Social OAuth connectors (LinkedIn, Instagram, TikTok, X) via Octokit/official APIs where available.
  - Screenshot upload pipeline with image preprocessing and storage.
- **Analysis Engine:**
  - Metadata extraction, NLP pipelines for bios/headlines, image scoring heuristics.
  - AI prompt templates parameterized by user goals and personas.
- **Mockup Generator:**
  - Uses template-based Figma/HTML exports combined with AI-generated assets.
  - Provides before/after slider assets and shareable badges.
- **Reporting & Checklist:**
  - Generates actionable tasks stored as JSON schema for rendering in clients.
  - Export to PDF and shareable microsites.
- **Analytics & Growth:**
  - Event tracking via Segment/PostHog feeding dashboards.
  - Referral tracking, leaderboards, and notifications (email/push via OneSignal).

## 4. Data Model (High Level)
- `User`: auth identity, plan tier, referral code, persona preferences.
- `Profile`: linked social handles, raw data snapshots, goal selections.
- `Facelift`: audit runs with scores, insights, generated assets, status.
- `Task`: actionable checklist items linked to a facelift.
- `Asset`: stored images/banners, before/after bundles.
- `Subscription`: Stripe customer state, invoices, limits.

## 5. API Surface
- **GraphQL** for web/mobile clients with queries/mutations such as `currentProfile`, `runFacelift`, `downloadMockup`, `listFacelifts`.
- **Webhooks** for Stripe billing updates, social network data refresh, AI job completion.
- **REST endpoints** for asset download/upload, secured via signed URLs.

## 6. AI Pipeline
1. Collect profile data (text, images, goals).
2. Run baseline scoring heuristics (face detection, keyword density, color analysis).
3. Invoke GPT-based prompt for tailored recommendations.
4. Generate before/after copy variants and action checklist.
5. Kick off image generation jobs for banners/headshots via Stable Diffusion API.
6. Aggregate outputs into a structured response for clients.
7. Persist results, emit events for notifications and analytics.

## 7. Security & Compliance
- Store secrets in managed vault (AWS Secrets Manager).
- Use signed URL uploads, virus scanning (ClamAV) for user assets.
- Enforce least-privilege scopes on OAuth connectors.
- Audit logging for data access, SOC2-ready controls.
- GDPR/CCPA compliance with data export/delete workflows.

## 8. Deployment & DevOps
- Monorepo managed with Turborepo for shared packages across frontend and backend.
- Infrastructure as Code via Terraform targeting AWS (ECS Fargate, RDS, S3, CloudFront).
- CI/CD using GitHub Actions for lint/tests, Canary deploys, automated migrations.
- Observability with OpenTelemetry, Grafana dashboards, Sentry for error tracking.

## 9. Testing Strategy
- Unit tests for services using Jest (TypeScript) and Pytest (Python AI service).
- Contract tests for GraphQL schema via Pact.
- End-to-end flows covered with Playwright (web) and Detox (mobile).
- Load testing with k6 for API throughput and background job scaling.

## 10. Roadmap Alignment
- Phase 1: Deliver auth, profile intake, analysis engine MVP, and 2 free facelifts/month limit enforcement.
- Phase 2: Add mockup generator, AI visual assets, upgrade paywalls.
- Phase 3: Implement referral program, shareable badges, leaderboard APIs.
- Phase 4: Agency dashboards, white-label reports, bulk processing pipelines.

## 11. Open Questions
- Availability of official APIs for Instagram/TikTok profile data and required compliance steps.
- Data residency requirements for enterprise agencies.
- Budget for AI inference costs and on-demand GPU scaling strategy.

