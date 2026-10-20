#!/usr/bin/env node
// Markdown twins for AI agents: every doc page /<path> also serves /<path>.md,
// the way railway.com and www.turbodocx.com do it. docusaurus-plugin-llms
// (generateMarkdownFiles) writes the twins and llms.txt; this script finishes
// the job after `docusaurus build`. Spec: AGENTS.md "Every doc page ships a
// markdown twin".
//
//   node scripts/agent-markdown.mjs build [outDir]   postbuild: frontmatter, rel=alternate, llms-full.txt, then check
//   node scripts/agent-markdown.mjs check [outDir]   verify a finished build without changing it
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://docs.turbodocx.com';
const errors = [];
const fail = (file, msg) => errors.push({ file, msg });

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function htmlMeta(html) {
  const get = (re) => decode((html.match(re)?.[1] ?? '').trim());
  return {
    title: get(/<title[^>]*>([^<]*)<\/title>/),
    description: get(/<meta[^>]*name="description"[^>]*content="([^"]*)"/),
    url: get(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/),
  };
}

// Every built doc page: build/docs.html (the /docs hub) and build/docs/**.
// Redirect stubs (client-redirects) are skipped; noindex pages (unlisted docs)
// are tracked so they can be held to "no twin".
function docPages(out) {
  const files = walk(path.join(out, 'docs')).filter((f) => f.endsWith('.html'));
  for (const hub of ['docs.html', 'docs/index.html']) {
    const f = path.join(out, hub);
    if (fs.existsSync(f) && !files.includes(f)) files.push(f);
  }
  return files
    .map((file) => {
      const rel = path.relative(out, file).split(path.sep).join('/');
      const route = rel.replace(/(\/index)?\.html$/, '');
      const html = fs.readFileSync(file, 'utf8');
      return {
        file,
        route,
        md: path.join(out, `${route}.md`),
        mdUrl: `/${route}.md`,
        html,
        redirect: /http-equiv="refresh"/i.test(html),
        noindex: /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html),
      };
    })
    .filter((p) => !p.redirect);
}

// Docusaurus writes each doc's source file and permalink to .docusaurus/ during
// the build; twins keep the source's relative links (./Other.md), so this map is
// what turns them back into page URLs.
function docSources() {
  const bySource = new Map();
  const byPermalink = new Map();
  for (const f of walk('.docusaurus/docusaurus-plugin-content-docs')) {
    if (!f.endsWith('.json')) continue;
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(f, 'utf8'));
    } catch {
      continue;
    }
    if (typeof doc?.source !== 'string' || typeof doc?.permalink !== 'string') continue;
    const source = doc.source.replace(/^@site\//, '');
    bySource.set(source, doc.permalink);
    byPermalink.set(doc.permalink, source);
  }
  return { bySource, byPermalink };
}

