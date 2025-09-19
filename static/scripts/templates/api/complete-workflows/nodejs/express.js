const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Complete Template Generation Workflows
 * Demonstrates both Path A (Upload) and Path B (Browse/Select) followed by generation
 */

class TemplateWorkflowManager {
  constructor(apiToken, orgId, baseUrl) {
    this.apiToken = apiToken;
    this.orgId = orgId;
    this.baseUrl = baseUrl;
    this.headers = {
      'Authorization': `Bearer ${apiToken}`,
      'x-rapiddocx-org-id': orgId,
      'User-Agent': 'TurboDocx API Client'
    };
  }

  // ===============================
  // PATH A: Upload New Template
  // ===============================

  async pathA_UploadAndGenerate(templateFilePath, deliverableName) {
    console.log('🔄 PATH A: Upload New Template → Generate Deliverable');
    console.log('================================');

    try {
      // Step 1: Upload and create template
      console.log('\n📤 Step 1: Uploading template...');
      const template = await this.uploadTemplate(templateFilePath);

      // Step 2: Generate deliverable using uploaded template
      console.log('\n📝 Step 2: Generating deliverable...');
      const deliverable = await this.generateDeliverable(template.id, {
        name: deliverableName,
        description: `Generated from uploaded template: ${template.name}`,
        variables: this.createVariablesFromTemplate(template.variables)
      });

      console.log('\n✅ PATH A COMPLETE!');
      console.log(`Template ID: ${template.id}`);
      console.log(`Deliverable ID: ${deliverable.id}`);
      console.log(`Download: ${deliverable.downloadUrl}`);

      return { template, deliverable };

    } catch (error) {
      console.error('❌ Path A failed:', error.message);
      throw error;
    }
  }

