// Run: node --test scripts/code-themes.test.mjs
// Every code block on the site (guides, SDK pages, API pages, Try it) uses one palette per theme:
// One Light in light mode, One Dark in dark mode. Token colours keep their One hue but must be
// readable: at least 4.5:1 against the code background.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {themes} = require('prism-react-renderer');
const {lightCodeTheme, darkCodeTheme} = require('../code-themes.js');

const hsl = (c) => {
  const m = /hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)/.exec(c);
  assert.ok(m, `expected an hsl() colour, got ${c}`);
  return m.slice(1).map(Number);
};
const rgb = ([h, s, l]) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => v * 255);
};
const luminance = (c) =>
  rgb(hsl(c))
    .map((v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

for (const [name, theme, base] of [
  ['light', lightCodeTheme, themes.oneLight],
  ['dark', darkCodeTheme, themes.oneDark],
]) {
  test(`${name} code theme is ${name === 'light' ? 'One Light' : 'One Dark'} (same background, text and hues)`, () => {
    assert.deepEqual(theme.plain, base.plain);
    assert.equal(theme.styles.length, base.styles.length);
    theme.styles.forEach((style, i) => {
      assert.deepEqual(style.types, base.styles[i].types);
      if (base.styles[i].style.color) {
        assert.equal(hsl(style.style.color)[0], hsl(base.styles[i].style.color)[0], `hue of ${style.types}`);
      }
    });
  });

  test(`every ${name} token colour is at least 4.5:1 on the code background`, () => {
    for (const style of theme.styles) {
      if (!style.style.color) continue;
      const ratio = contrast(style.style.color, theme.plain.backgroundColor);
      assert.ok(ratio >= 4.5, `${style.types.join(',')} ${style.style.color} is ${ratio.toFixed(2)}:1`);
    }
  });
}
