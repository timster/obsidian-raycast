#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Backup Notes
# @raycast.mode compact

# Optional parameters:
# @raycast.icon 🤖

# Documentation:
# @raycast.author tim_shaffer
# @raycast.authorURL https://github.com/timster

cd "/Users/tim/Documents/Obsidian" || exit 1

git add .
git commit -am "Update $(date +'%F %T')"
git push -u origin master

echo "backup complete"
