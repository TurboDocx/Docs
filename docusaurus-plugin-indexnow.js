/**
 * Docusaurus IndexNow Plugin
 * Automatically submits URLs to search engines supporting IndexNow protocol
 */

const path = require('path');
const fs = require('fs');
const https = require('https');

const INDEXNOW_API_KEY = '800eabc35ea5450111e9509e56e568af49305a629982d640818b63cc837c0da1';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

module.exports = function docusaurusPluginIndexNow(context, options) {
  const { siteConfig } = context;
  const { url: siteUrl } = siteConfig;
  
  // Default options
  const pluginOptions = {
    enabled: true,
    submitOnBuild: false, // Disabled by default - use CI/CD script instead
    maxUrls: 100,
    ...options
  };

  return {
    name: 'docusaurus-plugin-indexnow',

    async postBuild({ siteDir, outDir, routesPaths }) {
      if (!pluginOptions.enabled || !pluginOptions.submitOnBuild) {
        return;
      }

      console.log('📡 IndexNow: Preparing to submit URLs to search engines...');

      // Convert route paths to full URLs
      const urls = routesPaths
        .map(route => `${siteUrl}${route}`)
        .slice(0, pluginOptions.maxUrls);

      if (urls.length === 0) {
        console.log('⚠️ IndexNow: No URLs found to submit');
        return;
      }

      try {
        await submitToIndexNow(siteUrl, urls);
        console.log(`✅ IndexNow: Successfully submitted ${urls.length} URLs`);
      } catch (error) {
        console.error('❌ IndexNow: Failed to submit URLs:', error.message);
      }
    },

    configureWebpack(config, isServer) {
      return {
        // No webpack configuration needed
      };
    }
  };
};

/**
 * Submit URLs to IndexNow API
 * @param {string} host - The website host
 * @param {string[]} urls - Array of URLs to submit
 */
async function submitToIndexNow(host, urls) {
  return new Promise((resolve, reject) => {
    const hostname = new URL(host).hostname;
    
    const payload = JSON.stringify({
      host: hostname,
      key: INDEXNOW_API_KEY,
      keyLocation: `${host}/${INDEXNOW_API_KEY}.txt`,
      urlList: urls
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}