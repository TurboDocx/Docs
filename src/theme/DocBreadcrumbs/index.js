import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc, useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import styles from '@docusaurus/theme-classic/lib/theme/DocBreadcrumbs/styles.module.css';

// Unlisted docs (hidden from the sidebar, e.g. the TurboPartner SDK pages) have no sidebar
// breadcrumbs, so the theme renders none. Give them the trail of the section they live in.
const SECTIONS = {
  SDKs: {label: 'SDKs', href: '/docs/SDKs'},
  Integrations: {label: 'Integrations', href: '/docs/category/integrations'},
  TurboSign: {label: 'TurboSign', href: '/docs/category/turbosign'},
  'TurboDocx-Templating': {label: 'TurboDocx Templating', href: '/docs/category/turbodocx-templating'},
  TurboQuote: {label: 'TurboQuote', href: '/docs/category/turboquote'},
  Pipelines: {label: 'Pipelines', href: '/docs/category/pipelines'},
  'Advanced-Configuration': {label: 'Advanced Configuration', href: '/docs/category/advanced-configuration'},
  API: {label: 'API', href: '/docs/API/turbodocx-api-documentation'},
};

function FallbackBreadcrumbs() {
  const {metadata, frontMatter} = useDoc();
  const section = SECTIONS[metadata.id.split('/')[0]];
  const title = frontMatter.sidebar_label || metadata.title;
  return (
    <nav
      className={clsx(ThemeClassNames.docs.docBreadcrumbs, styles.breadcrumbsContainer, 'theme-doc-breadcrumbs--fallback')}
      aria-label="Breadcrumbs">
      <ul className="breadcrumbs">
        <HomeBreadcrumbItem />
        {section && (
          <li className="breadcrumbs__item">
            <Link className="breadcrumbs__link" href={section.href}>
              <span>{section.label}</span>
            </Link>
          </li>
        )}
        <li className="breadcrumbs__item breadcrumbs__item--active">
          <span className="breadcrumbs__link">{title}</span>
        </li>
      </ul>
    </nav>
  );
}

export default function DocBreadcrumbsWrapper(props) {
  const breadcrumbs = useSidebarBreadcrumbs();
  return breadcrumbs ? <DocBreadcrumbs {...props} /> : <FallbackBreadcrumbs />;
}
