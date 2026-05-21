Write a QA test document for the changes on the current branch, then post it as a comment on the GitHub issue passed as $ARGUMENTS (e.g. `/write-qa-doc 10`).

## Steps

1. Run `git log main..HEAD --oneline` to see what was committed.
2. Run `git diff main..HEAD --name-only` to see which files changed.
3. Read the key changed files to understand what features were built.
4. If an issue number was provided, fetch the issue with `gh issue view <number> --repo aarbanas/red-cross-evidence` to get context on the original requirements.

## Document format

Write the document in Markdown. Structure it by user-facing feature/section — not by file or layer. Each section should contain a flat checklist of test cases written as actions + expected outcomes.

Rules:
- Use `## N. Section title` for top-level sections.
- Use `### N.M Subsection` for logical groupings within a section (data loading, editing, edge cases, etc).
- Every test case is a `- [ ]` checkbox.
- Write in the present tense from the tester's perspective: what they do and what they should see.
- Be specific: name buttons, toasts, field labels, URLs, and visible UI text exactly as they appear in the code.
- Cover happy paths, validation/error cases, and guard conditions (e.g. deletion guards, required fields).
- Always end with a **Regression checks** section listing the existing pages/flows that should still work unchanged.
- Do not include implementation details (table names, tRPC procedure names, Drizzle, etc).

## Posting

Once the document is written, if an issue number was provided, post it as a comment:

```
gh issue comment <number> --repo aarbanas/red-cross-evidence --body "$(cat <<'EOF'
<document content here>
EOF
)"
```

Confirm the comment URL after posting.
