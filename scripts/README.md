# Rewrite all commit messages and dates

Use these scripts to change the **message** and **date** of every commit in the repo.

## Steps

1. **Generate the edit file** (from repo root):

   ```bash
   ./scripts/prepare-rewrite.sh
   ```

   This creates `commits_to_edit.txt` with one line per commit (oldest first), in the form:

   ```text
   DATE|MESSAGE
   ```

   Example line: `2026-02-08 15:34:15 +0530|Add initial content to readme.md`

2. **Edit `commits_to_edit.txt`**  
   Change the date and/or message on each line. Keep the format `DATE|MESSAGE` (one line per commit).  
   Date format: `YYYY-MM-DD HH:MM:SS +0530` (timezone optional, e.g. `+0000` or `+0530`).

3. **Run the rewrite**:

   ```bash
   ./scripts/rewrite-commits.sh
   ```

   This runs an interactive rebase and amends each commit with the new date and message from your file.

4. **Update the remote** (only if you’re sure):
   ```bash
   git push --force-with-lease
   ```
   Rewriting history changes commit hashes; anyone else with the repo will need to re-clone or reset their branch.

## Notes

- `commits_to_edit.txt` is in `.gitignore` and is not committed.
- If the rebase stops with a conflict, fix it, `git add`, then `git rebase --continue`; the amend script will run again for the next commit.
- To abort: `git rebase --abort`.
