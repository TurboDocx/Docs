# Code samples

The multi-language code tabs on the docs pages are loaded from here by `<ScriptLoader>`
(`src/components/ScriptLoader.jsx`). Each page section has its own folder, named by `scriptPath`:

```jsx
import ScriptLoader from '@site/src/components/ScriptLoader';

<ScriptLoader
  scriptPath="templates/api/upload-template"
  id="upload-template-examples"
  label="Path A: Upload Template Examples"
/>
```

## Files in a sample folder

By default the loader shows these tabs, in this order (`src/components/scriptLoaderFiles.mjs`):

| Tab | File |
| --- | --- |
| Node.js | `nodejs/express.js`, `nodejs/fastify.js` |
| Python | `python/fastapi.py`, `python/flask.py` |
| C# | `csharp/controller.cs`, `csharp/minimal.cs` |
| PHP | `php.php` |
| Java | `java.java` |
| Go | `go.go` |
| Ruby | `ruby.rb` |
| PowerShell | `powershell.ps1` |

A section that only has some of them lists what it has, so the page never requests a missing
file (each one would be a 404 in the reader's console):

```jsx
<ScriptLoader
  scriptPath="turbosign/api/bulk/ingest"
  languages={{ nodejs: ['express', 'fastify'], python: ['fastapi', 'flask'] }}
  id="bulk-ingest"
  label="Bulk Ingest - Create Batch"
/>
```

## Checks

`npm test` runs `scripts/code-samples.test.mjs`, which fails when a page requests a file that is
not here, or when a file here is not shown by any page. Keep samples runnable against the current
API: check status codes (for example `POST /template/upload-and-create` answers `201`), field
shapes and endpoints against the API reference before adding or changing one.
