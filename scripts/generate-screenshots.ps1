# Generate screenshots, commit and push to repository
# Usage: Open PowerShell in repo root and run: .\scripts\generate-screenshots.ps1

param(
    [string]$AppUrl
)

if (-not $AppUrl) {
    $AppUrl = Read-Host "Enter the public URL of your deployment (e.g. https://your-app.vercel.app)"
}

Write-Output "Using app URL: $AppUrl"

# Ensure puppeteer is installed
Write-Output "Installing puppeteer (this may take a minute)..."
npm install puppeteer --no-audit --no-fund

# Set APP_URL env for this session and run the node script
$env:APP_URL = $AppUrl
Write-Output "Running screenshot script..."
npm run screenshots

# Add screenshots to git, commit and push
Write-Output "Staging screenshots..."
git add screenshots/* 2>$null

$now = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMsg = "chore(screenshots): add screenshots captured from $AppUrl at $now"

try {
    git commit -m $commitMsg
    git push
    Write-Output "Screenshots committed and pushed."
} catch {
    Write-Warning "No changes to commit or git push failed: $_"
}

Write-Output "Done. If you want the images in a different branch, create one before running this script."