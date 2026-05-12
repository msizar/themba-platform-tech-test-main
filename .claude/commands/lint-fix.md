# Lint And Auto-Fix

Run project linting, apply safe auto-fixes, and report exactly what changed.

## Command

Use this flow in order:

1. Run lint first:

```bash
npm run lint
```

2. If lint errors exist, run auto-fix:

```bash
npm run lint:fix
```

3. Run lint again to verify:

```bash
npm run lint
```

4. Summarize results:
- Count of issues before and after fix
- Files changed
- Remaining manual fixes (if any)

## Guardrails

- Do not modify generated files or lockfiles unless required.
- Do not change app behavior to silence lint.
- Prefer minimal, standards-compliant edits.
- If auto-fix leaves errors, list actionable manual edits with file paths.
