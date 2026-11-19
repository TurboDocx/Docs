import React from 'react';
import Head from '@docusaurus/Head';
import DocCategoryGeneratedIndexPage from '@theme-original/DocCategoryGeneratedIndexPage';

// Category pages only list the docs in a section, so every breadcrumb has a page to link to. They
// have no content of their own: keep them out of search indexes (and so they need no markdown twin).
export default function DocCategoryGeneratedIndexPageWrapper(props) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DocCategoryGeneratedIndexPage {...props} />
    </>
  );
}
