import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Parser from '@site/src/components/Parser';
import CodeSnippets from '@site/src/components/CodeSnippets';
import InfoBox from '@site/src/components/InfoBox';
import ScriptLoader from '@site/src/components/ScriptLoader';

export default {
  ...MDXComponents,
  CodeSnippets,
  InfoBox,
  Parser,
  ScriptLoader,
};