# Deploying Football-Stats-App to Vercel

This guide shows the minimal steps to make the app live on Vercel and wire the required environment variables for the API‑Football integration.

Prerequisites
- GitHub repository (your code pushed to a branch).
- A Vercel account (https://vercel.com).
- Your `API_FOOTBALL_KEY` (keep private).

Quick steps (UI)
1. Go to https://vercel.com and sign in.
2. Import Project → Choose your GitHub repo `cedric1jpg/Football-stats-app` → Select the branch you want to deploy (e.g., `feat/futuristic-next` or `main`).
3. In the Import settings:
   - Framework Preset: `Next.js` (Vercel auto-detects usually).
   - Install Command: `npm ci` (optional, `npm install` is fine).
   - Build Command: `npm run build` (this repo uses `build`).
   - Output Directory: leave blank (Next.js default).
4. Add Environment Variables (Environment → Environment Variables) BEFORE deploying production:
   - `API_FOOTBALL_KEY` → (your API key)
   - `API_FOOTBALL_LEAGUE_ID` → `39` (default, e.g., Premier League) — optional to change.
   - `API_FOOTBALL_SEASON` → `2023` (recommended for free-plan compatibility)
   - `NEXT_PUBLIC_APP_URL` → `https://your-deployment-url.vercel.app` (optional)
5. Finish import and let Vercel run the initial deployment.

Quick steps (CLI)
1. Install Vercel CLI (if you prefer):

```powershell
npm i -g vercel
```

2. Log in and link the project:

```powershell
vercel login
cd path\to\Football-stats-app
vercel link
```

3. Add environment variables using the CLI (recommended to set production values):

```powershell
vercel env add API_FOOTBALL_KEY production
vercel env add API_FOOTBALL_LEAGUE_ID production
vercel env add API_FOOTBALL_SEASON production
vercel env add NEXT_PUBLIC_APP_URL production
```

Each `vercel env add` will prompt you to paste the value.

4. Deploy to production via CLI:

```powershell
vercel --prod --confirm
```

Verifying the deployment
- Visit: `https://<your-deployment>.vercel.app` (Vercel shows the domain in the dashboard).
- Check the API health: `https://<your-deployment>.vercel.app/api/teams?season=2023`
  - If everything is configured, the JSON should contain `"source":"upstream"` (or at least not the `fallback` mock). If the response shows `"source":"fallback"`, your upstream API key or plan might be limited (see `/api/teams/debug` for upstream messages).
- Debug endpoint: `https://<your-deployment>.vercel.app/api/teams/debug` — shows the raw upstream response/errors.

Troubleshooting notes
- If the app builds but returns fallback teams, check Vercel build logs for environment variables being available at build/runtime.
- The app reads `API_FOOTBALL_KEY` server-side in the API routes. Ensure you set the variable for `production` (and `preview` if you want preview deployments to work the same).
- If a previously-registered service worker is caching assets in your browser, unregister it via DevTools → Application → Service Workers and then hard-refresh.

Optional: add a Vercel badge to `README.md`

```md
[![Vercel](https://vercelbadge.vercel.app/api/your-team/your-project)](https://vercel.com/)
```

(Instead of the badge above, add the exact URL provided by Vercel in the dashboard.)

If you'd like, I can:
- Walk through setting env vars in Vercel UI step-by-step while you have the dashboard open.
- Generate the `vercel env add` CLI commands you can paste and run locally (I will not ask for secrets here).
- After you provide the final Vercel domain, I can check the public endpoints and confirm the site is returning live data.

Screenshots (generate and add to repo)
-------------------------------------

You can capture PNG screenshots of the live site and add them to the repository using the included Puppeteer script.

1) Install Puppeteer locally (this downloads Chromium):

```powershell
npm install puppeteer
```

2) Run the screenshot script (it reads `APP_URL` or defaults to `http://localhost:3000`):

```powershell
#$env:APP_URL = 'https://your-deployment.vercel.app'
#$env:APP_URL = 'https://statsfistic-f6orv685f-cedric1jpgs-projects.vercel.app'
#$env:APP_URL must be set in the current PowerShell session before running the script.
# Example:
#$env:APP_URL='https://statsfistic-f6orv685f-cedric1jpgs-projects.vercel.app'; npm run screenshots

$env:APP_URL='https://your-deployment.vercel.app'
npm run screenshots
```

3) The screenshots are written to `screenshots/` (e.g. `homepage.png`, `team-detail.png`, `futuristic.png`).

4) Commit and push them to GitHub:

```powershell
git add screenshots/*.png
git commit -m "chore(screenshots): add deployment screenshots"
git push origin feat/futuristic-next
```

If you prefer I can generate a PowerShell helper script that installs Puppeteer, runs the capture, then commits and pushes the images — tell me and I'll add it to `scripts/` (you'll run it locally since it needs your API keys and git credentials).
