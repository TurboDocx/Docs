const fastify = require('fastify')({ logger: true });
const axios = require('axios');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Path B: Browse and Select Existing Templates
 */

/**
 * Browse templates with filtering options
 */
async function browseTemplates(limit = 25, offset = 0, query = '', showTags = true, selectedTags = null) {
    // Build query parameters
    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        showTags: showTags.toString()
    });

    if (query) {
        params.append('query', query);
    }

    if (selectedTags && Array.isArray(selectedTags)) {
        selectedTags.forEach(tag => {
            params.append('selectedTags[]', tag);
        });
    }

    const url = `${BASE_URL}/template-item?${params.toString()}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        // Parse response
        const data = response.data.data;

        console.log(`Found ${data.totalRecords} templates/folders`);

        return data;
    } catch (error) {
        console.error('Browse failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get detailed template information
 */
async function getTemplateDetails(templateId) {
    const url = `${BASE_URL}/template/${templateId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        const template = response.data.data.results;

        console.log(`Template: ${template.name}`);

        const variableCount = template.variables ? template.variables.length : 0;
        console.log(`Variables: ${variableCount}`);

        const defaultFont = template.defaultFont || 'N/A';
        console.log(`Default font: ${defaultFont}`);

        return template;
    } catch (error) {
        console.error('Failed to get template details:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get template PDF preview link
 */
async function getTemplatePdfPreview(templateId) {
    const url = `${BASE_URL}/template/${templateId}/previewpdflink`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
                'User-Agent': 'TurboDocx API Client'
            }
        });

        const pdfUrl = response.data.results;

        console.log(`PDF Preview: ${pdfUrl}`);

        return pdfUrl;
    } catch (error) {
        console.error('Failed to get PDF preview:', error.response?.data || error.message);
        throw error;
    }
}

