Compare and update dependencies from a fresh T3 stack, then verify TypeScript compatibility.

Steps:

1. Run `yarn create t3-app /tmp/t3-fresh --noGit --noInstall --tailwind --trpc --nextAuth --drizzle --appRouter --dbProvider postgresql --eslint --importAlias "~/*"`
2. Read /tmp/t3-fresh/package.json and the local package.json
3. Compare all dependencies and devDependencies
4. Show me a table of differences: package name | current version | t3-latest version | recommendation
5. Wait for my approval on which packages to update before touching anything
6. Apply approved updates to package.json
7. Run `yarn install`
8. Run `npx tsc --noEmit` and capture the full output
9. If there are TypeScript errors:
   a. Analyze all errors and group them by type (missing types, API changes, incompatible types, etc.)
   b. Show me a summary of what changed and what needs fixing
   c. Fix the errors file by file, starting with the most depended-on files first
   d. After each file fix, re-run `npx tsc --noEmit` to check progress
   e. Repeat until tsc exits clean or you hit errors you cannot fix automatically
   f. For errors you cannot fix, show them clearly and explain what manual action is needed
10. Run `yarn lint` to catch any remaining ESLint issues
11. Clean up /tmp/t3-fresh

## Rules

- Never run `yarn db:migrate` or any drizzle commands
- Do not modify schema files unless the error is directly in a schema file
- Do not modify .env or any config files (next.config.js, drizzle.config.ts, tsconfig.json) without asking first
- If tsc errors remain after 3 fix attempts on the same file, stop and report instead of looping
- Do not auto-apply anything — show the diff table and wait for my approval first.
