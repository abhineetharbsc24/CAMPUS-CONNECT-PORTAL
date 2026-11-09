#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: ./push-to-github.sh <github-repo-url>"
  echo "Example: ./push-to-github.sh https://github.com/your-username/campus-connect-portal.git"
  exit 1
fi

REPO_URL="$1"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "git is not installed."
  exit 1
fi

if [ -z "$(git config user.name || true)" ] || [ -z "$(git config user.email || true)" ]; then
  echo "Set your git identity first:"
  echo "  git config --global user.name \"Your Name\""
  echo "  git config --global user.email \"you@example.com\""
  exit 1
fi

if [ -d .git ]; then
  echo "This folder is already a git repository. Remove .git or push manually."
  exit 1
fi

if [ -f server/.env ] || [ -f client/.env ]; then
  echo "Found a .env file. It is ignored by .gitignore and will not be committed."
fi

git init -q
git checkout -q -b main
echo "push-to-github.sh" >> .git/info/exclude

git add .gitignore README.md
git commit -q -m "chore: add root .gitignore and project README"
echo "[1/6] root files committed"

git add server/package.json server/package-lock.json server/.env.example server/index.js server/src/app.js server/src/config server/src/middleware/errorHandler.js
git commit -q -m "feat(server): add Express app, MongoDB config and error handling"
echo "[2/6] server core committed"

git add server/src/models server/src/controllers server/src/routes server/src/middleware/auth.js server/src/seed.js
git commit -q -m "feat(server): add models, controllers, routes, JWT auth and role authorization"
echo "[3/6] server API committed"

git add client/package.json client/package-lock.json client/vite.config.js client/.env.example client/index.html client/src/style.css client/src/carousel.js
git commit -q -m "feat(client): scaffold Vite React app with static landing page and carousel"
echo "[4/6] client scaffold committed"

git add client/src/services client/src/context client/src/components/AuthModule.jsx client/src/components/ProtectedRoute.jsx
git commit -q -m "feat(client): add API service, auth context and login/register module"
echo "[5/6] client auth committed"

git add -A
git commit -q -m "feat(client): add role-based student, faculty and admin portals with routing"
echo "[6/6] client portals committed"

git remote add origin "$REPO_URL"
git remote -v
git push -u origin main

echo
echo "Pushed to $REPO_URL at $(TZ=Asia/Kolkata date '+%Y-%m-%d %H:%M:%S') IST"
git log --oneline
