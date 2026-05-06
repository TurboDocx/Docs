import React, { useEffect } from 'react';
import SearchBar from '@theme-original/SearchBar';

export default function SearchBarWrapper(props) {
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
          style.textContent = `
            orama-sliding-panel, .slide-container { display: none !important; }
            .logo-link img { display: none !important; }
            .logo-link { display: inline-flex !important; align-items: center !important; gap: 4px !important; font-size: 12px !important; color: #838289 !important; text-decoration: none !important; }
            .logo-link::after { content: "Orama" !important; font-weight: 600 !important; color: #151515 !important; }
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

  return (
    <div className="centerSearchBar">
      <div className="searchBarInner">
        <SearchBar {...props} />
      </div>
    </div>
  );
}