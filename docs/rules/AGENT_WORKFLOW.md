# Agent Workflow — GRAND VIEW Website

How an AI agent (or developer) should work on this project, phase by phase. **LOCAL DEV ONLY.**

## 1. Before touching code
1. Read `AGENTS.md`, then `docs/audits/BASELINE_AUDIT.md` and `docs/audits/EXISTING_STACK.md`.
2. Confirm the project root and that the stack is still static (no surprise framework).
3. Read `docs/product/PRD.md` scope + content restrictions.

## 2. Making a change
1. Identify the owning module (config / template / style / js / docs).
2. Keep company data in `src/config/company.js` only.
3. Follow `docs/rules/*` (coding, component, design, accessibility, security).
4. Make the smallest correct change; preserve existing features and the original logo/pages.

## 3. Verifying (mandatory)
1. `node --check assets/js/main.js` for JS edits.
2. `node tests/run.js` — all checks must pass.
3. For UI changes, do the manual checks in `docs/tasks/QA_CHECKLIST.md`.
4. Never mark a task DONE/VERIFIED without evidence of a passing check.

## 4. Documenting
- Update `docs/tasks/CHANGELOG.md` (what changed, files).
- Update task status in `docs/tasks/IMPLEMENTATION_PLAN.md`.
- Update memory: `docs/memory/PROJECT_STATE.md`, `DECISIONS_LOG.md`, `NEXT_ACTIONS.md`.

## 5. Phase boundaries
At each phase: update statuses, record decisions, note blockers, list changed files, run checks.

## 6. Definition of done (per task)
- Requirement met; tests pass; docs/changelog/memory updated; no invented claims; nothing published.

## 7. Escalation / clarification triggers
Ask the owner before: changing contact details, adding a dependency, migrating frameworks, altering
licensing wording, or anything that would publish/deploy.

## 8. Prohibited
- Blind full rewrites; deleting originals; skipping tests; claiming success without running them;
  any deploy/publish action.
