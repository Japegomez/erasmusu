## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

### Codebase exploration

For any question about this codebase, its architecture, file relationships, or project content, use the **graphify** skill first (especially when `graphify-out/` exists). Prefer `/graphify query` over ad-hoc file walks when answering structure or dependency questions.
