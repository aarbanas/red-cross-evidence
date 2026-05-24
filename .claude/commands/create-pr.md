Create a pull request for the current branch with a screenshot of the running app attached to the description.

## 1. Gather branch context

```bash
git rev-parse --abbrev-ref HEAD
git log main..HEAD --oneline
git diff main..HEAD --stat
```

Use the commit list and diff stat to draft a PR title (under 70 chars) and summary (2–4 bullet points describing what changed and why).

## 2. Ensure dev server is running

Check port 3000:

```bash
lsof -ti:3000
```

If nothing is listening, start the dev server in the background:

```bash
yarn dev &
```

Wait until `http://localhost:3000` responds (poll with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` until it returns 200).

## 3. Log in and take a screenshot

Use Playwright MCP to:

1. Navigate to `http://localhost:3000`
2. If redirected to `/login` or a login page is shown, fill in credentials:
   - Email: `admin@dck-pgz.hr`
   - Password: read `ADMIN_PASSWORD` from `.env`
   - Submit and confirm redirect away from `/login`
3. Navigate to the most relevant page for the changes on this branch (e.g. the feature being added or the page most affected by the diff)
4. Take a full-page screenshot and save it to `/tmp/pr-screenshot.png`

## 4. Upload screenshot to GitHub

Upload the screenshot as a file on the current branch using the GitHub Contents API:

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
CONTENT=$(base64 -i /tmp/pr-screenshot.png)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILE_PATH=".pr-screenshots/${TIMESTAMP}.png"

gh api repos/aarbanas/red-cross-evidence/contents/$FILE_PATH \
  --method PUT \
  --field message="chore: add PR screenshot" \
  --field "content=$CONTENT" \
  --field branch=$BRANCH \
  --jq '.content.download_url'
```

The returned `download_url` is the raw URL you will embed in the PR body. It has the form:
`https://raw.githubusercontent.com/aarbanas/red-cross-evidence/<branch>/.pr-screenshots/<timestamp>.png`

## 5. Create the PR

```bash
gh pr create \
  --assignee aarbanas \
  --title "<title>" \
  --body "$(cat <<'EOF'
## Summary

- <bullet 1>
- <bullet 2>

## Screenshot

![App screenshot](<raw-url-from-step-4>)
EOF
)"
```

Return the PR URL to the user.
