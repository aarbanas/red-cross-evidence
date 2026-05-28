---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## After all questions are resolved

Once the interview is complete and all branches of the decision tree are resolved, do the following:

1. Extract the GitHub issue number from the arguments (e.g. `/grill-me 42` → issue `42`). If no issue number was provided, ask the user for one before proceeding.
2. Write a plan file to `.claude/PLAN_{issue_no}.md` using the structure below. Base every section on the answers agreed during the interview — do not invent details.
3. Tell the user the file was created and invite them to review and refine it before implementation begins.

### Plan file structure

```markdown
# Plan: {short title} (#{issue_no})

## Goal
One-paragraph summary of what we are building and why.

## Scope
Bullet list of what is in scope and what is explicitly out of scope.

## Design decisions
For each major decision resolved during the interview, one entry:
- **Decision**: …
- **Rationale**: …

## Implementation steps
Ordered list of concrete tasks, each small enough to be a single commit or PR.

## Open questions
Anything deferred or not yet resolved.
```
