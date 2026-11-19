import React, {useEffect, useRef, useState} from 'react';
import Heading from '@theme/Heading';

// Title row for API reference pages: title, "Copy page" and the method badge.
// Copy page copies the page's markdown twin (/<route>.md); if that fetch fails it copies the rendered text.
async function pageMarkdown() {
  const route = window.location.pathname.replace(/\/$/, '');
  try {
    const res = await fetch(`${route}.md`);
    if (res.ok && (res.headers.get('content-type') || '').includes('markdown')) return await res.text();
  } catch {
    // fall through to the rendered text
  }
  return document.querySelector('article')?.innerText ?? '';
}

// Safari only allows a clipboard write inside the click itself, so hand it a pending ClipboardItem
// (resolved after the fetch) instead of awaiting the fetch first. Other browsers take the same path;
// writeText is the fallback where ClipboardItem is unavailable.
function copyPageMarkdown() {
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    const blob = pageMarkdown().then((text) => new Blob([text], {type: 'text/plain'}));
    return navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
  }
  return pageMarkdown().then((text) => navigator.clipboard.writeText(text));
}

export default function ApiTitle({title, method}) {
  const [state, setState] = useState('idle');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await copyPageMarkdown();
      setState('copied');
    } catch {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  }

  const label = state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy page';
  return (
    <div className="api-title">
      <Heading as="h1" className="openapi__heading">
        {title}
      </Heading>
      <button type="button" className="api-copy-page" onClick={copy} aria-live="polite">
        {label}
      </button>
      <span className={`api-method-badge api-method-badge--${method}`}>{method === 'delete' ? 'del' : method}</span>
    </div>
  );
}
