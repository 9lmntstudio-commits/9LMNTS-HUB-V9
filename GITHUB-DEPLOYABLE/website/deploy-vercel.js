#!/usr/bin/env node

/**
 * Automated Vercel Deployment Script
 * Handles complete deployment with environment variables from secure folder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read API keys from secure folder
const secureKeysPath = 'c:\\Users\\me\\9LMNTS STUDIO\\API KEYS';

function readSecureKey(filename) {
  try {
    const filePath = path.join(secureKeysPath, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
    return null;
  } catch (error) {
    console.log(`Warning: Could not read ${filename}: ${error.message}`);
    return null;
  }
}

// Get actual API keys from secure folder
const apiKeys = {
  OPENAI_API_KEY: readSecureKey('OpenAI API KEY.txt'),
  GEMINI_API_KEY: readSecureKey('Google AI Studio API KEY.txt'),
  NOTION_API_KEY: readSecureKey('Notion API KEY.txt'),
  MANYCHAT_API_KEY: readSecureKey('manychat API KEY.txt'),
  FIGMA_API_KEY: readSecureKey('Figma token.txt'),
  N8N_WEBHOOK_URL: 'https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads',
  SUPABASE_URL: 'your_supabase_url_here',
  SUPABASE_ANON_KEY: readSecureKey('supabase full API KEY.txt'),
  STITCH_API_KEY: readSecureKey('stitchAI API KEY.txt'),
  GITHUB_TOKEN: readSecureKey('GITHUB 9LMNTS Studio X L.O.A. API KEY.txt'),
  GOOGLE_APP_PASSWORD: readSecureKey('9L-App password.txt')
};

console.log('🚀 Starting Automated Vercel Deployment');
console.log('📁 Reading API keys from secure folder...');

// Verify we have the essential keys
if (!apiKeys.OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found in secure folder');
  process.exit(1);
}

if (!apiKeys.GEMINI_API_KEY) {
  console.error('❌ Gemini API key not found in secure folder');
  process.exit(1);
}

console.log('✅ API keys loaded successfully');

// Create temporary environment file for Vercel
const envContent = Object.entries(apiKeys)
  .filter(([key, value]) => value && !value.includes('your_'))
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync('.env.vercel', envContent);
console.log('📝 Created Vercel environment file');

// Deploy to Vercel with environment variables
try {
  console.log('🚀 Deploying to Vercel...');
  
  // Set environment variables
  Object.entries(apiKeys).forEach(([key, value]) => {
    if (value && !value.includes('your_')) {
      try {
        execSync(`vercel env add ${key} production`, {
          input: value,
          stdio: 'pipe'
        });
        console.log(`✅ Set ${key}`);
      } catch (error) {
        console.log(`⚠️  Could not set ${key}: ${error.message}`);
      }
    }
  });
  
  // Deploy the project
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('🎉 Deployment completed successfully!');
  
  // Clean up
  fs.unlinkSync('.env.vercel');
  console.log('🧹 Cleaned up temporary files');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  
  // Clean up on error
  if (fs.existsSync('.env.vercel')) {
    fs.unlinkSync('.env.vercel');
  }
  
  process.exit(1);
}
