import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {ThemeClassNames} from '@docusaurus/theme-common';

// Doc cards (category pages): an icon chip for the kind of item (page, section, external link) in
// place of the theme's emoji, the title, a two-line description and an arrow. Styles:
// src/css/doc-cards.scss.
function Icon({kind}) {
  const paths = {
    page: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
    section: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    external: 'M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4',
  };
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[kind]} />
    </svg>
  );
}

export default function DocCardLayout({item, className, href, title, description}) {
  const kind = item.type === 'category' ? 'section' : isInternalUrl(href) ? 'page' : 'external';
  return (
    <Link
      href={href}
      className={clsx('card', ThemeClassNames.docs.docCard.container, 'doc-card', className)}>
      <span className="doc-card__icon">
        <Icon kind={kind} />
      </span>
      <span className="doc-card__body">
        <h2 className="doc-card__title">{title}</h2>
        {description && <p className="doc-card__description">{description}</p>}
      </span>
      <span className="doc-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
