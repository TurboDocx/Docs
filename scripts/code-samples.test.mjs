// Run: node --test scripts/code-samples.test.mjs
// <ScriptLoader scriptPath="..."> fetches one sample file per language (and per framework variant)
// from static/scripts. A file that is not there is a 404 in the reader's console, so every file a
// page asks for must exist, and every sample folder must be used by a page.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {DEFAULT_LANGUAGES, EXTENSIONS, sampleFiles} from '../src/components/scriptLoaderFiles.mjs';

const root = new URL('..', import.meta.url).pathname;
const walk = (dir) =>
  fs.readdirSync(dir, {withFileTypes: true}).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );

// Every <ScriptLoader ... /> in the docs, with its scriptPath and optional languages={{...}}.
const usages = walk(path.join(root, 'docs'))
  .filter((f) => /\.mdx?$/.test(f))
  .flatMap((file) =>
    [...fs.readFileSync(file, 'utf8').matchAll(/<ScriptLoader\b([\s\S]*?)\/>/g)].map((m) => {
      const scriptPath = m[1].match(/scriptPath="([^"]+)"/)?.[1];
      const languages = m[1].match(/languages=\{(\{[\s\S]*?\})\}/)?.[1];
      return {
        file: path.relative(root, file),
        scriptPath,
        // eslint-disable-next-line no-new-func
        languages: languages ? Function(`return (${languages});`)() : undefined,
      };
    }),
  );

test('the docs use ScriptLoader', () => {
  assert.ok(usages.length > 0);
  for (const u of usages) assert.ok(u.scriptPath, `${u.file}: ScriptLoader without scriptPath`);
});

test('every sample file a page requests exists', () => {
  const missing = usages.flatMap((u) =>
    sampleFiles(u.languages ?? DEFAULT_LANGUAGES)
      .map((f) => `scripts/${u.scriptPath}/${f}`)
      .filter((f) => !fs.existsSync(path.join(root, 'static', f)))
      .map((f) => `${u.file}: ${f}`),
  );
  assert.deepEqual(missing, []);
});

test('languages props only name known languages', () => {
  for (const u of usages.filter((x) => x.languages)) {
    for (const lang of Object.keys(u.languages)) assert.ok(EXTENSIONS[lang], `${u.file}: unknown language ${lang}`);
  }
});

test('every sample file is shown by a page (no dead copies)', () => {
  const requested = new Set(
    usages.flatMap((u) => sampleFiles(u.languages ?? DEFAULT_LANGUAGES).map((f) => `${u.scriptPath}/${f}`)),
  );
  const scriptsDir = path.join(root, 'static', 'scripts');
  const unused = walk(scriptsDir)
    .map((f) => path.relative(scriptsDir, f))
    .filter((f) => f !== 'README.md' && !requested.has(f));
  assert.deepEqual(unused, []);
});

// A sub-tab is only real if its file uses the framework it is named after.
const FRAMEWORK = {
  express: /require\(["']express["']\)/,
  fastify: /require\(["']fastify["']\)/,
  fastapi: /from fastapi import/,
  flask: /from flask import/,
  controller: /ControllerBase/,
  minimal: /WebApplication\.CreateBuilder/,
};

test('every framework sub-tab sample uses that framework', () => {
  const wrong = [];
  for (const u of usages) {
    for (const [lang, variants] of Object.entries(u.languages ?? DEFAULT_LANGUAGES)) {
      for (const variant of variants) {
        const rel = `${u.scriptPath}/${lang}/${variant}.${EXTENSIONS[lang]}`;
        const file = path.join(root, 'static', 'scripts', rel);
        if (fs.existsSync(file) && !FRAMEWORK[variant].test(fs.readFileSync(file, 'utf8'))) wrong.push(rel);
      }
    }
  }
  assert.deepEqual(wrong, []);
});

test('framework variants of a sample are not copies of each other', () => {
  const copies = [];
  for (const u of usages) {
    for (const [lang, variants] of Object.entries(u.languages ?? DEFAULT_LANGUAGES)) {
      const bodies = variants.map((v) => fs.readFileSync(path.join(root, 'static', 'scripts', u.scriptPath, lang, `${v}.${EXTENSIONS[lang]}`), 'utf8'));
      if (bodies.length > 1 && new Set(bodies).size < bodies.length) copies.push(`${u.scriptPath}/${lang}`);
    }
  }
  assert.deepEqual(copies, []);
});

test('SDK pages do not show the same code under JavaScript and TypeScript', () => {
  const same = [];
  for (const file of walk(path.join(root, 'docs', 'SDKs')).filter((f) => /\.mdx?$/.test(f))) {
    const s = fs.readFileSync(file, 'utf8');
    for (const m of s.matchAll(/<Tabs groupId="js-variant">([\s\S]*?)<\/Tabs>/g)) {
      const blocks = [...m[1].matchAll(/```\w+\n([\s\S]*?)```/g)].map((b) => b[1]);
      if (blocks.length === 2 && blocks[0] === blocks[1]) same.push(`${path.relative(root, file)}:${s.slice(0, m.index).split('\n').length}`);
    }
  }
  assert.deepEqual(same, []);
});
