#!/usr/bin/env node

/**
 * IndexNow URL Submission Script for CI/CD
 * 
 * This script submits URLs to IndexNow after successful deployment to Cloudflare.
 * Should be run as part of your GitHub Actions workflow after deployment.
 * 
 * Usage:
 *   node scripts/submit-to-indexnow.js
 *   
 * Environment Variables:
 *   SITE_URL - The production URL of your site (defaults to https://docs.turbodocx.com)
 *   MAX_URLS - Maximum number of URLs to submit (defaults to 100)
 *   DRY_RUN - If set to 'true', will only show what would be submitted without actually submitting
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const INDEXNOW_API_KEY = '800eabc35ea5450111e9509e56e568af49305a629982d640818b63cc837c0da1';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = process.env.SITE_URL || 'https://docs.turbodocx.com';
const MAX_URLS = parseInt(process.env.MAX_URLS || '100');
const DRY_RUN = process.env.DRY_RUN === 'true';

async function main() {
  console.log('🚀 IndexNow CI/CD Submission Script');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`🔢 Max URLs: ${MAX_URLS}`);
  console.log(`🧪 Dry Run: ${DRY_RUN ? 'Yes' : 'No'}`);
  console.log('');

  try {
    // Generate sitemap URLs or read from build artifacts
    const urls = await generateUrlList();
    
    if (urls.length === 0) {
      console.log('⚠️  No URLs found to submit');
      process.exit(0);
    }

    console.log(`📋 Found ${urls.length} URLs to submit`);
    
    // Limit URLs
    const urlsToSubmit = urls.slice(0, MAX_URLS);
    
    if (DRY_RUN) {
      console.log('🧪 DRY RUN - Would submit these URLs:');
      urlsToSubmit.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));
      console.log(`\n✅ Dry run completed. Would submit ${urlsToSubmit.length} URLs to IndexNow`);
      return;
    }

    // Submit to IndexNow
    await submitToIndexNow(SITE_URL, urlsToSubmit);
    console.log(`✅ Successfully submitted ${urlsToSubmit.length} URLs to IndexNow`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Generate list of URLs to submit
 * This function can be enhanced to read from sitemap.xml or build artifacts
 */
async function generateUrlList() {
  const urls = [];
  
  // Try to read from sitemap first (if available)
  const sitemapPath = path.join(__dirname, '..', 'build', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    console.log('📄 Reading URLs from sitemap.xml...');
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
      urlMatches.forEach(match => {
        const url = match.replace(/<\/?loc>/g, '');
        if (url.startsWith(SITE_URL)) {
          urls.push(url);
        }
      });
    }
  }
  
  // Fallback: Generate common URLs
  if (urls.length === 0) {
    console.log('📝 Generating default URL list...');
    const commonPaths = [
      '/',
      '/docs/Welcome%20to%20TurboDocx',
      '/docs/category/turbodocx-templating',
      '/docs/category/integrations',
      '/docs/category/turbosign',
      '/docs/category/advanced-configuration',
      '/docs/category/api'
    ];
    
    commonPaths.forEach(path => {
      urls.push(`${SITE_URL}${path}`);
    });
    
    // Add API documentation URLs
    const apiPaths = [
      '/docs/API/turbodocx-api-documentation',
      '/docs/API/create-deliverable',
      '/docs/API/get-templates-and-folders',
      '/docs/API/upload-template-with-optional-default-values'
    ];
    
    apiPaths.forEach(path => {
      urls.push(`${SITE_URL}${path}`);
    });
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

/**
 * Submit URLs to IndexNow API
 */
async function submitToIndexNow(siteUrl, urls) {
  return new Promise((resolve, reject) => {
    const hostname = new URL(siteUrl).hostname;
    
    const payload = JSON.stringify({
      host: hostname,
      key: INDEXNOW_API_KEY,
      keyLocation: `${siteUrl}/${INDEXNOW_API_KEY}.txt`,
      urlList: urls
    });

    console.log('📡 Submitting to IndexNow API...');
    console.log(`🔑 Key Location: ${siteUrl}/${INDEXNOW_API_KEY}.txt`);
    console.log(`🌐 Host: ${hostname}`);

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'TurboDocx-Docs-IndexNow/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📊 Response Status: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log('✅ IndexNow API accepted the submission');
          resolve({ success: true, statusCode: res.statusCode, data });
        } else {
          console.log(`❌ IndexNow API Error: ${res.statusCode}`);
          if (data) console.log(`Response: ${data}`);
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

// Run the script
if (require.main === module) {
  main();
}

module.exports = { submitToIndexNow, generateUrlList };