// Code colours for every code block on the site (guides, SDK pages, API pages, Try it):
// One Light in light mode and One Dark in dark mode, the palette the API reference uses.
// Each token keeps its One hue and saturation; a token fainter than 4.5:1 against the code background
// (One Light's strings and comments, One Dark's comments) is darkened / lightened just enough to reach it.
// Checked by scripts/code-themes.test.mjs.
const {themes} = require('prism-react-renderer');

const MIN_CONTRAST = 4.5;
const HSL = /hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)/;

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => v * 255);
}

function luminance([r, g, b]) {
  const channel = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// step: -1 darkens (light background), +1 lightens (dark background).
function readable(theme, step) {
  const background = hslToRgb(...HSL.exec(theme.plain.backgroundColor).slice(1).map(Number));
  return {
    ...theme,
    styles: theme.styles.map((style) => {
      const match = style.style.color && HSL.exec(style.style.color);
      if (!match) {
        return style;
      }
      const [h, s, start] = match.slice(1).map(Number);
      let l = start;
      while (contrast(hslToRgb(h, s, l), background) < MIN_CONTRAST && l > 0 && l < 100) {
        l += step;
      }
      return l === start ? style : {...style, style: {...style.style, color: `hsl(${h}, ${s}%, ${l}%)`}};
    }),
  };
}

module.exports = {
  lightCodeTheme: readable(themes.oneLight, -1),
  darkCodeTheme: readable(themes.oneDark, 1),
};
