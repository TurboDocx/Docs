const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Complete Template Workflow Manager
 * Demonstrates both upload and browse/select paths
 */

class TemplateWorkflowManager {
    constructor(apiToken, orgId, baseUrl) {
        this.apiToken = apiToken;
        this.orgId = orgId;
        this.baseUrl = baseUrl;
        console.log('=== TurboDocx Template Generation Workflow Manager ===');
    }

    async demonstrateCompleteWorkflow() {
        console.log('\nSelect workflow path:');
        console.log('A) Upload new template');
        console.log('B) Browse and select existing template');

        // For this example, we'll demonstrate both paths
        console.log('\n=== Demonstrating Path A: Upload Template ===');
        const templateIdA = await this.demonstrateUploadWorkflow();

        console.log('\n=== Demonstrating Path B: Browse Templates ===');
        const templateIdB = await this.demonstrateBrowseWorkflow();

        // Generate deliverables for both templates if successful
        if (templateIdA) {
            console.log('\n=== Generating Deliverable from Uploaded Template ===');
            await this.generateAndDownloadDeliverable(templateIdA, 'A');
        }

        if (templateIdB) {
            console.log('\n=== Generating Deliverable from Selected Template ===');
            await this.generateAndDownloadDeliverable(templateIdB, 'B');
        }

        return {
            uploadedTemplateId: templateIdA,
            selectedTemplateId: templateIdB
        };
    }

    async demonstrateUploadWorkflow() {
        try {
            console.log('\n--- Path A: Upload and Create Template ---');

            // Check for template file
            const templateFile = './contract-template.docx';
            if (!fs.existsSync(templateFile)) {
                console.log(`⚠️  Template file not found: ${templateFile}`);
                console.log('Creating a placeholder message for demonstration');
                return null;
            }

            const result = await this.uploadTemplate(templateFile);
            const template = result.data.results.template;

            console.log('✅ Upload workflow completed');
            console.log(`Template ID: ${template.id}`);
            console.log('Ready for deliverable generation');

            return template.id;
        } catch (error) {
            console.error(`❌ Upload workflow failed: ${error.message}`);
            return null;
        }
    }

    async demonstrateBrowseWorkflow() {
        try {
            console.log('\n--- Path B: Browse and Select Template ---');

            // Browse templates
            const browseResult = await this.browseTemplates(10, 0, 'contract', true);

            // Find first template (not folder)
            const selectedTemplate = browseResult.results.find(item => item.type === 'template');

            if (!selectedTemplate) {
                console.log('⚠️  No templates found in browse results');
                return null;
            }

            console.log(`Selected: ${selectedTemplate.name}`);

            // Get detailed information
            const templateDetails = await this.getTemplateDetails(selectedTemplate.id);

            // Optionally get PDF preview
            const pdfPreview = await this.getTemplatePdfPreview(selectedTemplate.id);

            console.log('✅ Browse workflow completed');
            console.log(`Template ID: ${templateDetails.id}`);
            console.log(`PDF Preview: ${pdfPreview}`);
            console.log('Ready for deliverable generation');

            return templateDetails.id;
        } catch (error) {
            console.error(`❌ Browse workflow failed: ${error.message}`);
            return null;
        }
    }

    async generateAndDownloadDeliverable(templateId, pathLabel) {
        try {
            console.log(`\n--- Generating Deliverable (Path ${pathLabel}) ---`);

            const deliverableData = this.createDeliverableData(templateId, pathLabel);
            const deliverable = await this.generateDeliverable(templateId, deliverableData);

            // Download the file
            const downloadResult = await this.downloadDeliverable(
                deliverable.id,
                `${deliverable.name}_path_${pathLabel}.docx`
            );

            console.log(`✅ Complete workflow finished successfully for Path ${pathLabel}`);
            console.log(`Deliverable ID: ${deliverable.id}`);
            console.log(`Download info: ${JSON.stringify(downloadResult, null, 2)}`);

            return {
                deliverable,
                downloadResult
            };
        } catch (error) {
            console.error(`❌ Deliverable generation failed for Path ${pathLabel}: ${error.message}`);
            throw error;
        }
    }

    async uploadTemplate(templateFilePath) {
        const url = `${this.baseUrl}/template/upload-and-create`;

        // Create form data
        const form = new FormData();

        // Add template file
        form.append('templateFile', fs.createReadStream(templateFilePath), {
            filename: path.basename(templateFilePath),
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        // Add metadata fields
        form.append('name', 'Employee Contract Template');
        form.append('description', 'Standard employee contract with variable placeholders');
        form.append('variables', '[]');
        form.append('tags', '["hr", "contract", "template"]');

        const response = await axios.post(url, form, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client',
                ...form.getHeaders()
            }
        });

        return response.data;
    }

