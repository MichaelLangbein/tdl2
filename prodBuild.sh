#! /bin/bash
git pull
cd backend
npm ci
npm run build
cd ../frontend
npm ci
npm run build