// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// [item, [[], [], []]]
const apiConfig = require('./dev-docs-openapi.js');
const openApiCongfig = apiConfig.config
const itemsJson = require("./items.json")
const footerItems = require("./footerItems.json")
const logoJson = require('./logo.json')


/** @type {import('@docusaurus/types').Config} */
const config = {
  scripts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
      crossorigin: 'anonymous',
    }
  ],
  stylesheets: [
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css',
    },
    'src/css/custom.css',
    {
      href: 'https://cdn.tailwindcss.com/3.4.3'
    },
  ],
  title: 'TurboDocx',
  tagline: 'Turbocharging your Document Workflows',
  url: 'https://docs.turbodocx.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'ignore',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.ico',
  headTags: [
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TurboDocx',
        url: 'https://www.turbodocx.com',
        logo: 'https://docs.turbodocx.com/img/TurboDocxLogo.png',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TurboDocx Documentation',
        url: 'https://docs.turbodocx.com',
        publisher: {
          '@type': 'Organization',
          name: 'TurboDocx',
        },
      }),
    },
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'TurboDocx', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  plugins: ['docusaurus-plugin-sass',
    "@orama/plugin-docusaurus-v3",
    [
      '@docusaurus/plugin-client-redirects',
      {
        // "Job Book" was renamed to "Document Package" (BE #1529). The guide's
        // filename drives its URL, so without this every previously-shared or
        // indexed link to the old page would 404.
        redirects: [
          {
            from: '/docs/Integrations/Wrike/job-books',
            to: '/docs/Integrations/Wrike/document-packages',
          },
        ],
      },
    ],
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        docsDir: 'docs',
        includeBlog: false,
        excludeImports: true,
        removeDuplicateHeadings: true
      }
    ],
    [
      './docusaurus-plugin-indexnow.js',
      {
        enabled: true,
        submitOnBuild: false, // Only submit via CI/CD after deployment
        maxUrls: 100
      }
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: openApiCongfig
      },
    ], async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],
  themes: ["docusaurus-theme-openapi-docs"],
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          showLastUpdateTime: true,
          docItemComponent: "@theme/ApiItem",
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
            // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        ...(process.env.GTM_CONTAINER_ID && {
          googleTagManager: {
            containerId: process.env.GTM_CONTAINER_ID,
          },
        }),
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/turbodocx-og.png',
      metadata: [
        { name: 'twitter:site', content: '@turbodocx' },
        { property: 'og:site_name', content: 'TurboDocx Documentation' },
        { property: 'og:type', content: 'website' },
      ],
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: 'TurboDocx Logo',
          src: 'img/TurboDocxLogo.svg',
          href: "https://www.turbodocx.com/?utm_source=docs-site",
        },
        items: [
          ...itemsJson.items, {
            type: 'search',
            position: 'left',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [...footerItems.links],
        copyright: `Powered by TurboDocx`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'php', 
          'csharp', 
          'java', 
          'python', 
          'javascript',
          'go',
          'ruby',
          'powershell',
          'bash'
        ],
      },
    }),
};

module.exports = config;
