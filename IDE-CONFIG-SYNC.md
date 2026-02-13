# 🔄 IDE Configuration Sync Guide

Maintain consistent settings across Windsurf, Cursor, Antigravity, and VS Code.

---

## 📋 Configuration Directory Structure

```
project-root/
├── .vscode/
│   ├── settings.json      ← Master settings (primary)
│   ├── extensions.json
│   ├── launch.json
│   ├── tasks.json
│   └── keybindings.json
│
├── .cursor/
│   ├── settings.json      ← Copy from VS Code
│   ├── extensions.json
│   ├── launch.json
│   └── cursor.json        ← Cursor-specific
│
├── .windsurf/
│   ├── settings.json      ← Copy from VS Code + windsurf options
│   ├── extensions.json
│   ├── launch.json
│   └── windsurf.json      ← Windsurf-specific
│
└── .antigravity/
    ├── settings.json      ← Copy from VS Code
    ├── extensions.json
    ├── launch.json
    └── antigravity.json   ← Antigravity-specific
```

---

## 🔄 Sync Workflow

### **Step 1: Edit Master Settings**
All changes go in `.vscode/settings.json` first.

### **Step 2: Verify Changes Work**
```bash
code .
npm run dev
# Test everything
```

### **Step 3: Sync to Other IDEs**

**Option A: Manual Copy**
```bash
# From project root
cp .vscode/settings.json .cursor/settings.json
cp .vscode/settings.json .windsurf/settings.json
cp .vscode/settings.json .antigravity/settings.json
```

**Option B: Using VS Code Settings Sync**
1. In VS Code: `Ctrl+Shift+P`
2. Type: "Settings Sync: Turn On"
3. Sign in with GitHub/Microsoft
4. Settings auto-sync to cloud

**Option C: Script Automation**
```bash
# Windows (PowerShell)
$source = ".vscode/settings.json"
$destinations = @(".cursor/settings.json", ".windsurf/settings.json", ".antigravity/settings.json")
foreach ($dest in $destinations) {
    Copy-Item $source $dest -Force
}

# Mac/Linux
cp .vscode/settings.json .cursor/settings.json
cp .vscode/settings.json .windsurf/settings.json
cp .vscode/settings.json .antigravity/settings.json
```

### **Step 4: Verify in Each IDE**
```bash
cursor .
# Test setup
quit

windsurf .
# Test setup
quit

antigravity .
# Test setup
quit
```

---

## 📍 Common Settings to Sync

### **Framework/Language Specific:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### **Workspace Behavior:**
```json
{
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    "node_modules": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### **Editor Appearance:**
```json
{
  "editor.fontSize": 13,
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

---

## 🎯 IDE-Specific Overrides

### **Windsurf-Only Settings**
```json
// .windsurf/settings.json (ADD to base settings)
{
  "windsurf.auto_commit": true,
  "windsurf.auto_commit_message": "🔄 Auto-save by Windsurf",
  "windsurf.ui.enableInlineChat": true,
  "windsurf.experimental_context_awareness": true
}
```

### **Cursor-Only Settings**
```json
// .cursor/settings.json (ADD to base settings)
{
  "cursor.acceptedNotifications": ["nativeMultilineCompletion"],
  "cursor.python.autoImports": true,
  "cursor.ai.alwaysShowDebugPanel": false
}
```

### **Antigravity-Only Settings**
```json
// .antigravity/settings.json (ADD to base settings)
{
  "antigravity.codeIntel.enabled": true,
  "antigravity.performance.optimization": true,
  "antigravity.ui.darkMode": true
}
```

---

## 🔗 Sync Extensions

### **Master Extension List** (in .vscode/extensions.json):
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "charliermarsh.ruff",
    "eamodio.gitlens",
    "ms-azuretools.vscode-docker"
  ]
}
```

### **Copy to All IDEs:**
```bash
cp .vscode/extensions.json .cursor/extensions.json
cp .vscode/extensions.json .windsurf/extensions.json
cp .vscode/extensions.json .antigravity/extensions.json
```

### **Each IDE Auto-Installs:**
1. User opens IDE
2. Extension recommendation prompt appears
3. Click "Install All"
4. Extensions auto-install

---

## 🚀 Sync Debug Configurations

### **Master Launch Config** (.vscode/launch.json):

```json
{
  "configurations": [
    {
      "name": "Frontend - Vite Dev",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    },
    {
      "name": "Backend - Python",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/working-automation.py"
    }
  ]
}
```

### **Sync to All IDEs:**
```bash
cp .vscode/launch.json .cursor/launch.json
cp .vscode/launch.json .windsurf/launch.json
cp .vscode/launch.json .antigravity/launch.json
```

> **Note:** Cursor and Antigravity may add slight variations but core configs work across all.

---

## 📝 Sync Tasks Configuration

### **Master Tasks File** (.vscode/tasks.json):

All standard npm and Python tasks defined centrally.

### **Sync Command:**
```bash
cp .vscode/tasks.json .cursor/tasks.json
cp .vscode/tasks.json .windsurf/tasks.json
cp .vscode/tasks.json .antigravity/tasks.json
```

---

## ✅ Sync Checklist

When updating IDE configuration:

- [ ] Edit `.vscode/settings.json` (master)
- [ ] Test in VS Code: `code .`
- [ ] Sync to other IDEs:
  - [ ] `.cursor/settings.json`
  - [ ] `.windsurf/settings.json`
  - [ ] `.antigravity/settings.json`
- [ ] Verify each IDE:
  - [ ] Settings appear correct
  - [ ] Extensions install automatically
  - [ ] Debug configurations available
  - [ ] Tasks run correctly
- [ ] Commit changes: `git add .vscode .cursor .windsurf .antigravity`
- [ ] Push to repository

---

## 🔍 Verify Sync Status

### **Check If Settings Are Synced:**

```bash
# Windows
fc .vscode/settings.json .cursor/settings.json
fc .vscode/settings.json .windsurf/settings.json
fc .vscode/settings.json .antigravity/settings.json

