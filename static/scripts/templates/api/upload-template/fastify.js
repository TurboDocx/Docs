const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";
const TEMPLATE_NAME = "Employee Contract Template";

/**
 * Path A: Upload and Create Template
 * Uploads a .docx/.pptx template and extracts variables automatically
 */

/**
 * Upload template endpoint handler
 */
async function uploadTemplate(templateFilePath) {
    // Check if file exists
    if (!fs.existsSync(templateFilePath)) {
        throw new Error(`Template file not found: ${templateFilePath}`);
    }

    const url = `${BASE_URL}/template/upload-and-create`;

    // Create form data
    const form = new FormData();

    // Add template file
    form.append('templateFile', fs.createReadStream(templateFilePath), {
        filename: path.basename(templateFilePath),
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Add metadata fields
    form.append('name', TEMPLATE_NAME);
    form.append('description', 'Standard employee contract with variable placeholders');
    form.append('variables', '[]');
    form.append('tags', '["hr", "contract", "template"]');

    try {
        console.log(`Uploading template: ${path.basename(templateFilePath)}`);
        console.log(`Template name: ${TEMPLATE_NAME}`);

        const response = await axios.post(url, form, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
                'User-Agent': 'TurboDocx API Client',
                ...form.getHeaders()
            }
        });

        // Parse response
        const template = response.data.data.results.template;

        console.log(`✅ Template uploaded successfully: ${template.id}`);
        console.log(`Template name: ${template.name}`);

        // Handle nullable variables field
        const variableCount = template.variables ? template.variables.length : 0;
        console.log(`Variables extracted: ${variableCount}`);

        console.log(`Default font: ${template.defaultFont}`);

        // Handle nullable fonts field
        const fontCount = template.fonts ? template.fonts.length : 0;
        console.log(`Fonts used: ${fontCount}`);

        console.log(`Redirect to: ${response.data.data.results.redirectUrl}`);
        console.log(`Ready to generate documents with template: ${template.id}`);

        return response.data;
    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        throw error;
    }
}

// Fastify route handlers
async function registerRoutes() {
    // Upload template route
    fastify.post('/upload-template', async (request, reply) => {
        try {
            const { templateFilePath } = request.body;

            if (!templateFilePath) {
                return reply.code(400).send({
                    error: 'templateFilePath is required'
                });
            }

            const result = await uploadTemplate(templateFilePath);

            reply.send({
                success: true,
                message: 'Template uploaded successfully',
                data: result
            });
        } catch (error) {
            console.error('Error uploading template:', error);
            reply.code(500).send({
                error: 'Template upload failed',
                message: error.message
            });
        }
    });

    // Health check route
    fastify.get('/health', async (request, reply) => {
        reply.send({ status: 'healthy', service: 'template-upload' });
    });

    // Get upload status route
    fastify.get('/upload-info', async (request, reply) => {
        reply.send({
            service: 'TurboDocx Template Upload Service',
            endpoints: {
                'POST /upload-template': 'Upload a new template file',
                'GET /health': 'Service health check',
                'GET /upload-info': 'Service information'
            },
            configuration: {
                baseUrl: BASE_URL,
                hasToken: !!API_TOKEN && API_TOKEN !== 'YOUR_API_TOKEN',
                hasOrgId: !!ORG_ID && ORG_ID !== 'YOUR_ORGANIZATION_ID'
            }
        });
    });
}

// Example usage function
async function demonstrateUpload() {
    try {
        console.log('=== Template Upload Demonstration ===');

        const templateFile = './contract-template.docx';
        const result = await uploadTemplate(templateFile);

        console.log('\n=== Upload Complete ===');
        console.log('Template ready for deliverable generation');

        return result;
    } catch (error) {
        console.error('Demonstration failed:', error.message);
        process.exit(1);
    }
}

// Server startup
async function startServer() {
    try {
        await registerRoutes();

        const port = process.env.PORT || 3001;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('🚀 TurboDocx Template Upload Service started');
        console.log(`📡 Server listening on http://${host}:${port}`);
        console.log('\nAvailable endpoints:');
        console.log(`  POST http://${host}:${port}/upload-template`);
        console.log(`  GET  http://${host}:${port}/health`);
        console.log(`  GET  http://${host}:${port}/upload-info`);

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
        demonstrateUpload();
    } else {
        // Start server
        startServer();
    }
}

module.exports = {
    uploadTemplate,
    startServer,
    demonstrateUpload,
    fastify
};