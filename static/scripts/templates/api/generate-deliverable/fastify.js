const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Final Step: Generate Deliverable (Both Paths Converge Here)
 */

/**
 * Generate a deliverable document from template with variable substitution
 */
async function generateDeliverable(templateId, deliverableData) {
    const url = `${BASE_URL}/deliverable`;

    console.log('Generating deliverable...');
    console.log(`Template ID: ${templateId}`);
    console.log(`Deliverable Name: ${deliverableData.name}`);
    console.log(`Variables: ${deliverableData.variables.length}`);

    try {
        const response = await axios.post(url, deliverableData, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
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
    } catch (error) {
        console.error('Deliverable generation failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Download the generated deliverable file
 */
async function downloadDeliverable(deliverableId, filename) {
    console.log(`Downloading file: ${filename}`);

    const url = `${BASE_URL}/deliverable/file/${deliverableId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
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
        // const fs = require('fs');
        // const writer = fs.createWriteStream(filename);
        // response.data.pipe(writer);
        //
        // return new Promise((resolve, reject) => {
        //     writer.on('finish', resolve);
        //     writer.on('error', reject);
        // });

        return {
            filename,
            contentType,
            contentLength,
            downloadStream: response.data
        };
    } catch (error) {
        console.error('Download failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Create example deliverable data with complex variables
 */
function createDeliverableData(templateId) {
    const now = new Date().toISOString();

    return {
        templateId,
        name: 'Contract - John Smith',
        description: 'Simple contract example',
        variables: createSimpleVariables()
    };
}

/**
 * Create simple variable structures - easy to understand
 */
function createSimpleVariables() {
    return [
        {
            name: 'Company Name',
            placeholder: '{CompanyName}',
            text: 'Acme Corporation'
        },
        {
            name: 'Employee Name',
            placeholder: '{EmployeeName}',
            text: 'John Smith'
        },
        {
            name: 'Date',
            placeholder: '{Date}',
            text: 'January 15, 2024'
        }
    ];
}

// Fastify route handlers
async function registerRoutes() {
    // Generate deliverable route
    fastify.post('/generate-deliverable', async (request, reply) => {
        try {
            const { templateId, deliverableData } = request.body;

            if (!templateId) {
                return reply.code(400).send({
                    error: 'templateId is required'
                });
            }

            // Use provided data or create default data
            const dataToUse = deliverableData || createDeliverableData(templateId);

            const deliverable = await generateDeliverable(templateId, dataToUse);

            reply.send({
                success: true,
                message: 'Deliverable generated successfully',
                data: deliverable
            });
        } catch (error) {
            console.error('Error generating deliverable:', error);
            reply.code(500).send({
                error: 'Deliverable generation failed',
                message: error.message
            });
        }
    });

    // Download deliverable route
    fastify.get('/download-deliverable/:deliverableId', async (request, reply) => {
        try {
            const { deliverableId } = request.params;
            const { filename = `deliverable-${deliverableId}.docx` } = request.query;

            const downloadInfo = await downloadDeliverable(deliverableId, filename);

            // Set appropriate headers for file download
            reply.header('Content-Type', downloadInfo.contentType);
            reply.header('Content-Disposition', `attachment; filename="${filename}"`);
            if (downloadInfo.contentLength && downloadInfo.contentLength !== 'N/A') {
                reply.header('Content-Length', downloadInfo.contentLength);
            }

            // Stream the file data
            reply.send(downloadInfo.downloadStream);
        } catch (error) {
            console.error('Error downloading deliverable:', error);
            reply.code(500).send({
                error: 'Download failed',
                message: error.message
            });
        }
    });

    // Complete generation workflow route
    fastify.post('/complete-workflow', async (request, reply) => {
        try {
            const { templateId, customVariables } = request.body;

            if (!templateId) {
                return reply.code(400).send({
                    error: 'templateId is required'
                });
            }

            // Create deliverable data
            let deliverableData = createDeliverableData(templateId);

            // Override variables if custom ones provided
            if (customVariables && Array.isArray(customVariables)) {
                deliverableData.variables = customVariables;
            }

            // Generate deliverable
            console.log('=== Generating Deliverable ===');
            const deliverable = await generateDeliverable(templateId, deliverableData);

            // Get download info (but don't actually download in this example)
            console.log('\n=== Getting Download Info ===');
            const downloadUrl = `${BASE_URL}/deliverable/file/${deliverable.id}`;

            reply.send({
                success: true,
                message: 'Complete workflow executed successfully',
                data: {
                    deliverable,
                    downloadUrl,
                    downloadEndpoint: `/download-deliverable/${deliverable.id}`,
                    summary: {
                        deliverableId: deliverable.id,
                        templateId: deliverable.templateId,
                        createdBy: deliverable.createdBy,
                        createdOn: deliverable.createdOn
                    }
                }
            });
        } catch (error) {
            console.error('Error in complete workflow:', error);
            reply.code(500).send({
                error: 'Complete workflow failed',
                message: error.message
            });
        }
    });

    // Health check route
    fastify.get('/health', async (request, reply) => {
        reply.send({ status: 'healthy', service: 'deliverable-generator' });
    });

    // Service info route
    fastify.get('/generator-info', async (request, reply) => {
        reply.send({
            service: 'TurboDocx Deliverable Generator Service',
            endpoints: {
                'POST /generate-deliverable': 'Generate a deliverable from template',
                'GET /download-deliverable/:deliverableId': 'Download generated deliverable file',
                'POST /complete-workflow': 'Complete generation and download workflow',
                'GET /health': 'Service health check',
                'GET /generator-info': 'Service information'
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
async function demonstrateGeneration() {
    try {
        console.log('=== Final Step: Generate Deliverable ===');

        // This would come from either Path A (upload) or Path B (browse/select)
        const templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

        const deliverableData = createDeliverableData(templateId);
        const deliverable = await generateDeliverable(templateId, deliverableData);

        // Download the generated file
        console.log('\n=== Download Generated File ===');
        const downloadInfo = await downloadDeliverable(deliverable.id, `${deliverable.name}.docx`);

        console.log('\n=== Generation Complete ===');
        console.log('Deliverable generated and download info retrieved successfully');

        return {
            deliverable,
            downloadInfo
        };
    } catch (error) {
        console.error('Generation demonstration failed:', error.message);
        process.exit(1);
    }
}

// Server startup
async function startServer() {
    try {
        await registerRoutes();

        const port = process.env.PORT || 3003;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('🚀 TurboDocx Deliverable Generator Service started');
        console.log(`📡 Server listening on http://${host}:${port}`);
        console.log('\nAvailable endpoints:');
        console.log(`  POST http://${host}:${port}/generate-deliverable`);
        console.log(`  GET  http://${host}:${port}/download-deliverable/:deliverableId`);
        console.log(`  POST http://${host}:${port}/complete-workflow`);
        console.log(`  GET  http://${host}:${port}/health`);
        console.log(`  GET  http://${host}:${port}/generator-info`);

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
        demonstrateGeneration();
    } else {
        // Start server
        startServer();
    }
}

module.exports = {
    generateDeliverable,
    downloadDeliverable,
    createDeliverableData,
    createSimpleVariables,
    demonstrateGeneration,
    startServer,
    fastify
};