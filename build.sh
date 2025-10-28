#!/bin/bash

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend/chat-app
npm install

# Build frontend
echo "Building frontend..."
npm run build

echo "Build completed successfully!"
