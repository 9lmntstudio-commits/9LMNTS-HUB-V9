#!/bin/bash

# 🔄 IDE Configuration Sync Script (Mac/Linux)
# Syncs Windsurf, Cursor, and Antigravity configurations with VS Code
# Usage: ./sync-ide-config.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 IDE Configuration Sync Script${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if .vscode directory exists
if [ ! -d ".vscode" ]; then
    echo -e "${RED}❌ Error: .vscode directory not found!${NC}"
    echo "Please run this script from the project root."
    exit 1
fi

# Source files from .vscode
SOURCE_SETTINGS=".vscode/settings.json"
SOURCE_EXTENSIONS=".vscode/extensions.json"
SOURCE_LAUNCH=".vscode/launch.json"
SOURCE_TASKS=".vscode/tasks.json"

# Destination IDEs
IDES=("cursor" "windsurf" "antigravity")

# Track success
SYNC_SUCCESS=0
SYNC_FAILED=0

echo "📋 Syncing from .vscode (master):"
echo ""

# Function to sync files
sync_ide() {
    local ide=$1
    local ide_dir=".${ide}"

    echo -e "${YELLOW}Syncing to ${BLUE}.${ide}/${NC}"

    # Create directory if it doesn't exist
    if [ ! -d "$ide_dir" ]; then
        mkdir -p "$ide_dir"
        echo -e "  ✅ Created directory: ${ide_dir}"
    fi

    # Sync settings.json
    if [ -f "$SOURCE_SETTINGS" ]; then
        cp "$SOURCE_SETTINGS" "$ide_dir/settings.json"
        echo -e "  ✅ Synced: settings.json"
        ((SYNC_SUCCESS++))
    else
        echo -e "  ❌ Source not found: $SOURCE_SETTINGS"
        ((SYNC_FAILED++))
    fi

    # Sync extensions.json
    if [ -f "$SOURCE_EXTENSIONS" ]; then
        cp "$SOURCE_EXTENSIONS" "$ide_dir/extensions.json"
        echo -e "  ✅ Synced: extensions.json"
        ((SYNC_SUCCESS++))
    else
        echo -e "  ❌ Source not found: $SOURCE_EXTENSIONS"
        ((SYNC_FAILED++))
    fi

    # Sync launch.json
    if [ -f "$SOURCE_LAUNCH" ]; then
        cp "$SOURCE_LAUNCH" "$ide_dir/launch.json"
        echo -e "  ✅ Synced: launch.json"
        ((SYNC_SUCCESS++))
    else
        echo -e "  ⚠️  Source not found: $SOURCE_LAUNCH"
    fi

    # Sync tasks.json
    if [ -f "$SOURCE_TASKS" ]; then
        cp "$SOURCE_TASKS" "$ide_dir/tasks.json"
        echo -e "  ✅ Synced: tasks.json"
        ((SYNC_SUCCESS++))
    else
        echo -e "  ⚠️  Source not found: $SOURCE_TASKS"
    fi

    echo ""
}

# Sync all IDEs
for ide in "${IDES[@]}"; do
    sync_ide "$ide"
done

# Summary
echo -e "${BLUE}===================================${NC}"
echo -e "${GREEN}✅ Sync Complete!${NC}"
echo ""
echo "📊 Results:"
echo -e "  ${GREEN}✅ Files synced: $SYNC_SUCCESS${NC}"
if [ $SYNC_FAILED -gt 0 ]; then
    echo -e "  ${RED}❌ Files failed: $SYNC_FAILED${NC}"
fi

echo ""
echo "📁 Synced to:"
for ide in "${IDES[@]}"; do
    echo "  ✓ .${ide}/"
done

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Restart your IDE"
echo "  2. Check that settings are applied"
echo "  3. Install extensions when prompted"
echo "  4. Commit changes: git add . && git commit -m 'chore: sync IDE configs'"

echo ""
echo -e "${GREEN}✅ All IDEs are now in sync!${NC}"
