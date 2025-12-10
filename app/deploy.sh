#!/bin/bash

# Deployment Script for Next.js App
# Deploys to: lederer@152.53.249.242:/home/lederer/mvp2

set -e

# Configuration
SERVER_USER="lederer"
SERVER_HOST="152.53.249.242"
SERVER_PATH="/home/lederer/mvp2"
LOCAL_APP_DIR="$(dirname "$0")"

# NVM setup command for remote server
NVM_SETUP='export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"'

echo "🚀 Starting deployment..."

# Step 1: Build the application
echo "📦 Building application..."
cd "$LOCAL_APP_DIR"
npm run build

# Step 2: Create server directory if it doesn't exist
echo "📁 Setting up server directory..."
ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${SERVER_PATH}"

# Step 3: Sync files to server (excluding node_modules and .git)
echo "📤 Uploading files to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next/cache' \
  ./ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

# Step 4: Install dependencies on server
echo "📥 Installing dependencies on server..."
ssh "${SERVER_USER}@${SERVER_HOST}" "${NVM_SETUP} && cd ${SERVER_PATH} && npm install --omit=dev"

# Step 5: Restart the application (using PM2 on port 3002)
echo "🔄 Restarting application..."
ssh "${SERVER_USER}@${SERVER_HOST}" "${NVM_SETUP} && cd ${SERVER_PATH} && (PORT=3002 npx pm2 restart mvp2 --update-env 2>/dev/null || PORT=3002 npx pm2 start npm --name mvp2 -- start)"

echo "✅ Deployment complete!"
echo "🌐 Your app is running at https://member.m246.org"
