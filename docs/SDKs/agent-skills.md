---
title: Install with AI Agents (Agent Skills)
sidebar_position: 0
sidebar_label: Install with AI Agents
description: Install the TurboDocx SDK and @turbodocx/html-to-docx into any project in one prompt using the TurboDocx Agent Skill — works with Claude Code, GitHub Copilot, Cursor, OpenCode, OpenAI Codex CLI, and Gemini CLI.
keywords:
  - agent skills
  - ai agent
  - claude code
  - github copilot
  - cursor
  - opencode
  - openai codex
  - gemini cli
  - npx skills
  - turbodocx skill
  - turbosign skill
  - turbopartner skill
  - html-to-docx skill
  - automated sdk install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install TurboDocx with AI Agents

The TurboDocx Quickstart Skill is an [Agent Skills](https://agentskills.io) plugin that lets your AI coding agent install and wire up the TurboDocx SDK or `@turbodocx/html-to-docx` in a single prompt. It detects your project's language and framework, installs the package, configures environment variables, and generates working integration code that matches your existing codebase patterns.

<a href="https://skills.sh/TurboDocx/quickstart" target="_blank" rel="noopener noreferrer"><img src="https://skills.sh/b/TurboDocx/quickstart" alt="TurboDocx quickstart on skills.sh" height="28" /></a>

Works with:

- **Claude Code**
- **GitHub Copilot** (VS Code)
- **Cursor**
- **OpenCode**
- **OpenAI Codex CLI**
- **Gemini CLI**
- Any tool that supports the [Agent Skills](https://agentskills.io) standard

## Skills

| Skill | What it does |
| :--- | :--- |
| **`turbodocx-sdk`** | Installs the TurboDocx SDK and generates working integration code for **TurboSign** (e-signatures), **Deliverable** (template document generation), **TurboQuote** (quotes & CPQ), **TurboWebhooks** (signature events), and **TurboPartner** (partner/org management). Supports JavaScript/TypeScript, Python, Go, PHP, and Java. |
| **`turbodocx-html-to-docx`** | Sets up [`@turbodocx/html-to-docx`](https://www.npmjs.com/package/@turbodocx/html-to-docx) to convert HTML to Microsoft Word documents in Node.js, browser, or hybrid projects. |

## Install

The fastest path is the `npx skills` CLI, which auto-detects which agents you have installed and drops the skills into the right config directory.

<Tabs groupId="skill-install">
  <TabItem value="both" label="Both skills" default>

```bash
npx skills add TurboDocx/quickstart
```

  </TabItem>
  <TabItem value="sdk" label="SDK only">

```bash
npx skills add TurboDocx/quickstart --skill turbodocx-sdk
```

  </TabItem>
  <TabItem value="html" label="html-to-docx only">

```bash
npx skills add TurboDocx/quickstart --skill turbodocx-html-to-docx
```

  </TabItem>
  <TabItem value="global" label="Globally (all projects)">

```bash
npx skills add TurboDocx/quickstart -g
```

  </TabItem>
</Tabs>

## Usage

After installing, invoke the skill in your editor or terminal:

```text
/turbodocx-sdk
```

The skill will:

1. **Detect** your project language from manifest files (`package.json`, `pyproject.toml`, `go.mod`, `composer.json`, `pom.xml`).
2. **Ask** which product you need. By default it offers **TurboSign** and **Deliverable** (and the generate-then-sign combo); **TurboPartner**, **TurboWebhooks**, and **TurboQuote** are opt-in via their shortcuts (below).
3. **Install** the SDK with your project's package manager.
4. **Configure** environment variables in `.env` and `.env.example`.
5. **Analyze** your codebase structure (Express, FastAPI, Spring Boot, Laravel, Gin, etc.).
6. **Generate** integration code that matches your existing patterns, with route handlers wired into your app.

### Shortcuts

Skip the product selection prompt:

```text
/turbodocx-sdk turbosign              # TurboSign (e-signatures) only
/turbodocx-sdk deliverable            # Deliverable (template document generation) only
/turbodocx-sdk turbosign+deliverable  # generate-then-sign workflow
/turbodocx-sdk turboquote             # TurboQuote (quotes, catalog, price books) only
/turbodocx-sdk turbowebhooks          # TurboWebhooks (signature events) only
/turbodocx-sdk turbopartner           # TurboPartner (org provisioning) only
/turbodocx-sdk both                   # TurboSign + Deliverable
```

For HTML-to-DOCX:

```text
/turbodocx-html-to-docx
```

## What gets generated

### TurboSign

- Client configuration with environment variable loading
- `sendSignature()` — send documents for e-signature
- `getStatus()` — check document/recipient status
- A route handler wired into your existing app

### Deliverable

- `generateDeliverable()` — render a document from a template with variable substitution
- `getDeliverableDetails()` — fetch a generated deliverable by ID
- If you also pick TurboSign, the generate-then-sign workflow (render a template, then route it for signature)

### TurboQuote

- `createQuote()` and line-item helpers for quotes and proposals
- Optional catalog scaffolding — `createProduct()`, `createBundle()`, `createPriceBook()`, `applyPriceBook()`
- Optional payments path — `createPaymentLink()` and `getPaymentStatus()` for collecting payment on a quote

### TurboWebhooks

- A verified webhook endpoint that subscribes to signature events (for example `signature.document.completed`)
- `X-TurboDocx-Signature` verification so you can trust incoming payloads

### TurboPartner

- Partner client configuration
- `createOrganization()` — provision customer organizations
- `listOrganizations()` — list managed orgs
- A route handler wired into your existing app

### `@turbodocx/html-to-docx`

- Helper module appropriate for your framework (Express, Next.js API route, Fastify, NestJS controller, etc.)
- A working endpoint that returns a `.docx` response
- Browser-bundle setup if you're running in a static HTML / no-bundler project

## Prerequisites

- Get your API credentials from the [TurboDocx dashboard](https://app.turbodocx.com).
- Node.js 18+ if using `npx`.

## Source and feedback

The skill is open source at **[github.com/TurboDocx/quickstart](https://github.com/TurboDocx/quickstart)** — issues, PRs, and feature requests welcome.

## Related

- [SDKs Overview](./index.md)
- [TurboSign JavaScript SDK](./javascript.md)
- [TurboSign Python SDK](./python.md)
- [TurboPartner JavaScript SDK](./partner-javascript.md)
