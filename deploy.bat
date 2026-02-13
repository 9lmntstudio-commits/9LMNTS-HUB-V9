@echo off
echo 🚀 Deploying 9LMNTS Studio to Netlify...

REM Step 1: Build the application
echo 📦 Building application...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

REM Step 2: Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📥 Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Step 3: Deploy to Netlify
echo 🌐 Deploying to Netlify...
call netlify deploy --prod --dir=build

if %ERRORLEVEL% equ 0 (
    echo ✅ Deployment successful!
    echo 🎯 Your unified modal system is now live!
) else (
    echo ❌ Deployment failed!
    exit /b 1
)

pause
