import React, { useState, useEffect } from 'react';
import ApiTabs from "@theme/ApiTabs";
import ResponseSamples from "@theme/ResponseSamples";

const ScriptLoader = ({ scriptPath, id = "scripts", label = "Code Examples" }) => {
  const [scripts, setScripts] = useState({});
  const [loading, setLoading] = useState(true);

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

  return (
    <ApiTabs id={id} label={label}>
      {scriptEntries.map(([lang, code]) => (
        <div key={lang} value={lang} label={getLanguageLabel(lang)}>
          <ResponseSamples
            language={getLanguageForHighlighting(lang)}
            responseExample={code}
          />
        </div>
      ))}
    </ApiTabs>
  );
};

export default ScriptLoader;