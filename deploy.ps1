# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=============================================" -ForegroundColor Gold
Write-Host "  MAESTRO KITCHEN POS - DEPLOYMENT SCRIPT    " -ForegroundColor Gold
Write-Host "=============================================" -ForegroundColor Gold

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository in pos-app subfolder..." -ForegroundColor Cyan
    git init
    git branch -M main
}

# Check if remote origin is already set
$remote = git remote get-url origin 2>$null
if ($null -eq $remote -or $remote -ne "https://github.com/Eluri5993/maestro-kitchen-pos.git") {
    Write-Host "Setting remote origin to: https://github.com/Eluri5993/maestro-kitchen-pos.git" -ForegroundColor Cyan
    git remote remove origin 2>$null
    git remote add origin https://github.com/Eluri5993/maestro-kitchen-pos.git
}

Write-Host "Adding app files..." -ForegroundColor Cyan
git add .

Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Configure Maestro Kitchen POS with Firebase Real-time Cloud Sync"

Write-Host "Pushing code to GitHub Pages repository..." -ForegroundColor Cyan
Write-Host "NOTE: A login popup may appear if your GitHub account isn't authenticated on this PC." -ForegroundColor Yellow
git push -u origin main

Write-Host "---------------------------------------------"
Write-Host "Deployment steps completed successfully!" -ForegroundColor Green
Write-Host "To host online, go to:" -ForegroundColor Green
Write-Host "https://github.com/Eluri5993/maestro-kitchen-pos/settings/pages" -ForegroundColor Gold
Write-Host "Under 'Branch', select 'main' and click Save. Your site will be live shortly!" -ForegroundColor Green
