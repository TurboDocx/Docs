const fastify = require('fastify')({ logger: true });
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * AI-Powered Variable Generation Service
 */
class AIVariableService {
    constructor(apiToken, orgId, baseUrl = BASE_URL) {
        this.apiToken = apiToken;
        this.orgId = orgId;
        this.baseUrl = baseUrl;
    }

    /**
     * Generate AI-powered variable content with optional file attachment
     */
    async generateVariable(options) {
        const {
            file,
            fileMetadata,
            name,
            placeholder,
            templateId,
            aiHint,
            richTextEnabled = false
        } = options;

        const form = new FormData();

        // Add file if provided
        if (file) {
            const fileUuid = uuidv4();
            const fileBuffer = await file.toBuffer();

            form.append(`FileResource-${fileUuid}`, fileBuffer, {
                filename: file.filename,
                contentType: this.getContentType(file.filename)
            });

            // Add file metadata
            const metadata = {
                [fileUuid]: {
                    selectedSheet: fileMetadata?.selectedSheet || "Sheet1",
                    hasMultipleSheets: fileMetadata?.hasMultipleSheets || false,
                    contentType: fileMetadata?.contentType || "document",
                    dataRange: fileMetadata?.dataRange,
                    hasHeaders: fileMetadata?.hasHeaders
                }
            };
            form.append('fileResourceMetadata', JSON.stringify(metadata));
        }

        // Add variable parameters
        form.append('name', name);
        form.append('placeholder', placeholder);
        form.append('aiHint', aiHint);
        form.append('richTextEnabled', richTextEnabled.toString());

        if (templateId) {
            form.append('templateId', templateId);
        }

        try {
            console.log(`Generating AI variable: ${name}`);
            console.log(`AI Hint: ${aiHint.substring(0, 100)}...`);

            const response = await axios.post(`${this.baseUrl}/ai/generate/variable/one`, form, {
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'x-rapiddocx-org-id': this.orgId,
                    'User-Agent': 'TurboDocx AI Client',
                    ...form.getHeaders()
                }
            });

            console.log('✅ AI Variable generated successfully!');
            console.log(`Content Type: ${response.data.data.mimeType}`);
            console.log(`Generated Content: ${response.data.data.text.substring(0, 100)}...`);

            return response.data;

        } catch (error) {
            console.error('❌ AI Variable generation failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get content type based on file extension
     */
    getContentType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        const contentTypes = {
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'pdf': 'application/pdf',
            'csv': 'text/csv',
            'txt': 'text/plain',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg'
        };
        return contentTypes[ext] || 'application/octet-stream';
    }
}

// Initialize service
const aiService = new AIVariableService(API_TOKEN, ORG_ID);

// Register multipart content parsing
fastify.register(require('@fastify/multipart'));

// Routes

/**
 * Generate AI variable without file attachment
 */
fastify.post('/ai/generate-basic', async (request, reply) => {
    try {
        const { name, placeholder, aiHint, templateId, richTextEnabled } = request.body;

        if (!name || !placeholder || !aiHint) {
            return reply.code(400).send({
                error: 'Missing required fields: name, placeholder, aiHint'
            });
        }

        const result = await aiService.generateVariable({
            name,
            placeholder,
            aiHint,
            templateId,
            richTextEnabled: richTextEnabled === 'true' || richTextEnabled === true
        });

        reply.send({
            success: true,
            message: 'AI variable generated successfully',
            data: result
        });

    } catch (error) {
        fastify.log.error('Error in basic generation:', error);
        reply.code(500).send({
            error: 'AI variable generation failed',
            message: error.message
        });
    }
});

/**
 * Generate AI variable with file attachment
 */
fastify.post('/ai/generate-with-file', async (request, reply) => {
    try {
        const parts = request.parts();
        let file = null;
        let fileMetadata = {};
        let name, placeholder, aiHint, templateId, richTextEnabled;

        // Process multipart data
        for await (const part of parts) {
            if (part.file) {
                file = part;
            } else {
                const value = part.value;
                switch (part.fieldname) {
                    case 'name':
                        name = value;
                        break;
                    case 'placeholder':
                        placeholder = value;
                        break;
                    case 'aiHint':
                        aiHint = value;
                        break;
                    case 'templateId':
                        templateId = value;
                        break;
                    case 'richTextEnabled':
                        richTextEnabled = value;
                        break;
                    case 'fileMetadata':
                        try {
                            fileMetadata = JSON.parse(value);
                        } catch (e) {
                            fastify.log.warn('Invalid file metadata JSON, using defaults');
                        }
                        break;
                }
            }
        }

        if (!name || !placeholder || !aiHint) {
            return reply.code(400).send({
                error: 'Missing required fields: name, placeholder, aiHint'
            });
        }

        const result = await aiService.generateVariable({
            file,
            fileMetadata,
            name,
            placeholder,
            aiHint,
            templateId,
            richTextEnabled: richTextEnabled === 'true' || richTextEnabled === true
        });

        reply.send({
            success: true,
            message: 'AI variable generated successfully with file',
            data: result
        });

    } catch (error) {
        fastify.log.error('Error in file-based generation:', error);
        reply.code(500).send({
            error: 'AI variable generation with file failed',
            message: error.message
        });
    }
});

/**
 * Batch AI variable generation
 */
fastify.post('/ai/generate-batch', async (request, reply) => {
    try {
        const parts = request.parts();
        let file = null;
        let fileMetadata = {};
        let variables;

        // Process multipart data
        for await (const part of parts) {
            if (part.file) {
                file = part;
            } else {
                const value = part.value;
                switch (part.fieldname) {
                    case 'variables':
                        try {
                            variables = JSON.parse(value);
                        } catch (e) {
                            return reply.code(400).send({
                                error: 'Invalid variables JSON format'
                            });
                        }
                        break;
                    case 'fileMetadata':
                        try {
                            fileMetadata = JSON.parse(value);
                        } catch (e) {
                            fastify.log.warn('Invalid file metadata JSON, using defaults');
                        }
                        break;
                }
            }
        }

        if (!variables || !Array.isArray(variables)) {
            return reply.code(400).send({
                error: 'Missing or invalid variables array'
            });
        }

        const results = [];
        for (const variable of variables) {
            try {
                const result = await aiService.generateVariable({
                    file,
                    fileMetadata,
                    name: variable.name,
                    placeholder: variable.placeholder,
                    aiHint: variable.aiHint,
                    templateId: variable.templateId,
                    richTextEnabled: variable.richTextEnabled || false
                });
                results.push({ success: true, variable: variable.name, data: result });
            } catch (error) {
                results.push({ success: false, variable: variable.name, error: error.message });
            }
        }

        reply.send({
            success: true,
            message: 'Batch AI variable generation completed',
            results: results
        });

    } catch (error) {
        fastify.log.error('Error in batch generation:', error);
        reply.code(500).send({
            error: 'Batch AI variable generation failed',
            message: error.message
        });
    }
});

/**
 * Complete workflow: AI generation + template integration
 */
fastify.post('/ai/complete-workflow', async (request, reply) => {
    try {
        const parts = request.parts();
        let file = null;
        let fileMetadata = {};
        let templateId, aiHint, variableName, placeholder;

        // Process multipart data
        for await (const part of parts) {
            if (part.file) {
                file = part;
            } else {
                const value = part.value;
                switch (part.fieldname) {
                    case 'templateId':
                        templateId = value;
                        break;
                    case 'aiHint':
                        aiHint = value;
                        break;
                    case 'variableName':
                        variableName = value;
                        break;
                    case 'placeholder':
                        placeholder = value;
                        break;
                    case 'fileMetadata':
                        try {
                            fileMetadata = JSON.parse(value);
                        } catch (e) {
                            fastify.log.warn('Invalid file metadata JSON, using defaults');
                        }
                        break;
                }
            }
        }

        if (!variableName || !placeholder || !aiHint) {
            return reply.code(400).send({
                error: 'Missing required fields: variableName, placeholder, aiHint'
            });
        }

        // Step 1: Generate AI content
        const aiResult = await aiService.generateVariable({
            file,
            fileMetadata,
            name: variableName,
            placeholder,
            aiHint,
            templateId,
            richTextEnabled: true
        });

        // Step 2: Prepare template variables
        const templateVariables = [{
            name: variableName,
            placeholder: placeholder,
            text: aiResult.data.text,
            mimeType: aiResult.data.mimeType,
            allowRichTextInjection: aiResult.data.mimeType === 'html' ? 1 : 0
        }];

        reply.send({
            success: true,
            message: 'Complete AI workflow executed successfully',
            data: {
                aiContent: aiResult,
                templateVariables: templateVariables,
                summary: {
                    variableName: variableName,
                    contentType: aiResult.data.mimeType,
                    contentLength: aiResult.data.text.length
                }
            }
        });

    } catch (error) {
        fastify.log.error('Error in complete workflow:', error);
        reply.code(500).send({
            error: 'Complete AI workflow failed',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 */
fastify.get('/health', async (request, reply) => {
    reply.send({
        status: 'healthy',
        service: 'ai-variable-generation',
        timestamp: new Date().toISOString()
    });
});

/**
 * Service information endpoint
 */
fastify.get('/ai/info', async (request, reply) => {
    reply.send({
        service: 'TurboDocx AI Variable Generation Service (Fastify)',
        endpoints: {
            'POST /ai/generate-basic': 'Generate AI variable without file attachment',
            'POST /ai/generate-with-file': 'Generate AI variable with file attachment',
            'POST /ai/generate-batch': 'Batch generate multiple AI variables',
            'POST /ai/complete-workflow': 'Complete AI generation and template integration',
            'GET /health': 'Service health check',
            'GET /ai/info': 'Service information',
            'GET /ai/examples': 'Usage examples'
        },
        configuration: {
            baseUrl: BASE_URL,
            hasToken: !!API_TOKEN && API_TOKEN !== 'YOUR_API_TOKEN',
            hasOrgId: !!ORG_ID && ORG_ID !== 'YOUR_ORGANIZATION_ID'
        },
        supportedFileTypes: [
            'Excel (.xlsx, .xls)',
            'Word (.docx, .doc)',
            'PDF (.pdf)',
            'CSV (.csv)',
            'Text (.txt)',
            'Images (.png, .jpg, .jpeg)'
        ]
    });
});

/**
 * Example usage endpoint
 */
fastify.get('/ai/examples', async (request, reply) => {
    reply.send({
        examples: [
            {
                name: 'Basic Generation',
                endpoint: 'POST /ai/generate-basic',
                payload: {
                    name: 'Company Overview',
                    placeholder: '{CompanyOverview}',
                    aiHint: 'Generate a professional company overview for a technology consulting firm',
                    richTextEnabled: false
                }
            },
            {
                name: 'Excel Analysis',
                endpoint: 'POST /ai/generate-with-file',
                description: 'Upload Excel file with form data fields',
                formFields: {
                    name: 'Financial Summary',
                    placeholder: '{FinancialSummary}',
                    aiHint: 'Analyze Q4 financial data and generate executive summary',
                    fileMetadata: '{"selectedSheet":"Q4 Results","hasMultipleSheets":true}',
                    richTextEnabled: 'true',
                    file: '[Excel file binary data]'
                }
            },
            {
                name: 'Batch Generation',
                endpoint: 'POST /ai/generate-batch',
                description: 'Generate multiple variables from single file',
                formFields: {
                    variables: JSON.stringify([
                        {
                            name: 'Executive Summary',
                            placeholder: '{ExecutiveSummary}',
                            aiHint: 'Create high-level executive summary'
                        },
                        {
                            name: 'Key Metrics',
                            placeholder: '{KeyMetrics}',
                            aiHint: 'Extract important KPIs and metrics'
                        }
                    ]),
                    fileMetadata: '{"contentType":"business-data"}',
                    file: '[Data file binary data]'
                }
            },
            {
                name: 'Complete Workflow',
                endpoint: 'POST /ai/complete-workflow',
                description: 'AI generation with template integration',
                formFields: {
                    variableName: 'Business Analysis',
                    placeholder: '{BusinessAnalysis}',
                    aiHint: 'Generate comprehensive business analysis with recommendations',
                    templateId: 'template-123',
                    fileMetadata: '{"selectedSheet":"Data"}',
                    file: '[Business data file]'
                }
            }
        ],
        curlExamples: [
            {
                name: 'Basic Generation',
                curl: `curl -X POST http://localhost:3001/ai/generate-basic \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Company Overview",
    "placeholder": "{CompanyOverview}",
    "aiHint": "Generate a professional company overview",
    "richTextEnabled": false
  }'`
            },
            {
                name: 'File Upload',
                curl: `curl -X POST http://localhost:3001/ai/generate-with-file \\
  -F "name=Financial Summary" \\
  -F "placeholder={FinancialSummary}" \\
  -F "aiHint=Analyze financial data" \\
  -F "richTextEnabled=true" \\
  -F "fileMetadata={\\"selectedSheet\\":\\"Q4 Results\\"}" \\
  -F "file=@financial-data.xlsx"`
            }
        ]
    });
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
const start = async () => {
    try {
        const port = process.env.PORT || 3001;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log('🤖 TurboDocx AI Variable Generation Service (Fastify) started');
        console.log(`📡 Server listening on http://${host}:${port}`);
        console.log('\nAvailable endpoints:');
        console.log(`  POST http://${host}:${port}/ai/generate-basic`);
        console.log(`  POST http://${host}:${port}/ai/generate-with-file`);
        console.log(`  POST http://${host}:${port}/ai/generate-batch`);
        console.log(`  POST http://${host}:${port}/ai/complete-workflow`);
        console.log(`  GET  http://${host}:${port}/health`);
        console.log(`  GET  http://${host}:${port}/ai/info`);
        console.log(`  GET  http://${host}:${port}/ai/examples`);

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Check if this file is being run directly
if (require.main === module) {
    start();
}

module.exports = fastify;