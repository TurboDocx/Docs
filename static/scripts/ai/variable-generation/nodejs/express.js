const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(express.static('public'));

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
            form.append(`FileResource-${fileUuid}`, fs.createReadStream(file.path), {
                filename: file.originalname,
                contentType: this.getContentType(file.originalname)
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

            // Clean up uploaded file
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return response.data;

        } catch (error) {
            console.error('❌ AI Variable generation failed:', error.response?.data || error.message);

            // Clean up on error
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

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

// Routes

/**
 * Generate AI variable without file attachment
 */
app.post('/ai/generate-basic', async (req, res) => {
    try {
        const { name, placeholder, aiHint, templateId, richTextEnabled } = req.body;

        if (!name || !placeholder || !aiHint) {
            return res.status(400).json({
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

        res.json({
            success: true,
            message: 'AI variable generated successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in basic generation:', error);
        res.status(500).json({
            error: 'AI variable generation failed',
            message: error.message
        });
    }
});

/**
 * Generate AI variable with file attachment
 */
app.post('/ai/generate-with-file', upload.single('file'), async (req, res) => {
    try {
        const { name, placeholder, aiHint, templateId, richTextEnabled } = req.body;
        const file = req.file;

        if (!name || !placeholder || !aiHint) {
            return res.status(400).json({
                error: 'Missing required fields: name, placeholder, aiHint'
            });
        }

        // Parse file metadata if provided
        let fileMetadata = {};
        if (req.body.fileMetadata) {
            try {
                fileMetadata = JSON.parse(req.body.fileMetadata);
            } catch (e) {
                console.warn('Invalid file metadata JSON, using defaults');
            }
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

        res.json({
            success: true,
            message: 'AI variable generated successfully with file',
            data: result
        });

    } catch (error) {
        console.error('Error in file-based generation:', error);
        res.status(500).json({
            error: 'AI variable generation with file failed',
            message: error.message
        });
    }
});

/**
 * Batch AI variable generation
 */
app.post('/ai/generate-batch', upload.single('file'), async (req, res) => {
    try {
        const { variables } = req.body;
        const file = req.file;

        if (!variables) {
            return res.status(400).json({
                error: 'Missing variables array'
            });
        }

        const variableList = JSON.parse(variables);

        // Parse file metadata if provided
        let fileMetadata = {};
        if (req.body.fileMetadata) {
            try {
                fileMetadata = JSON.parse(req.body.fileMetadata);
            } catch (e) {
                console.warn('Invalid file metadata JSON, using defaults');
            }
        }

        const results = [];
        for (const variable of variableList) {
            try {
                const result = await aiService.generateVariable({
                    file: file ? { ...file, path: file.path } : null,
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

        res.json({
            success: true,
            message: 'Batch AI variable generation completed',
            results: results
        });

    } catch (error) {
        console.error('Error in batch generation:', error);
        res.status(500).json({
            error: 'Batch AI variable generation failed',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ai-variable-generation',
        timestamp: new Date().toISOString()
    });
});

/**
 * Service information endpoint
 */
app.get('/ai/info', (req, res) => {
    res.json({
        service: 'TurboDocx AI Variable Generation Service',
        endpoints: {
            'POST /ai/generate-basic': 'Generate AI variable without file attachment',
            'POST /ai/generate-with-file': 'Generate AI variable with file attachment',
            'POST /ai/generate-batch': 'Batch generate multiple AI variables',
            'GET /health': 'Service health check',
            'GET /ai/info': 'Service information'
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
app.get('/ai/examples', (req, res) => {
    res.json({
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
                payload: {
                    name: 'Financial Summary',
                    placeholder: '{FinancialSummary}',
                    aiHint: 'Analyze Q4 financial data and generate executive summary',
                    fileMetadata: JSON.stringify({
                        selectedSheet: 'Q4 Results',
                        hasMultipleSheets: true
                    }),
                    richTextEnabled: true
                },
                note: 'Include Excel file in multipart form data'
            },
            {
                name: 'Document Analysis',
                endpoint: 'POST /ai/generate-with-file',
                payload: {
                    name: 'Project Scope',
                    placeholder: '{ProjectScope}',
                    aiHint: 'Extract project scope from requirements document',
                    fileMetadata: JSON.stringify({
                        contentType: 'project-document'
                    }),
                    richTextEnabled: true
                },
                note: 'Include Word/PDF file in multipart form data'
            }
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('🤖 TurboDocx AI Variable Generation Service started');
    console.log(`📡 Server listening on http://localhost:${PORT}`);
    console.log('\nAvailable endpoints:');
    console.log(`  POST http://localhost:${PORT}/ai/generate-basic`);
    console.log(`  POST http://localhost:${PORT}/ai/generate-with-file`);
    console.log(`  POST http://localhost:${PORT}/ai/generate-batch`);
    console.log(`  GET  http://localhost:${PORT}/health`);
    console.log(`  GET  http://localhost:${PORT}/ai/info`);
    console.log(`  GET  http://localhost:${PORT}/ai/examples`);
});

module.exports = app;