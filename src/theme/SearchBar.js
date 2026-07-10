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
    const patchResultMap = () => {
      const searchBox = document.querySelector('orama-search-box');
      if (searchBox?.searchStore?.state && !searchBox.searchStore.state.resultMap?.description) {
        searchBox.searchStore.state.resultMap = {
          description: 'section',
          section: 'category',
        };
      }
    };

    patchResultMap();
    const mapObserver = new MutationObserver(patchResultMap);
    mapObserver.observe(document.body, { childList: true, subtree: true });
    return () => mapObserver.disconnect();
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