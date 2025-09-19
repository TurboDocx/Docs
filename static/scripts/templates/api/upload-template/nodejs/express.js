const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const TEMPLATE_NAME = "Employee Contract Template";

// Path A: Upload and Create Template
async function uploadTemplate() {
  try {
    const formData = new FormData();
    formData.append('templateFile', fs.createReadStream('./contract-template.docx'));
    formData.append('name', TEMPLATE_NAME);
    formData.append('description', 'Standard employee contract with variable placeholders');
    formData.append('variables', '[]'); // Optional: pre-defined variables
    formData.append('tags', '["hr", "contract", "template"]');

    const response = await fetch(`${BASE_URL}/template/upload-and-create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'x-rapiddocx-org-id': ORG_ID,
        'User-Agent': 'TurboDocx API Client',
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Template uploaded successfully:', result.data.template.id);
    console.log('Variables extracted:', result.data.template.variables.length);
    console.log('Redirect to:', result.data.redirectUrl);

    return result.data.template;
  } catch (error) {
    console.error('Error uploading template:', error);
    throw error;
  }
}

// Example usage
uploadTemplate()
  .then(template => {
    console.log('Ready to generate documents with template:', template.id);
  })
  .catch(error => {
    console.error('Upload failed:', error.message);
  });