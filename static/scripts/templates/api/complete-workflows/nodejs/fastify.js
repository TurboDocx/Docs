const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Complete Workflow: Upload → Generate → Download
 * Simple 3-step process for document generation
 */

// Step 1: Upload template file
async function uploadTemplate(templateFilePath) {
  const formData = new FormData();
  formData.append('templateFile', fs.createReadStream(templateFilePath));
  formData.append('name', 'Simple Template');
  formData.append('description', 'Template uploaded for document generation');

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
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();
  const template = result.data.results.template;

  console.log(`✅ Template uploaded: ${template.name} (${template.id})`);
  return template;
}

// Step 2: Generate deliverable with simple variables
async function generateDeliverable(templateId) {
  const variables = [
    {
      name: "Company Name",
      placeholder: "{CompanyName}",
      text: "Acme Corporation"
    },
    {
      name: "Employee Name",
      placeholder: "{EmployeeName}",
      text: "John Smith"
    },
    {
      name: "Date",
      placeholder: "{Date}",
      text: "January 15, 2024"
    }
  ];

  const payload = {
    templateId: templateId,
    name: "Generated Document",
    description: "Simple document example",
    variables: variables
  };

  const response = await fetch(`${BASE_URL}/deliverable`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'x-rapiddocx-org-id': ORG_ID,
      'User-Agent': 'TurboDocx API Client',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.status}`);
  }

  const result = await response.json();
  const deliverable = result.data.results.deliverable;

  console.log(`✅ Document generated: ${deliverable.name} (${deliverable.id})`);
  return deliverable;
}

// Step 3: Download generated file
async function downloadFile(deliverableId, filename) {
  const response = await fetch(`${BASE_URL}/deliverable/file/${deliverableId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'x-rapiddocx-org-id': ORG_ID,
      'User-Agent': 'TurboDocx API Client'
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  console.log(`✅ File ready for download: ${filename}`);

  // In a real application, you would save the file:
  // const buffer = await response.buffer();
  // fs.writeFileSync(filename, buffer);

  return {
    filename,
    contentType: response.headers.get('content-type'),
    contentLength: response.headers.get('content-length')
  };
}

// Complete workflow: Upload → Generate → Download
async function completeWorkflow(templateFilePath) {
  try {
    console.log('🚀 Starting complete workflow...');

    // Step 1: Upload template
    console.log('\n📤 Step 1: Uploading template...');
    const template = await uploadTemplate(templateFilePath);

    // Step 2: Generate deliverable
    console.log('\n📝 Step 2: Generating document...');
    const deliverable = await generateDeliverable(template.id);

    // Step 3: Download file
    console.log('\n📥 Step 3: Downloading file...');
    const downloadInfo = await downloadFile(deliverable.id, `${deliverable.name}.docx`);

    console.log('\n✅ Workflow complete!');
    console.log(`Template: ${template.id}`);
    console.log(`Document: ${deliverable.id}`);
    console.log(`File: ${downloadInfo.filename}`);

    return { template, deliverable, downloadInfo };

  } catch (error) {
    console.error('❌ Workflow failed:', error.message);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    // Replace with your template file path
    const templatePath = './template.docx';
    await completeWorkflow(templatePath);
  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Export functions
module.exports = {
  uploadTemplate,
  generateDeliverable,
  downloadFile,
  completeWorkflow
};

// Run example if script is executed directly
if (require.main === module) {
  example();
}