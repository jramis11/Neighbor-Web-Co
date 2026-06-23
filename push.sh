#!/bin/bash
set -e

TOKEN=$(cat ~/.neighbor-web-co-github-token)
cd "$(dirname "$0")"

git remote set-url origin "https://jramis11:${TOKEN}@github.com/jramis11/Neighbor-Web-Co.git"
git add js/main.js
git commit -m "Fix contact form: actually submit to Web3Forms so emails are sent"
git push origin main
git remote set-url origin "https://github.com/jramis11/Neighbor-Web-Co.git"

echo "✅ Pushed! Netlify will deploy in ~30 seconds."

# Clean up this script
rm -- "$0"
