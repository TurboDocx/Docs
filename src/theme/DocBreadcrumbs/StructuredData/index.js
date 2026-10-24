import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { applyTrailingSlash } from '@docusaurus/utils-common';
import OriginalStructuredData from '@theme-original/DocBreadcrumbs/StructuredData';

// Category index pages (docs/**/index.md) carry a raw permalink with a trailing
// slash, e.g. /docs/SDKs/. The visible breadcrumb <Link> normalizes it to match
// `trailingSlash: false`, but the BreadcrumbList JSON-LD uses the raw href, so it
// pointed search engines at URLs that 308-redirect. Normalize the hrefs the same
// way <Link> does before the original component builds the structured data.
export default function DocBreadcrumbsStructuredData(props) {
  const { siteConfig } = useDocusaurusContext();
  const breadcrumbs = props.breadcrumbs.map((item) =>
    item.href
      ? {
          ...item,
          href: applyTrailingSlash(item.href, {
            trailingSlash: siteConfig.trailingSlash,
            baseUrl: siteConfig.baseUrl,
          }),
        }
      : item
  );
  return <OriginalStructuredData {...props} breadcrumbs={breadcrumbs} />;
}
