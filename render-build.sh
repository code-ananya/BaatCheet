#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing backend dependencies..."
cd backend
npm ci
cd ..

echo "Installing frontend dependencies..."
cd frontend/chat-app
npm ci

echo "Building frontend..."
npm run build

echo "Build completed successfully!"
