import React, {useEffect} from 'react';
import ApiItemLayout from '@theme-original/ApiItem/Layout';
import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DocArticleJsonLd() {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: metadata.title,
    description: metadata.description || '',
    url: `${siteConfig.url}${metadata.permalink}`,
    publisher: {
      '@type': 'Organization',
      name: 'TurboDocx',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/img/TurboDocxLogo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${metadata.permalink}`,
    },
    ...(metadata.lastUpdatedAt && {
      dateModified: new Date(metadata.lastUpdatedAt * 1000).toISOString(),
    }),
    ...(frontMatter.keywords && {
      keywords: Array.isArray(frontMatter.keywords)
        ? frontMatter.keywords.join(', ')
        : frontMatter.keywords,
    }),
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Head>
  );
}

// The right column (code sample, credentials, Try it) is sticky. When it is taller than the screen,
// a fixed top would hide its bottom (the Send button) until the page ends. Set a negative top
// instead, so it scrolls with the page until its bottom is in view, then sticks there.
function useTallStickyColumn() {
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    let col;
    let ro;
    const navbar = () => document.querySelector('.navbar')?.offsetHeight ?? 60;
    const update = () => {
      const top = navbar() + 16;
      const fits = col.scrollHeight + top + 16 <= window.innerHeight;
      col.style.top = fits ? `${top}px` : `${window.innerHeight - col.scrollHeight - 16}px`;
    };
    // The explorer renders client-side after this effect, so wait for the column to appear.
    let tries = 0;
    const timer = setInterval(() => {
      col = document.querySelector('.openapi-right-panel__container');
      if (!col && ++tries < 50) return;
      clearInterval(timer);
      if (!col) return;
      ro = new ResizeObserver(update);
      ro.observe(col);
      window.addEventListener('resize', update);
      update();
    }, 200);
    return () => {
      clearInterval(timer);
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);
}

export default function ApiItemLayoutWrapper(props) {
  useTallStickyColumn();
  return (
    <>
      <DocArticleJsonLd />
      <ApiItemLayout {...props} />
    </>
  );
}
