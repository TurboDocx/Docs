import React, { useState, useEffect } from 'react';
import ResponseSamples from "@theme/ResponseSamples";

const ScriptLoader = ({ scriptPath, id = "scripts", label = "Code Examples" }) => {
  const [scripts, setScripts] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const languages = ['nodejs', 'python', 'php', 'csharp', 'java', 'go', 'ruby', 'powershell'];
        const loadedScripts = {};

        for (const lang of languages) {
          try {
            const response = await fetch(`/scripts/${scriptPath}/${lang}.${getFileExtension(lang)}`);
            if (response.ok) {
              loadedScripts[lang] = await response.text();
            }
          } catch (error) {
            console.error(`Failed to load ${lang} script:`, error);
          }
        }

        setScripts(loadedScripts);
        // Set the first available language as the active tab
        const firstLang = Object.keys(loadedScripts)[0];
        if (firstLang) {
          setActiveTab(firstLang);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load scripts:', error);
        setLoading(false);
      }
    };

    loadScripts();
  }, [scriptPath]);

  const getFileExtension = (lang) => {
    const extensions = {
      nodejs: 'js',
      python: 'py',
      php: 'php',
      csharp: 'cs',
      java: 'java',
      go: 'go',
      ruby: 'rb',
      powershell: 'ps1'
    };
    return extensions[lang] || 'txt';
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      nodejs: 'Node.js',
      python: 'Python',
      php: 'PHP',
      csharp: 'C#',
      java: 'Java',
      go: 'Go',
      ruby: 'Ruby',
      powershell: 'PowerShell'
    };
    return labels[lang] || lang;
  };

  const getLanguageForHighlighting = (lang) => {
    const mappings = {
      nodejs: 'javascript',
      python: 'python',
      php: 'php',
      csharp: 'csharp',
      java: 'java',
      go: 'go',
      ruby: 'ruby',
      powershell: 'powershell'
    };
    return mappings[lang] || lang;
  };

  if (loading) {
    return <div>Loading code examples...</div>;
  }

  const scriptEntries = Object.entries(scripts);
  if (scriptEntries.length === 0) {
    return <div>No code examples available.</div>;
  }

  if (!activeTab) {
    return <div>Loading code examples...</div>;
  }

  return (
    <div className="tabs-container openapi-tabs__code-container">
      <ul role="tablist" aria-orientation="horizontal" className="tabs openapi-tabs__code-list-container">
        {scriptEntries.map(([lang, code]) => (
          <li 
            key={lang}
            role="tab" 
            tabIndex={lang === activeTab ? 0 : -1}
            aria-selected={lang === activeTab}
            className={`tabs__item openapi-tabs__code-item openapi-tabs__code-item--${lang} ${lang === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(lang)}
          >
            <span>{getLanguageLabel(lang)}</span>
          </li>
        ))}
      </ul>
      <div role="tabpanel" className="margin-top--md">
        <div className={`openapi-explorer__code-block-container openapi-explorer__code-block language-${getLanguageForHighlighting(activeTab)} theme-code-block`}>
          <div className="openapi-explorer__code-block-content">
            <ResponseSamples
              language={getLanguageForHighlighting(activeTab)}
              responseExample={scripts[activeTab]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptLoader;