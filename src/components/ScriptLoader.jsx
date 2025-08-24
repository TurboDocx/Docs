import React, { useState, useEffect } from 'react';
import ResponseSamples from "@theme/ResponseSamples";

const ScriptLoader = ({ scriptPath, id = "scripts", label = "Code Examples" }) => {
  const [scripts, setScripts] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState({});

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const languageConfigs = {
          nodejs: ['express', 'fastify'],
          python: ['fastapi', 'flask'],
          csharp: ['controller', 'minimal'],
          php: [],
          java: [],
          go: [],
          ruby: [],
          powershell: []
        };
        
        const loadedScripts = {};
        const initialSubTabs = {};

        for (const [lang, variants] of Object.entries(languageConfigs)) {
          loadedScripts[lang] = {};
          
          if (variants.length > 0) {
            // Load variant-specific scripts
            for (const variant of variants) {
              try {
                const response = await fetch(`/scripts/${scriptPath}/${lang}/${variant}.${getFileExtension(lang)}`);
                if (response.ok) {
                  loadedScripts[lang][variant] = await response.text();
                }
              } catch (error) {
                console.error(`Failed to load ${lang}/${variant} script:`, error);
              }
            }
            
            // Set first variant as active subtab for this language
            const firstVariant = Object.keys(loadedScripts[lang])[0];
            if (firstVariant) {
              initialSubTabs[lang] = firstVariant;
            }
          } else {
            // Load single script for languages without variants
            try {
              const response = await fetch(`/scripts/${scriptPath}/${lang}.${getFileExtension(lang)}`);
              if (response.ok) {
                loadedScripts[lang]['default'] = await response.text();
                initialSubTabs[lang] = 'default';
              }
            } catch (error) {
              console.error(`Failed to load ${lang} script:`, error);
            }
          }
        }

        setScripts(loadedScripts);
        setActiveSubTab(initialSubTabs);
        
        // Set the first available language as the active tab
        const firstLang = Object.keys(loadedScripts).find(lang => Object.keys(loadedScripts[lang]).length > 0);
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

  const getSubTabLabel = (lang, variant) => {
    const labels = {
      nodejs: {
        express: 'Express',
        fastify: 'Fastify'
      },
      python: {
        fastapi: 'FastAPI',
        flask: 'Flask'
      },
      csharp: {
        controller: 'Controller',
        minimal: 'Minimal API'
      }
    };
    return labels[lang]?.[variant] || variant.toUpperCase();
  };

  const hasSubTabs = (lang) => {
    const variants = scripts[lang] || {};
    return Object.keys(variants).length > 1 || (Object.keys(variants).length === 1 && !variants['default']);
  };

  const handleSubTabChange = (lang, variant) => {
    setActiveSubTab(prev => ({
      ...prev,
      [lang]: variant
    }));
  };

  if (loading) {
    return <div>Loading code examples...</div>;
  }

  const scriptEntries = Object.entries(scripts).filter(([lang, variants]) => Object.keys(variants).length > 0);
  if (scriptEntries.length === 0) {
    return <div>No code examples available.</div>;
  }

  if (!activeTab) {
    return <div>Loading code examples...</div>;
  }

  const currentVariants = scripts[activeTab] || {};
  const currentVariantEntries = Object.entries(currentVariants);
  const currentSubTab = activeSubTab[activeTab];
  const currentCode = currentVariants[currentSubTab] || '';

  return (
    <div className="tabs-container openapi-tabs__code-container">
      <ul role="tablist" aria-orientation="horizontal" className="tabs openapi-tabs__code-list-container">
        {scriptEntries.map(([lang, variants]) => (
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
        {hasSubTabs(activeTab) && currentVariantEntries.length > 1 && (
          <div className="tabs-container openapi-tabs__code-container openapi-tabs__code-container-inner">
            <ul role="tablist" aria-orientation="horizontal" className="tabs openapi-tabs__code-list-container openapi-tabs__code-container-inner">
              {currentVariantEntries.map(([variant, code]) => (
                <li 
                  key={variant}
                  role="tab" 
                  tabIndex={variant === currentSubTab ? 0 : -1}
                  aria-selected={variant === currentSubTab}
                  className={`tabs__item openapi-tabs__code-item openapi-tabs__code-item--variant ${variant === currentSubTab ? 'active' : ''}`}
                  onClick={() => handleSubTabChange(activeTab, variant)}
                >
                  <span>{getSubTabLabel(activeTab, variant)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div role="tabpanel" className="margin-top--md">
          <div className={`openapi-explorer__code-block-container openapi-explorer__code-block language-${getLanguageForHighlighting(activeTab)} theme-code-block`}>
            <div className="openapi-explorer__code-block-content">
              <ResponseSamples
                language={getLanguageForHighlighting(activeTab)}
                responseExample={currentCode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptLoader;