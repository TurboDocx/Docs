import React, { useEffect, useState } from 'react';
import SearchBar from '@theme-original/SearchBar';
import { create, insertMultiple } from "@orama/orama";
import useBaseUrl from '@docusaurus/useBaseUrl';


const DOCS_PRESET_SCHEMA = {
  title: "string",
  content: "string",
  category: "string",
  url: "string",
};

export default function SearchBarWrapper(props) {
  const [isApple, setIsApple] = useState(false);
  const [client, setClient] = useState(null);
  const baseUrl = useBaseUrl('/');

  useEffect(() => {
    // Detect platform for keyboard shortcut display
    const isAppleDevice = () => {
      return typeof navigator !== 'undefined' &&
        /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    };

    setIsApple(isAppleDevice());
  }, []);

  useEffect(() => {
    const updateKeyDisplay = () => {
      // 1) Grab the two <kbd> elements under the DocSearch button
      const kbdElements = document.querySelectorAll('button.DocSearch-Button kbd');
      if (!kbdElements.length) return;  // nothing to do yet

      kbdElements.forEach(key => {
        const txt = key.textContent || '';
        if (isApple) {
          // Mac: turn “Ctrl” → “⌘”
          if (txt.includes('Ctrl')) key.textContent = txt.replace(/Ctrl/g, '⌘');
        } else {
          // Windows/Linux: turn “⌘” → “Ctrl”
          if (txt.includes('⌘')) key.textContent = txt.replace(/⌘/g, 'Ctrl');
        }
      });
    };

    // run on load
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
    async function init() {
      try {
        const indexUrl = `${baseUrl}orama-index.json`;
        const response = await fetch(indexUrl);
        console.log(response)
        const parsedData = await response.json();
        const documents = Object.values(parsedData.docs.docs);

        // Create Orama DB and insert docs
        const db = create({ schema: DOCS_PRESET_SCHEMA });
        await insertMultiple(db, documents);

        const clientInstance = {
          search: async ({ term }) => {
            const { hits } = await db.search({ term });
            return {
              results: hits.map((hit) => ({
                title: hit.document.title,
                description: hit.document.content.slice(0, 100),
                url: hit.document.url,
              })),
            };
          },
        };

        setClient(clientInstance);
      } catch (error) {
        console.error("Error initializing Orama search:", error);
      }
    }

    init();
  }, [baseUrl]);


  props = {
    ...props,
    clientInstance: { client },
  }

  if (!client) return null;
  return (
    <div className="centerSearchBar">
      <div className="searchBarInner">
        <SearchBar {...props} />
      </div>
    </div>
  );
}