  async uploadTemplate(templateFilePath) {
    const formData = new FormData();
    formData.append('templateFile', fs.createReadStream(templateFilePath));
    formData.append('name', 'API Upload Template');
    formData.append('description', 'Template uploaded via API for testing');
    formData.append('variables', '[]');
    formData.append('tags', '["api", "test", "upload"]');

    const response = await fetch(`${this.baseUrl}/template/upload-and-create`, {
      method: 'POST',
      headers: {
        ...this.headers,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    const template = result.data.template;

    console.log(`✅ Template uploaded: ${template.name} (${template.id})`);
    console.log(`📊 Variables extracted: ${template.variables.length}`);

    return template;
  }

  // ===============================
  // PATH B: Browse and Select
  // ===============================

  async pathB_BrowseAndGenerate(searchQuery, deliverableName) {
    console.log('🔍 PATH B: Browse Existing Templates → Generate Deliverable');
    console.log('==================================================');

    try {
      // Step 1: Browse templates
      console.log('\n🔍 Step 1: Browsing templates...');
      const browseResult = await this.browseTemplates({ query: searchQuery });

      // Step 2: Select first available template
      const selectedTemplate = browseResult.results.find(item => item.type === 'template');
      if (!selectedTemplate) {
        throw new Error('No templates found in browse results');
      }

      console.log(`📋 Selected: ${selectedTemplate.name} (${selectedTemplate.id})`);

      // Step 3: Get template details
      console.log('\n📖 Step 2: Getting template details...');
      const templateDetails = await this.getTemplateDetails(selectedTemplate.id);

      // Step 4: Get PDF preview (optional)
      console.log('\n🖼️  Step 3: Getting PDF preview...');
      const pdfPreview = await this.getTemplatePDFPreview(selectedTemplate.id);

      // Step 5: Generate deliverable
      console.log('\n📝 Step 4: Generating deliverable...');
      const deliverable = await this.generateDeliverable(templateDetails.id, {
        name: deliverableName,
        description: `Generated from existing template: ${templateDetails.name}`,
        variables: this.createVariablesFromTemplate(templateDetails.variables)
      });

      console.log('\n✅ PATH B COMPLETE!');
      console.log(`Template ID: ${templateDetails.id}`);
      console.log(`Deliverable ID: ${deliverable.id}`);
      console.log(`Download: ${deliverable.downloadUrl}`);

      return { template: templateDetails, deliverable, pdfPreview };

    } catch (error) {
      console.error('❌ Path B failed:', error.message);
      throw error;
    }
  }

  async browseTemplates(options = {}) {
    const {
      limit = 25,
      offset = 0,
      query = '',
      showTags = true
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      showTags: showTags.toString()
    });

    if (query) params.append('query', query);

    const response = await fetch(`${this.baseUrl}/template-item?${params.toString()}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Browse failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`🔍 Found ${result.data.totalRecords} templates/folders`);

    return result.data;
  }

  async getTemplateDetails(templateId) {
    const response = await fetch(`${this.baseUrl}/template/${templateId}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Template details failed: ${response.status}`);
    }

    const result = await response.json();
    const template = result.data.results;

    console.log(`📊 Variables: ${template.variables.length}`);
    console.log(`🔤 Default font: ${template.defaultFont || 'N/A'}`);

    return template;
  }

  async getTemplatePDFPreview(templateId) {
    const response = await fetch(`${this.baseUrl}/template/${templateId}/previewpdflink`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`PDF preview failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`🖼️  PDF Preview available: ${result.results}`);

    return result.results;
  }

  // ===============================
  // COMMON: Generate Deliverable
  // ===============================

  async generateDeliverable(templateId, deliverableData) {
    const payload = {
      templateId: templateId,
      name: deliverableData.name,
      description: deliverableData.description || '',
      variables: deliverableData.variables,
      tags: deliverableData.tags || ['api-generated'],
      fonts: deliverableData.fonts || '[]',
      defaultFont: deliverableData.defaultFont || 'Arial',
      replaceFonts: deliverableData.replaceFonts !== undefined ? deliverableData.replaceFonts : true,
      metadata: deliverableData.metadata || {
        sessions: [{
          id: this.generateSessionId(),
          starttime: new Date().toISOString(),
          endtime: new Date().toISOString()
        }],
        workflow: 'API Complete Workflow',
        generated: new Date().toISOString()
      }
    };

    const response = await fetch(`${this.baseUrl}/deliverable`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deliverable generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const deliverable = result.data.deliverable;

    console.log(`✅ Generated: ${deliverable.name}`);
    console.log(`📄 Status: ${deliverable.status}`);
    console.log(`📁 Size: ${deliverable.fileSize} bytes`);

    return deliverable;
  }

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================

  createVariablesFromTemplate(templateVariables) {
    return templateVariables.map((variable, index) => ({
      mimeType: variable.mimeType || "text",
      name: variable.name,
      placeholder: variable.placeholder,
      text: this.generateSampleText(variable.name),
      allowRichTextInjection: variable.allowRichTextInjection || 0,
      autogenerated: false,
      count: 1,
      order: index + 1,
      subvariables: this.createSampleSubvariables(variable.placeholder),
      metadata: {
        generatedBy: "API Workflow",
        variableType: variable.mimeType || "text"
      },
      aiPrompt: `Generate appropriate content for ${variable.name}`
    }));
  }

  generateSampleText(variableName) {
    const sampleData = {
      'Company': 'TechCorp Solutions Inc.',
      'Employee': 'John Smith',
      'Date': new Date().toLocaleDateString(),
      'Title': 'Senior Software Engineer',
      'Department': 'Engineering',
      'Salary': '$95,000',
      'Address': '123 Main Street, Tech City, TC 12345',
      'Phone': '(555) 123-4567',
      'Email': 'john.smith@techcorp.com'
    };

    // Find matching sample data or generate generic text
    for (const [key, value] of Object.entries(sampleData)) {
      if (variableName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return `Sample ${variableName} Content`;
  }

  createSampleSubvariables(placeholder) {
    // Create relevant subvariables based on placeholder name
    if (placeholder.toLowerCase().includes('employee')) {
      return [
        { placeholder: "{Employee.Title}", text: "Senior Software Engineer" },
        { placeholder: "{Employee.StartDate}", text: new Date().toLocaleDateString() }
      ];
    } else if (placeholder.toLowerCase().includes('company')) {
      return [
        { placeholder: "{Company.Address}", text: "123 Main Street, Tech City, TC 12345" },
        { placeholder: "{Company.Phone}", text: "(555) 123-4567" }
      ];
    }

    return [];
  }

  generateSessionId() {
    return Math.random().toString(36).substr(2, 9) + '-' +
           Math.random().toString(36).substr(2, 9) + '-' +
           Math.random().toString(36).substr(2, 9);
  }

  // ===============================
  // DEMO FUNCTIONS
  // ===============================

  async demoPathA(templateFilePath) {
    console.log('🚀 DEMO: Path A - Upload New Template Workflow');
    console.log('===============================================\n');

    return await this.pathA_UploadAndGenerate(
      templateFilePath,
      'Contract Generated via Path A - API Upload'
    );
  }

  async demoPathB() {
    console.log('🚀 DEMO: Path B - Browse Existing Template Workflow');
    console.log('=================================================\n');

    return await this.pathB_BrowseAndGenerate(
      'contract',
      'Contract Generated via Path B - Browse & Select'
    );
  }

  async demoComparison() {
    console.log('🚀 DEMO: Complete Workflow Comparison');
    console.log('====================================\n');

    try {
      console.log('Testing both paths with the same template type...\n');

      // Run Path B first (browse existing)
      const pathBResult = await this.demoPathB();

      console.log('\n' + '='.repeat(60) + '\n');

      // For Path A, we'd need a template file
      console.log('📝 Path A requires a template file to upload.');
      console.log('   Example: await workflow.demoPathA("./contract-template.docx")');

      return { pathB: pathBResult };

    } catch (error) {
      console.error('Demo comparison failed:', error.message);
    }
  }
}

// ===============================
// EXAMPLE USAGE
// ===============================

async function runExamples() {
  const workflow = new TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL);

  try {
    // Demo Path B (Browse existing templates)
    await workflow.demoPathB();

    // Uncomment to demo Path A (requires template file):
    // await workflow.demoPathA('./path/to/your/template.docx');

    // Uncomment to run full comparison:
    // await workflow.demoComparison();

  } catch (error) {
    console.error('Workflow demo failed:', error.message);
  }
}

// Export for use in other modules
module.exports = {
  TemplateWorkflowManager
};

// Run examples if script is executed directly
if (require.main === module) {
  runExamples();
}