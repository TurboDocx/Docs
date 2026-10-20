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

## Every doc page ships a markdown twin (for AI agents)

Every public doc page `/<path>` also serves `/<path>.md` as `text/markdown`, the same pattern as www.turbodocx.com and railway.com (`docs.turbodocx.com/docs/API/delete-webhook` has `docs.turbodocx.com/docs/API/delete-webhook.md`; the `/docs` hub is `/docs.md`). `llms.txt` links the `.md` URLs, `llms-full.txt` is every twin concatenated, and each HTML page advertises its twin with `<link rel="alternate" type="text/markdown" href="/<path>.md">`. Twins are not in the sitemap.

**How twins are produced (you don't write them)**
- `docusaurus-plugin-llms` (`generateMarkdownFiles: true` in `docusaurus.config.js`) writes one cleaned `.md` per doc, at the path of the page's real URL (it honors `id` and `slug`), and writes `llms.txt` pointing at the twins.
- `npm run build` then runs `scripts/agent-markdown.mjs build` as `postbuild`. It adds YAML frontmatter (`title`, `description`, `url`) from the page's H1, meta description and canonical URL, rewrites doc links (relative `./Other.md` and `/docs/...`) to absolute twin URLs using the build's `.docusaurus` doc metadata, makes images absolute, unlinks links to pages that are not built, injects the `rel="alternate"` link, and rebuilds `llms-full.txt` from the twins in `llms.txt` order.
- Excluded on purpose: `draft: true` pages (not built) and `unlisted: true` pages (noindex). The config reads `unlisted` from frontmatter, so a hidden page never gets a twin or an `llms.txt` entry. Partials (`_*.mdx`) are inlined into the pages that import them.
- OpenAPI reference pages (`docs/API/*.api.mdx`) get twins too. Their prose, curl and JSON examples carry over; the generated endpoint, header and body tables (`<DisplayEndpoint>`, `<HeadersTable>`, `<BodyTable>`, `<QueryTable>`) do not, so put the method, path and key parameters in the prose.

**What authors must do**
- Keep `title` and `description` filled in every doc's frontmatter. They become the twin's frontmatter, its H1 and summary, and the `llms.txt` entry.
- Write content that survives as plain markdown. `<Tabs>`/`<TabItem>` become a bold label line per tab followed by its content; `:::tip` style admonitions stay as raw `:::` blocks; any other React component (for example `<QuickstartSkillNudge>`) is dropped along with its props, so never put the only copy of a fact in a component prop.
- Nothing to do for new pages: the twin appears on the next build. To hide a page, use `unlisted: true` or `draft: true`.

**Checks**
- `postbuild` fails `npm run build` if any indexable doc page has no twin, a twin has no frontmatter or H1, a page is missing its `rel="alternate"` link, a twin does not match any page URL, a noindex page has a twin, or any `docs.turbodocx.com` link in `llms.txt` is not an existing `.md`. `npm run check:md` re-runs the same checks on an existing `build/` without changing it.
- CI: `.github/workflows/deploy.yml` builds every PR (that build is the gate), prints a few twins, and after each deploy (PR preview and production) requests every `.md` plus `llms.txt` and `llms-full.txt` and fails unless each returns 200 with `text/markdown` (or `text/plain` for the `.txt` files).

## Change Management (SOC 2)

This is a **public** repo. Every non-standard change is recorded as a **Change Request** issue
(`.github/ISSUE_TEMPLATE/change-request.yml`); the PR closes it with `Closes #<issue>`. Bugs use
the **Bug Report** form. Standard changes (dependency bumps, docs typos) skip the issue.

**Never reference internal repos or PRs (e.g. backend/frontend) in this public repo — it leaks
unreleased internal context.**
