Migrate this project from ESLint + Prettier to Biome.

Steps:
1. Install @biomejs/biome as a dev dependency
2. Run `npx @biomejs/biome migrate prettier --write`
3. Run `npx @biomejs/biome migrate eslint --write`
4. Run `npx @biomejs/biome format --write .` and capture any diffs
5. Run `npx @biomejs/biome lint --fix .` and capture output
6. Update package.json scripts: lint, lint:fix, format
7. Update .husky pre-commit hook to use biome check --staged
8. Remove old packages: eslint, prettier, and all their plugins
9. Delete eslint.config.js, prettier.config.js, .prettierignore, .eslintignore
10. Run `npx tsc --noEmit` to make sure nothing broke
11. Show me a summary of: rules that didn't migrate, any remaining lint errors, and anything needing manual review

Do not delete old config files until step 8 is confirmed working.
