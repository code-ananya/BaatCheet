#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend/chat-app
npm install

echo "Building frontend..."
npx vite build

echo "Build completed successfully!"
