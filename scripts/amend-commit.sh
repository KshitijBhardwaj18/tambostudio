#!/usr/bin/env bash
# Amends the current commit with the next line from commits_to_edit.txt.
# Used by rewrite-commits.sh during rebase. Run from repo root.

set -e
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"
FILE="${REPO_ROOT}/commits_to_edit.txt"
COUNTER_FILE="${REPO_ROOT}/.git/amend_counter"

n=$(($(cat "$COUNTER_FILE" 2>/dev/null || echo 0) + 1))
echo "$n" > "$COUNTER_FILE"

if [[ ! -f "$FILE" ]]; then
  echo "Error: commits_to_edit.txt not found. Create it with: ./scripts/prepare-rewrite.sh" >&2
  exit 1
fi

line=$(sed -n "${n}p" "$FILE")
if [[ -z "$line" ]]; then
  echo "Error: No line $n in commits_to_edit.txt (only $(wc -l < "$FILE") lines)." >&2
  exit 1
fi

date="${line%%|*}"
msg="${line#*|}"

GIT_COMMITTER_DATE="$date" git commit --amend -m "$msg" --date="$date"

# Clean counter when done (total commits = number of lines in file)
total=$(wc -l < "$FILE")
if [[ $n -ge $total ]]; then
  rm -f "$COUNTER_FILE"
fi
