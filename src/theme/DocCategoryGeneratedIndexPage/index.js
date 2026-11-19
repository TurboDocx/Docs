import React from 'react';
import Head from '@docusaurus/Head';
import {PageMetadata} from '@docusaurus/theme-common';
import {useCurrentSidebarCategory} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import TracingBeam from '@site/src/components/tracing-beam';
import styles from '@docusaurus/theme-classic/lib/theme/DocCategoryGeneratedIndexPage/styles.module.css';

// Category pages (generated index) are the theme's page with two changes:
// - noindex: they only list the docs in a section, so every breadcrumb has a page to link to; they have
//   no content of their own (and so need no markdown twin);
// - the tracing beam around the content, as on every doc page (breadcrumbs and Previous / Next stay
//   outside it, so the beam's dot sits under the first crumb's first letter).
export default function DocCategoryGeneratedIndexPage({categoryGeneratedIndex}) {
  const category = useCurrentSidebarCategory();
  return (
    <>
      <PageMetadata
        title={categoryGeneratedIndex.title}
        description={categoryGeneratedIndex.description}
        keywords={categoryGeneratedIndex.keywords}
        image={useBaseUrl(categoryGeneratedIndex.image)}
      />
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className={styles.generatedIndexPage}>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <TracingBeam className="docs-tracing-beam">
          <div className="docs-beam-content">
            <header>
              <Heading as="h1" className={styles.title}>
                {categoryGeneratedIndex.title}
              </Heading>
              {categoryGeneratedIndex.description && <p>{categoryGeneratedIndex.description}</p>}
            </header>
            <article className="margin-top--lg">
              <DocCardList items={category.items} className={styles.list} />
            </article>
          </div>
        </TracingBeam>
        {/* Outside the beam, as on doc pages: src/css/custom.scss lines it up with the content and keeps
            it at the bottom of the page. */}
        <footer className="margin-top--md">
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </>
  );
}
