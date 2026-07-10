import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import TOC from '@theme-original/TOC';

// Docusaurus highlights the section you're currently reading in the right-hand
// "On this page" ToC — its scroll-spy toggles `.table-of-contents__link--active`
// as you scroll — but it never scrolls the ToC itself. So on long pages (e.g. an
// SDK reference with a big Method Reference list) the highlighted section drifts
// out of the ToC's own scroll box and you lose your place.
//
// This centers the active ToC link inside that scroll box whenever it changes,
// mirroring what DocSidebar does for the left nav. It moves ONLY the ToC panel
// (via scrollTop on the ToC's scroll container), never the page. Short pages,
// where the ToC fits without scrolling, are left untouched.

// The ToC's OWN scroll container — never the page. On pages whose ToC is short
// enough to fit, the ToC isn't scrollable; if we let the search escape the ToC it
// lands on the page scroller (html counts as one because overflow-x is hidden),
// and "centering the active link" then scrolls the whole PAGE — which drove
// short-ToC pages (e.g. Install with AI Agents) to the bottom and locked them.
// So bound the walk to the desktop ToC region and bail if nothing there scrolls.
function findScroller(link) {
  const boundary = link.closest('.theme-doc-toc-desktop');
  if (!boundary) return null;
  let node = link.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    if (node === boundary) break;
    node = node.parentElement;
  }
  return null;
}

function centerActiveTocLink() {
  if (typeof document === 'undefined') return;
  // Prefer the desktop ToC; there can also be a mobile collapsible one.
  const root =
    document.querySelector('.theme-doc-toc-desktop .table-of-contents') ||
    document.querySelector('.table-of-contents');
  if (!root) return;

  // Docusaurus marks a single link active; take the last as the current section.
  const activeLinks = root.querySelectorAll('.table-of-contents__link--active');
  const link = activeLinks[activeLinks.length - 1];
  if (!link) return;

  const scroller = findScroller(link);
  if (!scroller) return; // ToC fits — nothing to scroll.

  const linkRect = link.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();

  // Already fully visible inside the ToC's scroll box — leave it alone.
  if (linkRect.top >= scrollerRect.top && linkRect.bottom <= scrollerRect.bottom) {
    return;
  }

  // Center the active link within the scroll container (moves only the ToC).
  const delta =
    linkRect.top - scrollerRect.top - scroller.clientHeight / 2 + linkRect.height / 2;
  scroller.scrollTop += delta;
}

export default function TOCWrapper(props) {
  // Re-attach per page: the ToC DOM (and its active-link node) is rebuilt on
  // navigation, so a stale observer would point at a replaced element.
  const { pathname } = useLocation();

  useEffect(() => {
    let observer = null;
    let rafId = null;
    let tries = 0;

    // Coalesce bursts of class mutations (active toggles off one link and on the
    // next) into a single re-center on the next frame.
    const schedule = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        centerActiveTocLink();
      });
    };

    const attach = () => {
      const root =
        document.querySelector('.theme-doc-toc-desktop .table-of-contents') ||
        document.querySelector('.table-of-contents');
      if (!root) {
        if (tries++ < 20) setTimeout(attach, 100); // wait for the ToC to render
        return;
      }
      // React to the scroll-spy's class changes rather than polling or adding our
      // own scroll listener.
      observer = new MutationObserver(schedule);
      observer.observe(root, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true,
      });
      schedule(); // position correctly on first mount too
    };

    attach();

    return () => {
      if (observer) observer.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return <TOC {...props} />;
}
