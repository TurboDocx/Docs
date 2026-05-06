import React from 'react';
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

export default function ApiItemLayoutWrapper(props) {
  return (
    <>
      <DocArticleJsonLd />
      <ApiItemLayout {...props} />
    </>
  );
}
