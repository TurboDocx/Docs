const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Path B: Browse and Select Existing Templates

/**
 * Step 1: Browse Templates and Folders
 */
async function browseTemplates(options = {}) {
  try {
    const {
      limit = 25,
      offset = 0,
      query = '',
      showTags = true,
      selectedTags = []
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      showTags: showTags.toString()
    });

    if (query) params.append('query', query);

    // Add selected tags (multiple values)
    selectedTags.forEach(tag => {
      params.append('selectedTags[]', tag);
    });

    const url = `${BASE_URL}/template-item?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Found ${result.data.totalRecords} templates/folders`);

    return result.data;
  } catch (error) {
    console.error('Error browsing templates:', error);
    throw error;
  }
}

/**
 * Step 2: Get Template Details by ID
 */
async function getTemplateDetails(templateId) {
  try {
    const url = `${BASE_URL}/template/${templateId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const template = result.data.results;

    console.log(`Template: ${template.name}`);
    console.log(`Variables: ${template.variables.length}`);
    console.log(`Default font: ${template.defaultFont}`);

    return template;
  } catch (error) {
    console.error('Error getting template details:', error);
    throw error;
  }
}

/**
 * Step 3: Get PDF Preview Link (Optional)
 */
async function getTemplatePDFPreview(templateId) {
  try {
    const url = `${BASE_URL}/template/${templateId}/previewpdflink`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`PDF Preview: ${result.results}`);

    return result.results;
  } catch (error) {
    console.error('Error getting PDF preview:', error);
    throw error;
  }
}

/**
 * Browse Folder Contents
 */
async function browseFolderContents(folderId, options = {}) {
  try {
    const {
      limit = 25,
      offset = 0,
      query = ''
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    if (query) params.append('query', query);

    const url = `${BASE_URL}/template-item/${folderId}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const folderData = result.data.results;

    console.log(`Folder: ${folderData.name}`);
    console.log(`Templates in folder: ${folderData.templateCount}`);

    return folderData;
  } catch (error) {
    console.error('Error browsing folder:', error);
    throw error;
  }
}

// Example usage - Complete browsing workflow
async function exampleBrowsingWorkflow() {
  try {
    console.log('=== Path B: Browse and Select Template ===');

    // Step 1: Browse all templates
    console.log('\n1. Browsing templates...');
    const browseResult = await browseTemplates({
      limit: 10,
      query: 'contract',
      showTags: true
    });

    // Find a template (not a folder)
    const template = browseResult.results.find(item => item.type === 'template');
    if (!template) {
      console.log('No templates found in browse results');
      return;
    }

    console.log(`\nSelected template: ${template.name} (${template.id})`);

    // Step 2: Get detailed template information
    console.log('\n2. Getting template details...');
    const templateDetails = await getTemplateDetails(template.id);

    // Step 3: Get PDF preview (optional)
    console.log('\n3. Getting PDF preview...');
    const pdfPreview = await getTemplatePDFPreview(template.id);

    console.log('\n=== Template Ready for Generation ===');
    console.log(`Template ID: ${templateDetails.id}`);
    console.log(`Variables available: ${templateDetails.variables.length}`);
    console.log(`PDF Preview: ${pdfPreview}`);

    return {
      template: templateDetails,
      pdfPreview
    };

  } catch (error) {
    console.error('Browsing workflow failed:', error.message);
  }
}

// Run the example
exampleBrowsingWorkflow();