// Outside code fences: point doc links at their twins (or the page when there
// is no twin), make root-relative links and images absolute, and unlink
// relative links to pages that are not built (drafts). A body H1 after the
// title H1 becomes ## so each twin has exactly one H1.
function rewriteBody(body, page, ctx) {
  const source = ctx.docs.byPermalink.get(`/${page.route}`);
  const target = (pathname) => {
    const route = pathname.replace(/^\/+|\/+$/g, '');
    return ctx.twinRoutes.has(route) ? `${SITE}/${route}.md` : `${SITE}/${route}`;
  };
  const link = (text, href) => {
    const [, p, rest = ''] = href.match(/^([^#?]*)(.*)$/);
    if (href.startsWith(`${SITE}/`)) return `[${text}](${target(p.slice(SITE.length))}${rest})`;
    if (href.startsWith('/') && !href.startsWith('//')) return `[${text}](${target(p)}${rest})`;
    if (/^[a-z][a-z0-9+.-]*:|^#|^\/\//i.test(href) || !/\.mdx?$/.test(p)) return `[${text}](${href})`;
    const permalink = source && ctx.docs.bySource.get(path.posix.join(path.posix.dirname(source), p));
    if (permalink) return `[${text}](${target(permalink)}${rest})`;
    ctx.unresolved.push(`${page.mdUrl}: ${href}`);
    return text;
  };
  let h1Seen = 0;
  return body
    .split(/(^[ \t]*```[\s\S]*?^[ \t]*```)/m)
    .map((part, i) => {
      if (i % 2) return part;
      return part
        .replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (m, bang, text, href) =>
          bang ? `![${text}](${href.replace(/^\/(?!\/)/, `${SITE}/`)})` : link(text, href),
        )
        .replace(/^# /gm, (h) => (h1Seen++ ? '## ' : h));
    })
    .join('');
}

function frontmatter(page, body) {
  const meta = htmlMeta(page.html);
  const h1 = body.match(/^# (.+)$/m)?.[1]?.trim();
  const fm = {
    title: h1 || meta.title.replace(/ \| TurboDocx$/, ''),
    description: meta.description,
    url: meta.url || `${SITE}/${page.route}`,
  };
  // JSON strings are valid YAML scalars, so a title with ':' stays safe.
  return Object.entries(fm)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
}

const stripFrontmatter = (md) => md.replace(/^---\n[\s\S]*?\n---\n+/, '');

function llmsLinks(out) {
  const file = path.join(out, 'llms.txt');
  if (!fs.existsSync(file)) {
    fail(file, 'missing; docusaurus-plugin-llms did not run');
    return [];
  }
  const txt = fs.readFileSync(file, 'utf8');
  return [...txt.matchAll(/\]\((https:\/\/docs\.turbodocx\.com[^)\s]*)\)/g)].map((m) => m[1]);
}

function run(out, write) {
  const pages = docPages(out);
  const byMd = new Map(pages.map((p) => [p.md, p]));
  const ctx = {
    docs: write ? docSources() : null,
    twinRoutes: new Set(pages.filter((p) => !p.noindex && fs.existsSync(p.md)).map((p) => p.route)),
    unresolved: [],
  };
  if (write && ctx.docs.bySource.size === 0) {
    fail('.docusaurus', 'no doc metadata found; run this right after `docusaurus build`');
  }
  let twins = 0;

  for (const p of pages) {
    const hasMd = fs.existsSync(p.md);
    if (p.noindex) {
      if (hasMd) fail(p.md, `twin of a noindex page (/${p.route}); add it to ignoreFiles or make the page indexable`);
      continue;
    }
    if (!hasMd) {
      fail(p.file, `missing markdown twin ${p.mdUrl} (see AGENTS.md "Every doc page ships a markdown twin")`);
      continue;
    }
    twins++;

    if (write) {
      const body = rewriteBody(stripFrontmatter(fs.readFileSync(p.md, 'utf8')).trim(), p, ctx);
      fs.writeFileSync(p.md, `---\n${frontmatter(p, body)}\n---\n\n${body}\n`);
      if (!p.html.includes('type="text/markdown"')) {
        p.html = p.html.replace('</head>', `<link rel="alternate" type="text/markdown" href="${p.mdUrl}"></head>`);
        fs.writeFileSync(p.file, p.html);
      }
    }

    const md = fs.readFileSync(p.md, 'utf8');
    if (!/^---\ntitle: .+\n(description: .+\n)?url: .+\n---\n/.test(md)) fail(p.md, 'missing title/description/url frontmatter');
    if (!/^# \S/m.test(md)) fail(p.md, 'has no "# H1" heading');
    if (!p.html.includes(`<link rel="alternate" type="text/markdown" href="${p.mdUrl}">`)) {
      fail(p.file, `missing <link rel="alternate" type="text/markdown" href="${p.mdUrl}">`);
    }
  }

  // A twin no page owns means the plugin wrote it under the wrong path
  // (e.g. "delete-webhook.api.md" for the /docs/API/delete-webhook page).
  const mdFiles = [...walk(path.join(out, 'docs')), path.join(out, 'docs.md')].filter(
    (f) => f.endsWith('.md') && fs.existsSync(f),
  );
  for (const f of mdFiles) {
    if (!byMd.has(f)) fail(f, 'twin does not match any built page URL');
  }

  // llms.txt must point agents at twins that exist.
  const links = llmsLinks(out);
  for (const url of links) {
    const m = url.slice(SITE.length).match(/^\/(.+)\.md$/);
    const page = m && byMd.get(path.join(out, `${decodeURIComponent(m[1])}.md`));
    if (!m) fail('llms.txt', `${url} must link the .md twin`);
    else if (!page || !fs.existsSync(page.md)) fail('llms.txt', `${url} has no twin in the build`);
    else if (page.noindex) fail('llms.txt', `${url} is a noindex page`);
  }

  // llms-full.txt = every twin, in llms.txt order.
  if (write) {
    const seen = new Set();
    const bodies = links
      .map((url) => path.join(out, `${decodeURIComponent(url.slice(SITE.length + 1))}`))
      .filter((f) => fs.existsSync(f) && !seen.has(f) && seen.add(f))
      .map((f) => fs.readFileSync(f, 'utf8').trim());
    const head =
      '# TurboDocx Documentation\n\n> Turbocharging your Document Workflows\n\n' +
      `Every page on ${SITE}, as markdown. Index: ${SITE}/llms.txt`;
    fs.writeFileSync(path.join(out, 'llms-full.txt'), `${[head, ...bodies].join('\n\n---\n\n')}\n`);
  }

  for (const u of ctx.unresolved) console.log(`::warning::unlinked ${u} (target page is not built, e.g. a draft)`);
  console.log(
    `agent-markdown: ${pages.length} doc pages, ${twins} twins, ${pages.filter((p) => p.noindex).length} noindex, ${links.length} llms.txt links`,
  );
}

const [cmd, outArg] = process.argv.slice(2);
if (cmd !== 'build' && cmd !== 'check') {
  console.error('usage: agent-markdown.mjs build|check [outDir]');
  process.exit(2);
}
const out = outArg || 'build';
if (!fs.existsSync(out)) {
  console.error(`agent-markdown: ${out}/ not found; run the Docusaurus build first`);
  process.exit(2);
}
run(out, cmd === 'build');

if (errors.length) {
  for (const e of errors) console.log(`::error file=${path.relative(process.cwd(), e.file) || e.file}::${e.msg}`);
  console.error(`\nagent-markdown: ${errors.length} problem(s). Spec: AGENTS.md "Every doc page ships a markdown twin".`);
  process.exit(1);
}
