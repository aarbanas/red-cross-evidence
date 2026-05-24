Run a QA session for the GitHub issue passed as $ARGUMENTS (e.g. `/run-qa 10`).

## 1. Read the QA spec

Fetch the issue with all comments:

```
gh issue view <number> --repo aarbanas/red-cross-evidence --comments
```

Find the most recent comment that contains `- [ ]` checkboxes — that is the QA spec written by `/write-qa-doc`. Extract every test case (every `- [ ]` line) in order. If no such comment exists, tell the user and stop.

## 2. Start the dev server

Check if something is already listening on port 3000:

```
lsof -ti:3000
```

If not running, start it in the background:

```
yarn dev &
```

Wait until `http://localhost:3000` responds before continuing.

## 3. Log in via Playwright

Use Playwright MCP to:
1. Navigate to `http://localhost:3000/login`
2. Fill the email field with `admin@dck-pgz.hr`
3. Fill the password field with the value of `ADMIN_PASSWORD` from `.env`
4. Submit the form and confirm the session is active (e.g. redirected away from `/login`)

## 4. Post the initial progress comment

Post a comment on the issue and note the comment URL returned:

```
gh issue comment <number> --repo aarbanas/red-cross-evidence --body "$(cat <<'EOF'
## QA Run — Issue #<number>

**Status:** ⏳ In progress
**Date:** <today's date>

### Results

<list every test case as `- ⏳ <description>`>

---
*Last updated: <timestamp>*
EOF
)"
```

Extract the numeric comment ID from the returned URL (the digits after `issuecomment-`). You will use this ID to update the comment throughout the run.

## 5. Execute each test case

Work through the test cases one by one in order. For each:

1. Use Playwright MCP to perform the action described.
2. Determine the result: **pass** or **fail**.
3. Immediately update the running comment to reflect the result:

```
gh api repos/aarbanas/red-cross-evidence/issues/comments/<comment_id> \
  --method PATCH \
  -f body="<full updated comment body>"
```

Use these markers in the comment body:
- `✅` — passed
- `❌` — failed (append a brief note after the description, e.g. `— 500 error on save`)
- `⏳` — currently running
- `- [ ]` — not yet started

## 6. On failure

When a test case fails:
1. Mark it `❌` in the comment with a short failure note.
2. Ask the user: **"Test case failed: '<description>'. Open a bug issue? (y/n)"**
3. If yes, create the issue:

```
gh issue create --repo aarbanas/red-cross-evidence \
  --title "Bug: <short description>" \
  --label "bug" \
  --body "$(cat <<'EOF'
## Description

<what failed>

## Steps to reproduce

<numbered steps from the test case>

## Expected behaviour

<what the test case expected>

## Actual behaviour

<what actually happened>

## Related

Found during QA of #<parent issue number>.
EOF
)"
```

4. Add a link to the newly created bug issue in the running comment, next to the `❌` entry.

## 7. Finish

Once all test cases are done, update the comment one final time:
- Change `**Status:** ⏳ In progress` to `**Status:** ✅ All passed` if everything passed, or `**Status:** ❌ <N> failure(s)` if any failed.
- Replace the timestamp.

Print the final comment URL to the user.