    async browseTemplates(limit, offset, query, showTags) {
        // Build query parameters
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
            showTags: showTags.toString()
        });

        if (query) {
            params.append('query', query);
        }

        const url = `${this.baseUrl}/template-item?${params.toString()}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        return response.data.data;
    }

    async getTemplateDetails(templateId) {
        const url = `${this.baseUrl}/template/${templateId}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        return response.data.data.results;
    }

    async getTemplatePdfPreview(templateId) {
        const url = `${this.baseUrl}/template/${templateId}/previewpdflink`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        return response.data.results;
    }

    async generateDeliverable(templateId, deliverableData) {
        const url = `${this.baseUrl}/deliverable`;

        console.log('Generating deliverable...');
        console.log(`Template ID: ${templateId}`);
        console.log(`Deliverable Name: ${deliverableData.name}`);
        console.log(`Variables: ${deliverableData.variables.length}`);

        const response = await axios.post(url, deliverableData, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client',
                'Content-Type': 'application/json'
            }
        });

        // Parse JSON response
        const deliverable = response.data.data.results.deliverable;

        console.log('✅ Deliverable generated successfully!');
        console.log(`Deliverable ID: ${deliverable.id}`);
        console.log(`Created by: ${deliverable.createdBy}`);
        console.log(`Created on: ${deliverable.createdOn}`);
        console.log(`Template ID: ${deliverable.templateId}`);

        return deliverable;
    }

    async downloadDeliverable(deliverableId, filename) {
        console.log(`Downloading file: ${filename}`);

        const url = `${this.baseUrl}/deliverable/file/${deliverableId}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'x-rapiddocx-org-id': this.orgId,
                'User-Agent': 'TurboDocx API Client'
            },
            responseType: 'stream'
        });

        console.log(`✅ File ready for download: ${filename}`);

        const contentType = response.headers['content-type'] || 'N/A';
        const contentLength = response.headers['content-length'] || 'N/A';

        console.log(`📁 Content-Type: ${contentType}`);
        console.log(`📊 Content-Length: ${contentLength} bytes`);

        // In a real application, you would save the file
        // const writer = fs.createWriteStream(filename);
        // response.data.pipe(writer);

        return {
            filename,
            contentType,
            contentLength
        };
    }

    createDeliverableData(templateId, pathLabel) {
        const now = new Date().toISOString();

        return {
            templateId,
            name: `Contract Document - Path ${pathLabel}`,
            description: `Employment contract generated via workflow path ${pathLabel}`,
            variables: this.createComplexVariables(),
            tags: ['hr', 'contract', 'employee', 'engineering'],
            fonts: '[{"name":"Arial","usage":269}]',
            defaultFont: 'Arial',
            replaceFonts: true,
            metadata: {
                sessions: [
                    {
                        id: uuidv4(),
                        starttime: now,
                        endtime: now
                    }
                ],
                createdBy: 'Node.js Workflow Manager',
                documentType: 'Employment Contract',
                version: 'v1.0',
                workflowPath: pathLabel
            }
        };
    }

    createComplexVariables() {
        return [
            {
                mimeType: 'text',
                name: 'Employee Name',
                placeholder: '{EmployeeName}',
                text: 'John Smith',
                allowRichTextInjection: 0,
                autogenerated: false,
                count: 1,
                order: 1,
                subvariables: [
                    {
                        placeholder: '{EmployeeName.Title}',
                        text: 'Senior Software Engineer'
                    },
                    {
                        placeholder: '{EmployeeName.StartDate}',
                        text: 'January 15, 2024'
                    }
                ],
                metadata: {
                    department: 'Engineering',
                    level: 'Senior'
                },
                aiPrompt: 'Generate a professional job description for a senior software engineer role'
            },
            {
                mimeType: 'text',
                name: 'Company Information',
                placeholder: '{CompanyInfo}',
                text: 'TechCorp Solutions Inc.',
                allowRichTextInjection: 1,
                autogenerated: false,
                count: 1,
                order: 2,
                subvariables: [
                    {
                        placeholder: '{CompanyInfo.Address}',
                        text: '123 Innovation Drive, Tech City, TC 12345'
                    },
                    {
                        placeholder: '{CompanyInfo.Phone}',
                        text: '(555) 123-4567'
                    }
                ],
                metadata: {},
                aiPrompt: ''
            }
        ];
    }
}

// Fastify route handlers
async function registerRoutes() {
    // Complete workflow demonstration route
    fastify.post('/complete-workflow', async (request, reply) => {
        try {
            console.log('Starting complete workflow demonstration...');

            const workflowManager = new TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL);
            const result = await workflowManager.demonstrateCompleteWorkflow();

            reply.send({
                success: true,
                message: 'Complete workflow demonstration finished',
                data: result
            });
        } catch (error) {
            console.error('Error in complete workflow:', error);
            reply.code(500).send({
                error: 'Complete workflow failed',
                message: error.message
            });
        }
    });

    // Individual workflow paths
    fastify.post('/upload-workflow', async (request, reply) => {
        try {
            const { templateFilePath } = request.body;

            if (!templateFilePath) {
                return reply.code(400).send({
                    error: 'templateFilePath is required'
                });
            }

            const workflowManager = new TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL);
            const templateId = await workflowManager.demonstrateUploadWorkflow();

            if (!templateId) {
                return reply.code(404).send({
                    error: 'Upload workflow failed',
                    message: 'Template file not found or upload failed'
                });
            }

            // Generate deliverable
            const deliverableResult = await workflowManager.generateAndDownloadDeliverable(templateId, 'Upload');

            reply.send({
                success: true,
                message: 'Upload workflow completed successfully',
                data: {
                    templateId,
                    ...deliverableResult
                }
            });
        } catch (error) {
            console.error('Error in upload workflow:', error);
            reply.code(500).send({
                error: 'Upload workflow failed',
                message: error.message
            });
        }
    });

    fastify.post('/browse-workflow', async (request, reply) => {
        try {
            const workflowManager = new TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL);
            const templateId = await workflowManager.demonstrateBrowseWorkflow();

            if (!templateId) {
                return reply.code(404).send({
                    error: 'Browse workflow failed',
                    message: 'No templates found or selection failed'
                });
            }

            // Generate deliverable
            const deliverableResult = await workflowManager.generateAndDownloadDeliverable(templateId, 'Browse');

            reply.send({
                success: true,
                message: 'Browse workflow completed successfully',
                data: {
                    templateId,
                    ...deliverableResult
                }
            });
        } catch (error) {
            console.error('Error in browse workflow:', error);
            reply.code(500).send({
                error: 'Browse workflow failed',
                message: error.message
            });
        }
    });

    // Health check route
    fastify.get('/health', async (request, reply) => {
        reply.send({ status: 'healthy', service: 'workflow-manager' });
    });

    // Service info route
    fastify.get('/workflow-info', async (request, reply) => {
        reply.send({
            service: 'TurboDocx Complete Workflow Manager Service',
            endpoints: {
                'POST /complete-workflow': 'Demonstrate both upload and browse workflows',
                'POST /upload-workflow': 'Execute upload workflow only',
                'POST /browse-workflow': 'Execute browse workflow only',
                'GET /health': 'Service health check',
                'GET /workflow-info': 'Service information'
            },
            configuration: {
                baseUrl: BASE_URL,
                hasToken: !!API_TOKEN && API_TOKEN !== 'YOUR_API_TOKEN',
                hasOrgId: !!ORG_ID && ORG_ID !== 'YOUR_ORGANIZATION_ID'
            },
            description: 'Complete workflow manager that demonstrates both template upload and browse/select paths, followed by deliverable generation and download.'
        });
    });
}

// Example usage function
async function demonstrateCompleteWorkflow() {
    try {
        console.log('=== Complete Template Workflow Demonstration ===');

        const workflowManager = new TemplateWorkflowManager(API_TOKEN, ORG_ID, BASE_URL);
        const result = await workflowManager.demonstrateCompleteWorkflow();

        console.log('\n=== Workflow Demonstration Complete ===');
        console.log('Both upload and browse/select paths have been demonstrated.');
        console.log('Choose the appropriate path for your use case:');
        console.log('- Upload path: When you have new templates to create');
        console.log('- Browse path: When you want to use existing templates');

        return result;
    } catch (error) {
        console.error('Workflow demonstration failed:', error.message);
        process.exit(1);
    }
}

// Server startup
async function startServer() {
    try {
        await registerRoutes();

        const port = process.env.PORT || 3004;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('🚀 TurboDocx Complete Workflow Manager Service started');
        console.log(`📡 Server listening on http://${host}:${port}`);
        console.log('\nAvailable endpoints:');
        console.log(`  POST http://${host}:${port}/complete-workflow`);
        console.log(`  POST http://${host}:${port}/upload-workflow`);
        console.log(`  POST http://${host}:${port}/browse-workflow`);
        console.log(`  GET  http://${host}:${port}/health`);
        console.log(`  GET  http://${host}:${port}/workflow-info`);

    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

// Check if this file is being run directly
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--demo')) {
        // Run demonstration
        demonstrateCompleteWorkflow();
    } else {
        // Start server
        startServer();
    }
}

module.exports = {
    TemplateWorkflowManager,
    demonstrateCompleteWorkflow,
    startServer,
    fastify
};