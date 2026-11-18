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
