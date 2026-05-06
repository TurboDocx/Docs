import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Parser from '@site/src/components/Parser';
import CodeSnippets from '@site/src/components/CodeSnippets';
import InfoBox from '@site/src/components/InfoBox';
import ScriptLoader from '@site/src/components/ScriptLoader';
import JsonToTable from '@site/src/components/JsonToTable';
import BodyTable from '@site/src/components/BodyTable';
import QueryTable from '@site/src/components/QueryTable';
import HeadersTable from '@site/src/components/HeadersTable';
import DisplayJson from '@site/src/components/DisplayJson';
import DisplayEndpoint from '@site/src/components/DisplayEndpoint';

export default {
  ...MDXComponents,
  CodeSnippets,
  InfoBox,
  Parser,
  ScriptLoader,
  JsonToTable,
  BodyTable,
  QueryTable,
  HeadersTable,
  DisplayJson,
  DisplayEndpoint,
};