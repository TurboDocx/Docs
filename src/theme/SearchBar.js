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
    // Override DocSearch button key display
    // const updateKeyDisplay = () => {
    //     const kbdElements = document.querySelectorAll('.aa-DetachedSearchButton kbd');
    //     if (kbdElements.length >= 2) {
    //         // Handle the case with separate Cmd/Ctrl and K keys
    //         const firstKey = kbdElements[0];
    //         if (firstKey && isApple && firstKey.textContent === '⌘') {
    //             firstKey.textContent = 'Ctrl';
    //         } else if (firstKey && isApple && firstKey.textContent === 'Ctrl') {
    //             firstKey.textContent = '⌘';
    //         }
    //     } else {
    //         // Handle single key element
    //         kbdElements.forEach(key => {
    //             if (key && !isApple && (key.textContent === '⌘' || key.textContent.includes('⌘'))) {
    //                 key.textContent = 'Ctrl';
    //             } else if (key && isApple && (key.textContent === 'Ctrl' || key.textContent.includes('Ctrl'))) {
    //                 key.textContent = '⌘';
    //             }
    //         });
    //     }
    // };

    // Run immediately and set up observer for dynamic updates
    // updateKeyDisplay();

    // const observer = new MutationObserver(() => {
    //     // Small delay to ensure DOM is updated
    //     setTimeout(updateKeyDisplay, 100);
    // });

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // });

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

    // run on load
    updateKeyDisplay();

    // re‑run whenever DocSearch injects new bits
    const observer = new MutationObserver(() => setTimeout(updateKeyDisplay, 50));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isApple]);

  useEffect(() => {
    async function init() {
      try {
        // const res = await fetch("../../.docusaurus/orama-search-index-current.json.gz");
        // if (!res.ok) throw new Error(`Failed to fetch Orama index: ${res.status}`);

        // const buffer = await res.arrayBuffer();
        // const jsonStr = ungzip(buffer, { to: "string" });
        // const parsedData = JSON.parse(jsonStr);
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