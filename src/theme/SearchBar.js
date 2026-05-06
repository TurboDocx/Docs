import React, { useEffect, useState } from 'react';
import SearchBar from '@theme-original/SearchBar';

export default function SearchBarWrapper(props) {
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    // Detect platform for keyboard shortcut display
    const isAppleDevice = () => {
      return typeof navigator !== 'undefined' && 
             /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    };
    
    setIsApple(isAppleDevice());
  }, []);

  useEffect(() => {
    // Override DocSearch button key display
    const updateKeyDisplay = () => {
      const kbdElements = document.querySelectorAll('.aa-DetachedSearchButton kbd');
      if (kbdElements.length >= 2) {
        // Handle the case with separate Cmd/Ctrl and K keys
        const firstKey = kbdElements[0];
        if (firstKey && !isApple && firstKey.textContent === '⌘') {
          firstKey.textContent = 'Ctrl';
        } else if (firstKey && isApple && firstKey.textContent === 'Ctrl') {
          firstKey.textContent = '⌘';
        }
      } else {
        // Handle single key element
        kbdElements.forEach(key => {
          if (key && !isApple && (key.textContent === '⌘' || key.textContent.includes('⌘'))) {
            key.textContent = 'Ctrl';
          } else if (key && isApple && (key.textContent === 'Ctrl' || key.textContent.includes('Ctrl'))) {
            key.textContent = '⌘';
          }
        });
      }
    };

    // Run immediately and set up observer for dynamic updates
    updateKeyDisplay();
    
    const observer = new MutationObserver(() => {
      // Small delay to ensure DOM is updated
      setTimeout(updateKeyDisplay, 100);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true
    });

    return () => observer.disconnect();
  }, [isApple]);

  useEffect(() => {
    const hideOramaChatPanel = () => {
      const searchBox = document.querySelector('orama-search-box');
      if (searchBox?.shadowRoot) {
        const existing = searchBox.shadowRoot.querySelector('#hide-chat-panel');
        if (!existing) {
          const style = document.createElement('style');
          style.id = 'hide-chat-panel';
          style.textContent = 'orama-sliding-panel, .slide-container { display: none !important; }';
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