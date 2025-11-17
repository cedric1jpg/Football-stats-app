# Football-stats-app
An app for easily viewing football players' stats for the season.

This repository contains a minimal Next.js + TypeScript starter scaffold created so you have a runnable app to iterate on. The scaffold includes a simple frontend, an example API route and Docker + CI helpers to deploy quickly.

Quick start (Windows PowerShell):

```powershell
# install dependencies
npm ci

# run dev server
npm run dev
```

API:
- `GET /api/teams` - returns a small example list of teams

Files of interest:
- `pages/index.tsx` — simple UI that fetches the API
- `pages/api/teams.ts` — example API route
- `package.json` — scripts to run/build the app (see `dev`, `build`, `start`, `docker:build`, `docker:up`)

Next steps:
- Replace placeholder API with real football stats data source
- Add tests, linting rules, and stricter TypeScript settings

Docker

Build and run with Docker (requires Docker installed):

```powershell
# build the image
npm run docker:build

# or start with docker-compose
npm run docker:up

# stop
npm run docker:down
```

Deploy to Vercel (recommended for Next.js)
----------------------------------------

1. Create a GitHub repository and push this project to it.
2. Go to https://vercel.com/new, import your GitHub repo and deploy — Vercel auto-detects Next.js.
3. Optionally set environment variables via the Vercel dashboard (e.g., `FOOTBALL_API_KEY`).

Automatic deploy via GitHub Actions
----------------------------------

This repo includes a workflow `.github/workflows/deploy-vercel.yml` that will run on pushes to `main` and deploy the project to Vercel using the Vercel CLI.

Before using it, add the following repository secret in GitHub: `VERCEL_TOKEN` (create one in your Vercel account settings -> Tokens).

When you push to `main`, GitHub Actions will run the deploy workflow and publish the site to your connected Vercel project.

CI: A minimal GitHub Actions workflow is provided in `.github/workflows/ci.yml` which installs dependencies and runs `npm run build` on pushes and PRs.