// Fastify route handlers
async function registerRoutes() {
    // Browse templates route
    fastify.get('/browse-templates', async (request, reply) => {
        try {
            const {
                limit = 25,
                offset = 0,
                query = '',
                showTags = true,
                selectedTags
            } = request.query;

            const parsedLimit = parseInt(limit);
            const parsedOffset = parseInt(offset);
            const parsedShowTags = showTags === 'true' || showTags === true;
            const parsedSelectedTags = selectedTags ?
                (Array.isArray(selectedTags) ? selectedTags : [selectedTags]) : null;

            const result = await browseTemplates(
                parsedLimit,
                parsedOffset,
                query,
                parsedShowTags,
                parsedSelectedTags
            );

            reply.send({
                success: true,
                message: 'Templates retrieved successfully',
                data: result
            });
        } catch (error) {
            console.error('Error browsing templates:', error);
            reply.code(500).send({
                error: 'Template browsing failed',
                message: error.message
            });
        }
    });

    // Get template details route
    fastify.get('/template/:templateId', async (request, reply) => {
        try {
            const { templateId } = request.params;

            const template = await getTemplateDetails(templateId);

            reply.send({
                success: true,
                message: 'Template details retrieved successfully',
                data: template
            });
        } catch (error) {
            console.error('Error getting template details:', error);
            reply.code(500).send({
                error: 'Failed to get template details',
                message: error.message
            });
        }
    });

    // Get template PDF preview route
    fastify.get('/template/:templateId/preview', async (request, reply) => {
        try {
            const { templateId } = request.params;

            const pdfUrl = await getTemplatePdfPreview(templateId);

            reply.send({
                success: true,
                message: 'PDF preview URL retrieved successfully',
                data: { pdfUrl }
            });
        } catch (error) {
            console.error('Error getting PDF preview:', error);
            reply.code(500).send({
                error: 'Failed to get PDF preview',
                message: error.message
            });
        }
    });

    // Complete browse workflow route
    fastify.post('/browse-workflow', async (request, reply) => {
        try {
            const {
                limit = 10,
                offset = 0,
                query = 'contract',
                showTags = true
            } = request.body;

            // Step 1: Browse templates
            console.log('1. Browsing templates...');
            const browseResult = await browseTemplates(limit, offset, query, showTags);

            // Find a template (not a folder)
            const selectedTemplate = browseResult.results.find(item => item.type === 'template');

            if (!selectedTemplate) {
                return reply.code(404).send({
                    error: 'No templates found',
                    message: 'No templates found in browse results'
                });
            }

            console.log(`Selected template: ${selectedTemplate.name} (${selectedTemplate.id})`);

            // Step 2: Get detailed template information
            console.log('2. Getting template details...');
            const templateDetails = await getTemplateDetails(selectedTemplate.id);

            // Step 3: Get PDF preview (optional)
            console.log('3. Getting PDF preview...');
            const pdfPreview = await getTemplatePdfPreview(selectedTemplate.id);

            const result = {
                selectedTemplate,
                templateDetails,
                pdfPreview,
                summary: {
                    templateId: templateDetails.id,
                    variableCount: templateDetails.variables ? templateDetails.variables.length : 0,
                    pdfPreviewUrl: pdfPreview
                }
            };

            reply.send({
                success: true,
                message: 'Browse workflow completed successfully',
                data: result
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
        reply.send({ status: 'healthy', service: 'template-browser' });
    });

    // Service info route
    fastify.get('/browse-info', async (request, reply) => {
        reply.send({
            service: 'TurboDocx Template Browser Service',
            endpoints: {
                'GET /browse-templates': 'Browse available templates with filtering',
                'GET /template/:templateId': 'Get detailed template information',
                'GET /template/:templateId/preview': 'Get template PDF preview URL',
                'POST /browse-workflow': 'Complete browse and select workflow',
                'GET /health': 'Service health check',
                'GET /browse-info': 'Service information'
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
async function demonstrateBrowseWorkflow() {
    try {
        console.log('=== Path B: Browse and Select Template ===');

        // Step 1: Browse all templates
        console.log('\n1. Browsing templates...');
        const browseResult = await browseTemplates(10, 0, 'contract', true);

        // Find a template (not a folder)
        const selectedTemplate = browseResult.results.find(item => item.type === 'template');

        if (!selectedTemplate) {
            console.log('No templates found in browse results');
            process.exit(1);
        }

        console.log(`\nSelected template: ${selectedTemplate.name} (${selectedTemplate.id})`);

        // Step 2: Get detailed template information
        console.log('\n2. Getting template details...');
        const templateDetails = await getTemplateDetails(selectedTemplate.id);

        // Step 3: Get PDF preview (optional)
        console.log('\n3. Getting PDF preview...');
        const pdfPreview = await getTemplatePdfPreview(selectedTemplate.id);

        console.log('\n=== Template Ready for Generation ===');
        console.log(`Template ID: ${templateDetails.id}`);

        const variableCount = templateDetails.variables ? templateDetails.variables.length : 0;
        console.log(`Variables available: ${variableCount}`);
        console.log(`PDF Preview: ${pdfPreview}`);

        return {
            templateId: templateDetails.id,
            templateDetails,
            pdfPreview
        };
    } catch (error) {
        console.error('Browsing workflow failed:', error.message);
        process.exit(1);
    }
}

// Server startup
async function startServer() {
    try {
        await registerRoutes();

        const port = process.env.PORT || 3002;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('🚀 TurboDocx Template Browser Service started');
        console.log(`📡 Server listening on http://${host}:${port}`);
        console.log('\nAvailable endpoints:');
        console.log(`  GET  http://${host}:${port}/browse-templates`);
        console.log(`  GET  http://${host}:${port}/template/:templateId`);
        console.log(`  GET  http://${host}:${port}/template/:templateId/preview`);
        console.log(`  POST http://${host}:${port}/browse-workflow`);
        console.log(`  GET  http://${host}:${port}/health`);
        console.log(`  GET  http://${host}:${port}/browse-info`);

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
        demonstrateBrowseWorkflow();
    } else {
        // Start server
        startServer();
    }
}

module.exports = {
    browseTemplates,
    getTemplateDetails,
    getTemplatePdfPreview,
    demonstrateBrowseWorkflow,
    startServer,
    fastify
};