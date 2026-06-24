#!/bin/bash
set -e

TOKEN=$(cat ~/.neighbor-web-co-github-token)
cd "$(dirname "$0")"

# Clean up any stale lock files
rm -f .git/HEAD.lock .git/index.lock .git/objects/maintenance.lock

git remote set-url origin "https://jramis11:${TOKEN}@github.com/jramis11/Neighbor-Web-Co.git"
git add -A
git commit -m "Fix CTA band secondary button text visibility on dark background"
git push origin main
git remote set-url origin "https://github.com/jramis11/Neighbor-Web-Co.git"

echo "✅ Pushed! Netlify will deploy in ~30 seconds."
