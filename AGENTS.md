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
