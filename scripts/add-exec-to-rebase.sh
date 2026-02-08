#!/usr/bin/env bash
# Injects "exec ./scripts/amend-commit.sh" after each "pick" in the rebase todo.
# Used as GIT_SEQUENCE_EDITOR so rebase runs the amend script for every commit.

TODO="$1"
NEW=$(mktemp)
while IFS= read -r line; do
  printf '%s\n' "$line"
  if [[ "$line" =~ ^pick ]]; then
    echo "exec ./scripts/amend-commit.sh"
  fi
done < "$TODO" > "$NEW"
mv "$NEW" "$TODO"
