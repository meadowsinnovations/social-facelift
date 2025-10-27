# Social Facelift Monorepo

This repository is a Turborepo-powered monorepo that hosts the core Social Facelift applications:

- **apps/web** – Next.js web client
- **apps/mobile** – Expo React Native mobile client
- **apps/api** – NestJS API gateway

## Getting Started

Install dependencies with your preferred package manager (npm shown):

```bash
npm install
```

Common scripts are orchestrated through Turborepo pipelines:

- `npm run dev:web` – Start the Next.js development server
- `npm run dev:mobile` – Start the Expo development server
- `npm run dev:api` – Start the NestJS development server
- `npm run build` – Build all applications in topological order
- `npm run lint` – Run ESLint across the workspace
- `npm run test` – Execute Jest test suites for every application

CI placeholder commands (`npm run ci:build`, `npm run ci:test`) are available for wiring into automation workflows.
