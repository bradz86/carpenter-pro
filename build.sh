#!/bin/bash
# This script is used by DigitalOcean to build the backend

echo "Building Carpenter Pro Backend..."
cd backend
npm install --production
echo "Build complete!"
