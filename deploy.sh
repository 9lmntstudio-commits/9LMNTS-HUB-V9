#!/bin/bash

echo "🚀 Deploying 9LMNTS Studio to Netlify..."

# Step 1: Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Step 2: Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Step 3: Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=build

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎯 Your unified modal system is now live!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
