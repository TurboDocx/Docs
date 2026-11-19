// Which sample files <ScriptLoader> requests from static/scripts/<scriptPath>/.
// Shared with scripts/code-samples.test.mjs, which checks that every requested file exists.

// Language → framework variants. A language with variants loads <lang>/<variant>.<ext>; one
// without loads <lang>.<ext>. Order here is the tab order.
export const DEFAULT_LANGUAGES = {
  nodejs: ['express', 'fastify'],
  python: ['fastapi', 'flask'],
  csharp: ['controller', 'minimal'],
  php: [],
  java: [],
  go: [],
  ruby: [],
  powershell: [],
};

export const EXTENSIONS = {
  nodejs: 'js',
  python: 'py',
  php: 'php',
  csharp: 'cs',
  java: 'java',
  go: 'go',
  ruby: 'rb',
  powershell: 'ps1',
};

// Files relative to the sample folder, e.g. ['nodejs/express.js', 'php.php'].
export function sampleFiles(languages = DEFAULT_LANGUAGES) {
  return Object.entries(languages).flatMap(([lang, variants]) =>
    variants.length > 0
      ? variants.map((variant) => `${lang}/${variant}.${EXTENSIONS[lang]}`)
      : [`${lang}.${EXTENSIONS[lang]}`],
  );
}
