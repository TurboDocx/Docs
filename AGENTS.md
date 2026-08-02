# AGENTS.md

Guidance for AI agents (and humans) working in the TurboDocx **Docs** repo (Docusaurus documentation site).

## Branching rule — PRs go against `develop`, never `main`

**Always open pull requests against `develop`.** `main` is the GitHub default branch, so PRs are created against it by default — that is the mistake to avoid. `develop` is the integration branch; `main` is release-only.

- Base every feature/docs branch on `develop`.
- When opening a PR (UI or `gh pr create`), set the base to `develop` explicitly:
  ```bash
  gh pr create --base develop
  ```
- Do not target `main` unless you are cutting a release and have been told to.

## Filing issues — use the issue templates, don't write freeform

Every issue in this repo must use one of the `.github/ISSUE_TEMPLATE/` forms (`blank_issues_enabled: false`). Before running `gh issue create`, read `.github/ISSUE_TEMPLATE/` first:

- **Bug Report** (`bug-report.yml`) — for bugs / unexpected behavior.
- **Change Request** (`change-request.yml`) — SOC 2 change record. Required for Planned/Emergency changes; Standard changes (dependency bumps, low-risk edits) can skip it since the merged PR is the record on its own.

`gh issue create --title/--body/--label` does **not** fill these forms — it bypasses them and writes a blank freeform issue, even though the web UI blocks blank issues. To actually use a form from the CLI, replicate its field structure as markdown headers in `--body-file` (see the form's `body:` fields in the `.yml` for the exact labels/order), and set `--label` to match the template's `labels:` (e.g. `change` for Change Request — create the label first with `gh label create` if it doesn't exist yet).

The implementing PR should close the issue with `Closes #<issue>`.

## Adding or updating content — use the guidewright skills

When adding new docs or refreshing a guide, use the guidewright skills so screenshots and click targets stay accurate:

- **`/guidewright-capture`** — drive the live UI, capture screenshots, and draw red boxes on the exact element each step references. Use for new step-by-step guides or when the UI changed and screenshots are stale.
- **`/guidewright-review`** — walk the path a doc describes in the live product and get prioritized UX feedback. Use before shipping a new or heavily edited guide.

## Common commands

```bash
npm start          # Docusaurus dev server
npm run build      # Build static site
npm run serve      # Serve production build locally
npm run clear      # Clear Docusaurus cache
```
