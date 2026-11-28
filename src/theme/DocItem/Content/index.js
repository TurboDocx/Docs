import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';

// The theme's DocItem/Content, with one change: a title generated from front matter (pages whose
// markdown has no "# Title") is rendered inside MDXContent instead of before it. MDXContent wraps the
// page in the tracing beam, so the title now sits with the content, past the beam, and the beam's dot
// is at the top of the page, as on pages that write their own "# Title".
function useSyntheticTitle() {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  return shouldRender ? metadata.title : null;
}

export default function DocItemContent({children}) {
  const syntheticTitle = useSyntheticTitle();
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      <MDXContent>
        {syntheticTitle && (
          <header>
            <Heading as="h1">{syntheticTitle}</Heading>
          </header>
        )}
        {children}
      </MDXContent>
    </div>
  );
}
