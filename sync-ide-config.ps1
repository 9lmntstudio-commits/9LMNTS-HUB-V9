# IDE Configuration Sync Script (Windows PowerShell)
# Syncs Windsurf, Cursor, and Antigravity configurations with VS Code
# Usage: .\sync-ide-config.ps1

# Enable strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# Colors
$Green = "Green"
$Blue = "Cyan"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "🔄 IDE Configuration Sync Script" -ForegroundColor $Blue
Write-Host "===================================" -ForegroundColor $Blue
Write-Host ""

# Check if .vscode directory exists
if (-not (Test-Path -Path ".vscode" -PathType Container)) {
    Write-Host "❌ Error: .vscode directory not found!" -ForegroundColor $Red
    Write-Host "Please run this script from the project root." -ForegroundColor $Red
    exit 1
}

# Source files from .vscode
$SourceSettings = ".vscode/settings.json"
$SourceExtensions = ".vscode/extensions.json"
$SourceLaunch = ".vscode/launch.json"
$SourceTasks = ".vscode/tasks.json"

# Destination IDEs
$IDEs = @("cursor", "windsurf", "antigravity")

# Track success
$SyncSuccess = 0
$SyncFailed = 0

Write-Host "📋 Syncing from .vscode (master):" -ForegroundColor $Blue
Write-Host ""

# Function to sync files
function Sync-IDE {
    param(
        [string]$IDE
    )

    $IDEDir = ".${IDE}"

    Write-Host "Syncing to ${IDE}/" -ForegroundColor $Yellow

    # Create directory if it doesn't exist
    if (-not (Test-Path -Path $IDEDir -PathType Container)) {
        New-Item -ItemType Directory -Path $IDEDir | Out-Null
        Write-Host "  ✅ Created directory: $IDEDir" -ForegroundColor $Green
    }

    # Sync settings.json
    if (Test-Path -Path $SourceSettings -PathType Leaf) {
        Copy-Item -Path $SourceSettings -Destination "$IDEDir/settings.json" -Force
        Write-Host "  ✅ Synced: settings.json" -ForegroundColor $Green
        $script:SyncSuccess++
    } else {
        Write-Host "  ❌ Source not found: $SourceSettings" -ForegroundColor $Red
        $script:SyncFailed++
    }

    # Sync extensions.json
    if (Test-Path -Path $SourceExtensions -PathType Leaf) {
        Copy-Item -Path $SourceExtensions -Destination "$IDEDir/extensions.json" -Force
        Write-Host "  ✅ Synced: extensions.json" -ForegroundColor $Green
        $script:SyncSuccess++
    } else {
        Write-Host "  ❌ Source not found: $SourceExtensions" -ForegroundColor $Red
        $script:SyncFailed++
    }

    # Sync launch.json
    if (Test-Path -Path $SourceLaunch -PathType Leaf) {
        Copy-Item -Path $SourceLaunch -Destination "$IDEDir/launch.json" -Force
        Write-Host "  ✅ Synced: launch.json" -ForegroundColor $Green
        $script:SyncSuccess++
    } else {
        Write-Host "  ⚠️  Source not found: $SourceLaunch" -ForegroundColor $Yellow
    }

    # Sync tasks.json
    if (Test-Path -Path $SourceTasks -PathType Leaf) {
        Copy-Item -Path $SourceTasks -Destination "$IDEDir/tasks.json" -Force
        Write-Host "  ✅ Synced: tasks.json" -ForegroundColor $Green
        $script:SyncSuccess++
    } else {
        Write-Host "  ⚠️  Source not found: $SourceTasks" -ForegroundColor $Yellow
    }

    Write-Host ""
}

# Sync all IDEs
foreach ($IDE in $IDEs) {
    Sync-IDE -IDE $IDE
}

# Summary
Write-Host "===================================" -ForegroundColor $Blue
Write-Host "✅ Sync Complete!" -ForegroundColor $Green
Write-Host ""
Write-Host "📊 Results:" -ForegroundColor $Blue
Write-Host "  ✅ Files synced: $SyncSuccess" -ForegroundColor $Green
if ($SyncFailed -gt 0) {
    Write-Host "  ❌ Files failed: $SyncFailed" -ForegroundColor $Red
}

Write-Host ""
Write-Host "📁 Synced to:" -ForegroundColor $Blue
foreach ($IDE in $IDEs) {
    Write-Host "  ✓ .${IDE}/" -ForegroundColor $Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor $Yellow
Write-Host "  1. Restart your IDE" -ForegroundColor $Yellow
Write-Host "  2. Check that settings are applied" -ForegroundColor $Yellow
Write-Host "  3. Install extensions when prompted" -ForegroundColor $Yellow
Write-Host "  4. Commit changes: git add . && git commit -m 'chore: sync IDE configs'" -ForegroundColor $Yellow

Write-Host ""
Write-Host "✅ All IDEs are now in sync!" -ForegroundColor $Green
