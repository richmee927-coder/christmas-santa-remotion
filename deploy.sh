#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/richmee927-coder/what-if-studio.git"

echo "==> Initializing git..."
git init
git branch -M main

echo "==> Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "==> Staging all files..."
git add .

echo "==> Committing..."
git commit -m "Add Christmas vertical Remotion animation" || echo "Nothing to commit"

echo "==> Pushing to GitHub..."
git push -u origin main

echo "==> Done. Open https://github.com/richmee927-coder/what-if-studio/actions to run the render."