# Mac/Linux
diff .vscode/settings.json .cursor/settings.json
diff .vscode/settings.json .windsurf/settings.json
diff .vscode/settings.json .antigravity/settings.json
```

### **Check IDE-Specific Additions Are Present:**

```bash
# Should NOT be identical (has IDE-specific settings)
cat .windsurf/settings.json | grep "windsurf"  # Should find
cat .cursor/settings.json | grep "cursor"      # Should find
cat .antigravity/settings.json | grep "antigravity"  # Should find
```

---

## 🛠️ Automation Script

Create `sync-ide-config.sh` (Mac/Linux) or `.ps1` (Windows):

### **Mac/Linux (sync-ide-config.sh):**
```bash
#!/bin/bash
echo "🔄 Syncing IDE Configurations..."

# Copy base settings to all IDEs
for ide in cursor windsurf antigravity; do
  cp .vscode/settings.json .${ide}/settings.json
  cp .vscode/extensions.json .${ide}/extensions.json
  cp .vscode/launch.json .${ide}/launch.json
  echo "✅ Synced to .${ide}/"
done

echo "🎉 All configurations synced!"
```

### **Windows (sync-ide-config.ps1):**
```powershell
Write-Host "🔄 Syncing IDE Configurations..."

$ides = @("cursor", "windsurf", "antigravity")
foreach ($ide in $ides) {
    Copy-Item ".vscode/settings.json" ".${ide}/settings.json" -Force
    Copy-Item ".vscode/extensions.json" ".${ide}/extensions.json" -Force
    Copy-Item ".vscode/launch.json" ".${ide}/launch.json" -Force
    Write-Host "✅ Synced to .${ide}/"
}

Write-Host "🎉 All configurations synced!"
```

### **Use the script:**
```bash
# Mac/Linux
chmod +x sync-ide-config.sh
./sync-ide-config.sh

# Windows
.\sync-ide-config.ps1
```

---

## 🚨 Breaking Changes Handling

If major configuration changes are needed:

1. **Create backup:**
   ```bash
   git commit -am "backup: IDE configs before major change"
   ```

2. **Update master (.vscode/):**
   - Make all changes
   - Test thoroughly

3. **Sync to all IDEs:**
   ```bash
   ./sync-ide-config.sh  # If using script
   # Or manually copy files
   ```

4. **Test each IDE:**
   ```bash
   code .      && npm run dev
   cursor .    && npm run dev
   windsurf .  && npm run dev
   antigravity . && npm run dev
   ```

5. **Commit if successful:**
   ```bash
   git add .
   git commit -m "feat: update IDE configuration across all editors"
   git push
   ```

---

## 📊 Configuration Ownership

| File | Owner | Update Frequency |
|------|-------|------------------|
| `.vscode/settings.json` | All team | As needed |
| `.cursor/settings.json` | All team | Auto-synced |
| `.windsurf/settings.json` | All team | Auto-synced |
| `.antigravity/settings.json` | All team | Auto-synced |
| `.vscode/extensions.json` | All team | Monthly |
| IDE-specific .json files | IDE-specific | As needed |

---

## 🔐 What NOT to Sync

These should be **machine-specific** (not synced):

- `.vscode/keybindings.json` - Personal preferences
- User-installed extensions beyond recommendations
- Local debugger settings
- Machine-specific paths

---

## 💡 Best Practices

1. ✅ **Always test in master IDE (VS Code) first**
2. ✅ **Sync frequently** (after each major change)
3. ✅ **Use automation script** (don't manually copy)
4. ✅ **Commit config changes** (important for team)
5. ✅ **Document IDE-specific settings** (add comments)
6. ❌ **Don't store local credentials** in config files
7. ❌ **Don't force one IDE** on team members
8. ❌ **Don't sync user preferences** (keybindings, themes)

---

**Last Updated:** February 2026
**For:** 9LMNTS Studio Multi-IDE Ecosystem
