const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

// Final Step: Generate Deliverable (Both Paths Converge Here)

/**
 * Generate a deliverable document from template with variable substitution
 */
async function generateDeliverable(templateId, deliverableData) {
  try {
    const url = `${BASE_URL}/deliverable`;

    const payload = {
      templateId: templateId,
      name: deliverableData.name,
      description: deliverableData.description || '',
      variables: deliverableData.variables,
      tags: deliverableData.tags || [],
      fonts: deliverableData.fonts || '[]',
      defaultFont: deliverableData.defaultFont || 'Arial',
      replaceFonts: deliverableData.replaceFonts !== undefined ? deliverableData.replaceFonts : true,
      metadata: deliverableData.metadata || {}
    };

    console.log('Generating deliverable...');
    console.log(`Template ID: ${templateId}`);
    console.log(`Deliverable Name: ${payload.name}`);
    console.log(`Variables: ${payload.variables.length}`);

    const response = await fetch(url, {
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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    const deliverable = result.data.results.deliverable;

    console.log('✅ Deliverable generated successfully!');
    console.log(`Deliverable ID: ${deliverable.id}`);
    console.log(`Created by: ${deliverable.createdBy}`);
    console.log(`Created on: ${deliverable.createdOn}`);
    console.log(`Template ID: ${deliverable.templateId}`);

    return deliverable;

  } catch (error) {
    console.error('Error generating deliverable:', error);
    throw error;
  }
}

/**
 * Example: Simple variable structure - easy to understand
 */
function createSimpleVariables() {
  return [
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
}


/**
 * Download the generated deliverable file
 */
async function downloadDeliverable(deliverableId, filename) {
  try {
    const url = `${BASE_URL}/deliverable/file/${deliverableId}`;

    console.log(`Downloading file: ${filename}`);

    const response = await fetch(url, {
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
    console.log(`📁 Content-Type: ${response.headers.get('content-type')}`);
    console.log(`📊 Content-Length: ${response.headers.get('content-length')} bytes`);

    // In a real application, you would save the file
    // const buffer = await response.buffer();
    // fs.writeFileSync(filename, buffer);

    return {
      filename,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    };

  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Example usage with realistic data
 */
async function exampleGenerateDeliverable() {
  try {
    // This would come from either Path A (upload) or Path B (browse/select)
    const templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

    const deliverableData = {
      name: "Contract - John Smith",
      description: "Simple contract example",
      variables: createSimpleVariables()
    };

    console.log('=== Final Step: Generate Deliverable ===');
    const deliverable = await generateDeliverable(templateId, deliverableData);

    // Download the generated file
    console.log('\n=== Download Generated File ===');
    await downloadDeliverable(deliverable.id, `${deliverable.name}.docx`);

    return deliverable;

  } catch (error) {
    console.error('Deliverable generation failed:', error.message);
  }
}

// Export functions for use in other modules
module.exports = {
  generateDeliverable,
  downloadDeliverable,
  createSimpleVariables,
  exampleGenerateDeliverable
};

// Run example if script is executed directly
if (require.main === module) {
  exampleGenerateDeliverable();
}