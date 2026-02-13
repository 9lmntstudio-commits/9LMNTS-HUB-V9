# Auto-push script for Windows PowerShell
# Usage: .\auto-push.ps1 "commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$message
)

Write-Host "🔄 Auto-pushing to GitHub..." -ForegroundColor Cyan

# Add all changes
git add -A
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Commit with message
git commit -m $message
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Push to main branch
git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
