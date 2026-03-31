const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Upload template with Excel data file attachment and sheet selection
 * This demonstrates advanced template upload with data source integration
 */
async function uploadTemplateWithDataFile() {
  try {
    const formData = new FormData();

    // 1. Attach the main template file (DOCX/PPTX)
    formData.append('templateFile', fs.createReadStream('./financial-report-template.docx'));
    formData.append('name', 'Q4 Financial Report Template');
    formData.append('description', 'Financial report template with Excel data integration for AI variable generation');

    // 2. Attach Excel data source file
    const dataFileId = 'financial-data-123';
    formData.append(`FileResource-${dataFileId}`, fs.createReadStream('./q4-financial-data.xlsx'));

    // 3. Specify sheet selection and data range metadata
    formData.append('fileResourceMetadata', JSON.stringify({
      [dataFileId]: {
        "selectedSheet": "Income Statement",
        "hasMultipleSheets": true,
        "dataRange": "A1:F50",
        "description": "Q4 financial data for AI variable generation"
      }
    }));

    // 4. Optional: Pre-define variables that will use the attached data
    formData.append('variables', JSON.stringify([
      {
        "name": "Revenue Summary",
        "placeholder": "{RevenueSummary}",
        "aiHint": "Generate revenue summary from attached financial data",
        "dataSourceId": dataFileId
      },
      {
        "name": "Expense Analysis",
        "placeholder": "{ExpenseAnalysis}",
        "aiHint": "Analyze expense trends from Q4 data",
        "dataSourceId": dataFileId
      }
    ]));

    // 5. Add tags for organization
    formData.append('tags', JSON.stringify(["financial", "q4", "ai-enhanced", "data-driven"]));

    console.log('Uploading template with Excel data file...');
    console.log(`Template: financial-report-template.docx`);
    console.log(`Data Source: q4-financial-data.xlsx (Sheet: Income Statement)`);
    console.log(`Data Range: A1:F50`);

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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    const template = result.data.results.template;

    console.log('✅ Template with data file uploaded successfully!');
    console.log(`Template ID: ${template.id}`);
    console.log(`Template Name: ${template.name}`);
    console.log(`Variables Extracted: ${template.variables ? template.variables.length : 0}`);
    console.log(`Data Sources Attached: ${template.dataSources ? template.dataSources.length : 1}`);
    console.log(`Default Font: ${template.defaultFont}`);
    console.log(`Fonts Used: ${template.fonts ? template.fonts.length : 0}`);

    // Show data source information
    if (template.dataSources && template.dataSources.length > 0) {
      console.log('\n📊 Attached Data Sources:');
      template.dataSources.forEach((source, index) => {
        console.log(`  ${index + 1}. ${source.filename} (${source.selectedSheet})`);
      });
    }

    console.log(`\n🔗 Redirect URL: ${result.data.results.redirectUrl}`);

    return template;
  } catch (error) {
    console.error('❌ Error uploading template with data file:', error);
    throw error;
  }
}

/**
 * Example: Process multiple sheets from the same Excel file
 */
async function uploadTemplateWithMultipleSheets() {
  try {
    const formData = new FormData();

    formData.append('templateFile', fs.createReadStream('./comprehensive-report-template.docx'));
    formData.append('name', 'Comprehensive Business Report');
    formData.append('description', 'Multi-sheet data analysis template');

    // Attach single Excel file but reference multiple sheets
    const dataFileId = 'business-data-456';
    formData.append(`FileResource-${dataFileId}`, fs.createReadStream('./business-data.xlsx'));

    // Define multiple sheet usage
    formData.append('fileResourceMetadata', JSON.stringify({
      [dataFileId]: {
        "selectedSheet": "Summary", // Primary sheet
        "hasMultipleSheets": true,
        "alternativeSheets": ["Revenue", "Expenses", "Projections"], // Additional sheets that can be referenced
        "dataRange": "A1:Z100",
        "description": "Comprehensive business data across multiple sheets"
      }
    }));

    // Variables that reference different sheets
    formData.append('variables', JSON.stringify([
      {
        "name": "Executive Summary",
        "placeholder": "{ExecutiveSummary}",
        "aiHint": "Create executive summary from Summary sheet data",
        "dataSourceId": dataFileId,
        "sheetReference": "Summary"
      },
      {
        "name": "Revenue Analysis",
        "placeholder": "{RevenueAnalysis}",
        "aiHint": "Analyze revenue trends from Revenue sheet",
        "dataSourceId": dataFileId,
        "sheetReference": "Revenue"
      }
    ]));

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
    console.log('✅ Multi-sheet template uploaded successfully!');
    console.log(`Template ID: ${result.data.results.template.id}`);

    return result.data.results.template;
  } catch (error) {
    console.error('❌ Error uploading multi-sheet template:', error);
    throw error;
  }
}

// Export functions for use in other modules
module.exports = {
  uploadTemplateWithDataFile,
  uploadTemplateWithMultipleSheets
};

// Run example if script is executed directly
if (require.main === module) {
  console.log('=== Template Upload with File Attachment Examples ===\n');

  // Example 1: Single sheet data attachment
  uploadTemplateWithDataFile()
    .then(template => {
      console.log('\n=== Example 1 Complete ===\n');
      return uploadTemplateWithMultipleSheets();
    })
    .then(template => {
      console.log('\n=== All Examples Complete ===');
      console.log('Ready to generate documents with data-enhanced templates!');
    })
    .catch(error => {
      console.error('\n❌ Example failed:', error.message);
    });
}