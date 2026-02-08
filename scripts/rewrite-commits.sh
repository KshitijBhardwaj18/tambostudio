#!/usr/bin/env bash
# Rewrites all commits using dates and messages from commits_to_edit.txt.
# Run prepare-rewrite.sh first, edit commits_to_edit.txt, then run this script.
# WARNING: This rewrites history. Use force-push only if you understand the implications.

set -e
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ ! -f "${REPO_ROOT}/commits_to_edit.txt" ]]; then
  echo "Run ./scripts/prepare-rewrite.sh first to create commits_to_edit.txt" >&2
  exit 1
fi

rm -f .git/amend_counter
chmod +x "$REPO_ROOT/scripts/amend-commit.sh" "$REPO_ROOT/scripts/add-exec-to-rebase.sh"

GIT_SEQUENCE_EDITOR="$REPO_ROOT/scripts/add-exec-to-rebase.sh" git rebase -i --root

echo "Done. To update the remote: git push --force-with-lease"
