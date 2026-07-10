import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';

// Fix: clicking an Orama search result that targets a section anchor
// (e.g. /docs/SDKs/quote-go#bulk-imports) updates the URL correctly, but the
// page opens scrolled to the TOP instead of the section — on the freshly loaded
// page the target heading isn't in the DOM yet when the hash scroll is attempted
// after navigation, so it's silently missed.
//
// Design (deliberate, to avoid the "lands right then jumps" glitch):
//   * We NEVER blindly re-scroll on a timer. We only scroll when the heading is
//     actually away from where a correctly-anchored heading should sit. So once
//     it has landed correctly — whether we put it there or Docusaurus did — we
//     leave it completely alone (no yank).
//   * The one reason we scroll again is a genuine late layout shift: images/code
//     blocks above the target finish rendering and push it out of place. Then we
//     nudge it back, which KEEPS the heading in view rather than moving it away.
//   * We stop the moment the position is stable for a few frames, and abort
//     instantly if the user scrolls — so we never fight a manual scroll.
//
// "Correct position" = the heading's top sitting at the sticky-navbar offset that
// Docusaurus already uses (scroll-padding-top on <html>), which scrollIntoView()
// honors — the same place the right-hand TOC links land.
function scrollToHashTarget(hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return () => {};

  let cancelled = false;
  const timers = [];
  const stop = () => {
    if (cancelled) return;
    cancelled = true;
    timers.forEach(clearTimeout);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchmove', stop);
  };
  // A real user scroll aborts us. scrollIntoView() does NOT emit wheel/touchmove,
  // so our own corrections never cancel themselves.
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchmove', stop, { passive: true });

  const desiredOffset = () => {
    const cs = getComputedStyle(document.documentElement);
    let n = parseFloat(cs.scrollPaddingTop);
    if (!Number.isFinite(n)) n = parseFloat(cs.getPropertyValue('--ifm-navbar-height'));
    return Number.isFinite(n) ? n : 0;
  };

  const TOL = 16;        // px — within this of the offset counts as "already correct"
  const NEED_STABLE = 3; // consecutive in-place checks before we stop watching
  const MAX_TICKS = 45;  // ~3.5s hard cap
  let ticks = 0;
  let stable = 0;

  const tick = () => {
    if (cancelled) return;
    ticks++;
    const el = document.getElementById(id);
    if (!el) {
      if (ticks < MAX_TICKS) timers.push(setTimeout(tick, 75));
      return;
    }
    const delta = el.getBoundingClientRect().top - desiredOffset();
    if (Math.abs(delta) > TOL) {
      // Off position: page never scrolled to the section, or a layout shift moved
      // it. Re-align (honors the navbar offset). Reset the stability counter.
      el.scrollIntoView();
      stable = 0;
    } else {
      // Already sitting correctly — leave it. Just confirm it stays put.
      stable++;
    }
    if (stable < NEED_STABLE && ticks < MAX_TICKS) {
      timers.push(setTimeout(tick, 80));
    }
  };

  timers.push(setTimeout(tick, 0));
  return stop;
}

export default function Root({ children }) {
  const { pathname, hash } = useLocation();
  // null on the very first render so a fresh load that lands on a hash is treated
  // as "arrived at a new page" and gets the scroll too.
  const prevPathname = useRef(null);

  useEffect(() => {
    const isFirstRender = prevPathname.current === null;
    const changedPage = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (!hash) return;
    // Only act when we've actually landed on a page. A hash-only change on the
    // same page (a TOC click) is Docusaurus's job — don't fight its smooth scroll.
    if (!isFirstRender && !changedPage) return;

    return scrollToHashTarget(hash);
  }, [pathname, hash]);

  return <>{children}</>;
}
