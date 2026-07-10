import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme-original/DocSidebar';
import { BackgroundGradientAnimation } from "@site/src/components/background-gradient-animation";

// When you land on a doc (e.g. from a search result or a direct link), Docusaurus
// highlights + expands the active sidebar item but does NOT scroll the sidebar to
// it, so it can sit off-screen while the sidebar stays parked at the top. This
// centers the active link inside the sidebar's OWN scroll container (not the page)
// on every navigation.
function getActiveLeafSidebarLink() {
  if (typeof document === 'undefined') return null;
  const activeLinks = document.querySelectorAll('.menu__link--active');
  if (!activeLinks.length) return null;

  // Ancestor category links (e.g. "SDKs", "TurboSign SDKs") are ALSO marked
  // active and appear BEFORE the leaf in DOM order, so a plain querySelector
  // grabs the top-level parent. Pick the link whose href is the current page —
  // the actual leaf ("TurboSign: Ruby") — and fall back to the deepest one.
  const path = window.location.pathname.replace(/\/+$/, '');
  let leaf = null;
  activeLinks.forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/+$/, '');
    if (href === path) leaf = a;
  });
  return leaf || activeLinks[activeLinks.length - 1];
}

function scrollActiveSidebarItemIntoView() {
  const activeLink = getActiveLeafSidebarLink();
  if (!activeLink) return;

  // Walk up to the sidebar's OWN scroll container, but stay WITHIN the sidebar.
  // If we let the search escape, it lands on the page scroller (html counts as
  // one because overflow-x is hidden), and "centering" then scrolls the whole
  // page. Bail if nothing inside the sidebar scrolls (short sidebar → nothing to do).
  const boundary = activeLink.closest('.theme-doc-sidebar-container');
  if (!boundary) return;
  let scroller = activeLink.parentElement;
  while (scroller) {
    const { overflowY } = getComputedStyle(scroller);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      scroller.scrollHeight > scroller.clientHeight
    ) {
      break;
    }
    if (scroller === boundary) {
      scroller = null;
      break;
    }
    scroller = scroller.parentElement;
  }
  if (!scroller) return;

  const linkRect = activeLink.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();

  // Skip if the active link is already fully visible in the sidebar.
  if (linkRect.top >= scrollerRect.top && linkRect.bottom <= scrollerRect.bottom) {
    return;
  }

  // Center the active link within the scroll container.
  const delta =
    linkRect.top - scrollerRect.top - scroller.clientHeight / 2 + linkRect.height / 2;
  scroller.scrollTop += delta;
}

export default function DocSidebarWrapper(props) {
  const { pathname } = useLocation();

  useEffect(() => {
    // First pass once the active category has rendered/expanded; second pass
    // after the collapse animation settles so the centered position is correct.
    const timers = [
      setTimeout(scrollActiveSidebarItemIntoView, 120),
      setTimeout(scrollActiveSidebarItemIntoView, 450),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  return (
    <>
      <DocSidebar {...props} />
    </>
  );
}
