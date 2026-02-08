#!/usr/bin/env bash
# Generates commits_to_edit.txt from current history (oldest first).
# Edit that file: change the date and/or message on each line (format: DATE|MESSAGE).
# Then run ./scripts/rewrite-commits.sh to apply the rewrite.

set -e
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"
OUT="${REPO_ROOT}/commits_to_edit.txt"

git log --reverse --format="%ai|%s" > "$OUT"
echo "Created $OUT with $(wc -l < "$OUT") commits."
echo "Edit each line as: DATE|MESSAGE (date format: 2024-01-15 10:30:00 +0530)"
echo "Then run: ./scripts/rewrite-commits.sh"
