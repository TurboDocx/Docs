import React, { useEffect } from 'react';
import SearchBar from '@theme-original/SearchBar';
import { useColorMode } from '@docusaurus/theme-common';

export default function SearchBarWrapper(props) {
  const { colorMode } = useColorMode();

  useEffect(() => {
    const scheme = colorMode === 'dark' ? 'dark' : 'light';
    const syncTheme = () => {
      document.querySelectorAll('orama-search-box, orama-search-button').forEach(el => {
        if (el.colorScheme !== scheme) el.colorScheme = scheme;
      });
    };
    syncTheme();
    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.body, { childList: true, subtree: true });
    return () => themeObserver.disconnect();
  }, [colorMode]);

  useEffect(() => {
    // How Orama labels each result: show the page/section as the subtitle
    // ("TurboQuote PHP SDK") and group under a category header ("Default").
    // Without this the list renders "plain" — just the bold title, no subtitle.
    const RESULT_MAP = { description: 'section', section: 'category' };

    // Set it whenever it isn't already ours. Orama's store can reset back to the
    // default map when the modal reopens or you switch the facet tab, so we don't
    // guard on "already has a description" (that let a reset stick as plain).
    const applyResultMap = () => {
      const state = document.querySelector('orama-search-box')?.searchStore?.state;
      if (!state) return false;
      if (
        state.resultMap?.description !== RESULT_MAP.description ||
        state.resultMap?.section !== RESULT_MAP.section
      ) {
        state.resultMap = { ...RESULT_MAP };
      }
      return true;
    };

    // Re-assert on the user's keystroke in the CAPTURE phase — this runs BEFORE
    // Orama's debounced search + render, so the very first results already carry
    // the rich mapping instead of showing plain for a render (the flaky part).
    const onInputCapture = (e) => {
      const path = e.composedPath ? e.composedPath() : [];
      if (path.some((el) => el?.tagName === 'ORAMA-SEARCH-BOX')) applyResultMap();
    };
    document.addEventListener('input', onInputCapture, true);

    // Also re-apply on DOM changes (modal mount, result re-renders, resets).
    const observer = new MutationObserver(applyResultMap);
    observer.observe(document.body, { childList: true, subtree: true });

    // The store often initializes a beat after the box mounts; briefly poll so
    // the mapping is in place before the first (no-keystroke) results render.
    let polls = 0;
    const poll = setInterval(() => {
      if (applyResultMap() || polls++ > 40) clearInterval(poll);
    }, 50);

    return () => {
      document.removeEventListener('input', onInputCapture, true);
      observer.disconnect();
      clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    const hideOramaChatPanel = () => {
      const searchBox = document.querySelector('orama-search-box');
      if (searchBox?.shadowRoot) {
        const existing = searchBox.shadowRoot.querySelector('#hide-chat-panel');
        if (!existing) {
          const style = document.createElement('style');
          style.id = 'hide-chat-panel';
          // Hide the AI chat sliding panel and the whole "Powered by" cluster
          // (the .powered-by element holds the "Powered by" text + Orama logo).
          // The keyboard-hint footer is a separate element and stays visible.
          style.textContent = `
            orama-sliding-panel, .slide-container { display: none !important; }
            .powered-by, .logo-link { display: none !important; }
          `;
          searchBox.shadowRoot.appendChild(style);
        }
      }
    };

    hideOramaChatPanel();
    const observer = new MutationObserver(hideOramaChatPanel);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // The ✕ / reset button clears the input text but leaves the search store's
  // results populated, so the suggestion list stays visible. Clear the results
  // right after Orama's own reset handler runs.
  useEffect(() => {
    const onShadowClick = e => {
      const hitReset = e
        .composedPath()
        .some(el => el?.classList?.contains('reset-button'));
      if (!hitReset) return;
      // Orama's reset only blanks the input value; the results + search term
      // stay, so the suggestion list (or a stale "No results for X") lingers.
      // Re-dispatch an empty input event so Orama runs its own onInput('')
      // path and resets term + results back to the pristine state.
      setTimeout(() => {
        const sb = document.querySelector('orama-search-box');
        const input = sb?.shadowRoot?.querySelector('input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
      }, 0);
    };

    const attachResetHandler = () => {
      const searchBox = document.querySelector('orama-search-box');
      const root = searchBox?.shadowRoot;
      if (root && !root.__resetHandlerAttached) {
        root.__resetHandlerAttached = true;
        root.addEventListener('click', onShadowClick);
      }
    };

    attachResetHandler();
    const observer = new MutationObserver(attachResetHandler);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="centerSearchBar">
      <div className="searchBarInner">
        <SearchBar {...props} />
      </div>
    </div>
  );
}