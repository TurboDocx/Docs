// A link to a nested API field (#body-recipients.metadata.color, see src/theme/SchemaItem) lands
// inside collapsed schema sections. Open each closed parent, outermost first, then scroll to it.
// Clicking the summary goes through the theme's Details state, so the section stays toggleable.

const ANCHOR = /^#(body|param)-/;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, timeoutMs) {
  for (const end = Date.now() + timeoutMs; Date.now() < end; await sleep(100)) {
    const value = check();
    if (value) return value;
  }
  return null;
}

function closedParents(el) {
  const parents = [];
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (node.tagName === 'DETAILS' && node.dataset.collapsed === 'true') parents.unshift(node);
  }
  return parents;
}

// The open animation moves the page; wait until the field stops moving.
async function settle(el) {
  let last = null;
  for (let steady = 0, i = 0; steady < 3 && i < 30; i += 1) {
    await sleep(100);
    const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
    steady = top === last && el.getBoundingClientRect().height > 0 ? steady + 1 : 0;
    last = top;
  }
}

async function revealHashTarget() {
  const {hash} = window.location;
  if (!ANCHOR.test(hash)) return;
  // The request schema renders after the route, so the field may not exist yet.
  const el = await waitFor(() => document.getElementById(decodeURIComponent(hash.slice(1))), 5000);
  if (!el) return;
  const parents = closedParents(el);
  if (parents.length === 0) return;
  parents.forEach((details) => details.querySelector(':scope > summary')?.click());
  await settle(el);
  el.scrollIntoView({block: 'start'});
}

export function onRouteDidUpdate() {
  revealHashTarget();
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', revealHashTarget);
}
