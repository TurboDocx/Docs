/**
 * AI-Powered Variable Generation - JavaScript Examples
 * Generate intelligent content for template variables using AI with file attachments
 */

// Configuration - Update these values
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

/**
 * Generate AI-powered variable content with optional file attachment
 */
async function generateAIVariable(options) {
    const {
        file,
        fileMetadata,
        name,
        placeholder,
        templateId,
        aiHint,
        richTextEnabled = false
    } = options;

    // Create FormData for multipart request
    const formData = new FormData();

    // Add file if provided
    if (file) {
        const fileUuid = generateUUID();
        formData.append(`FileResource-${fileUuid}`, file);

        // Add file metadata
        const metadata = {
            [fileUuid]: {
                selectedSheet: fileMetadata?.selectedSheet || "Sheet1",
                hasMultipleSheets: fileMetadata?.hasMultipleSheets || false,
                contentType: fileMetadata?.contentType || "document",
                dataRange: fileMetadata?.dataRange
            }
        };
        formData.append('fileResourceMetadata', JSON.stringify(metadata));
    }

    // Add variable parameters
    formData.append('name', name);
    formData.append('placeholder', placeholder);
    formData.append('aiHint', aiHint);
    formData.append('richTextEnabled', richTextEnabled.toString());

    if (templateId) {
        formData.append('templateId', templateId);
    }

    try {
        const response = await fetch(`${BASE_URL}/ai/generate/variable/one`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'x-rapiddocx-org-id': ORG_ID,
                'User-Agent': 'TurboDocx AI Client'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        console.log('✅ AI Variable generated successfully!');
        console.log(`Variable: ${name}`);
        console.log(`Content Type: ${result.data.mimeType}`);
        console.log(`Generated Content: ${result.data.text.substring(0, 100)}...`);

        return result;

    } catch (error) {
        console.error('❌ AI Variable generation failed:', error.message);
        throw error;
    }
}

/**
 * Generate UUID for file resource identification
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Example 1: Basic AI Variable Generation (no file)
 */
async function example1_BasicGeneration() {
    console.log('=== Example 1: Basic AI Variable Generation ===');

    try {
        const result = await generateAIVariable({
            name: 'Company Overview',
            placeholder: '{CompanyOverview}',
            aiHint: 'Generate a professional company overview for a technology consulting firm specializing in digital transformation and cloud solutions',
            richTextEnabled: false
        });

        console.log('Generated content:', result.data.text);
        return result;

    } catch (error) {
        console.error('Example 1 failed:', error.message);
    }
}

/**
 * Example 2: Excel File Analysis
 */
async function example2_ExcelAnalysis(excelFile) {
    console.log('=== Example 2: Excel File Analysis ===');

    try {
        const result = await generateAIVariable({
            file: excelFile,
            fileMetadata: {
                selectedSheet: 'Q4 Results',
                hasMultipleSheets: true,
                dataRange: 'A1:F50',
                contentType: 'financial-data'
            },
            name: 'Financial Performance Summary',
            placeholder: '{FinancialSummary}',
            templateId: 'quarterly-report-template-123',
            aiHint: 'Analyze the Q4 financial data and generate a comprehensive executive summary highlighting revenue growth, profit margins, key performance indicators, and strategic recommendations',
            richTextEnabled: true
        });

        console.log('Financial analysis generated:', result.data.text);
        return result;

    } catch (error) {
        console.error('Example 2 failed:', error.message);
    }
}

/**
 * Example 3: Word Document Processing
 */
async function example3_DocumentAnalysis(wordFile) {
    console.log('=== Example 3: Word Document Analysis ===');

    try {
        const result = await generateAIVariable({
            file: wordFile,
            fileMetadata: {
                contentType: 'project-document'
            },
            name: 'Project Scope',
            placeholder: '{ProjectScope}',
            templateId: 'project-proposal-template-456',
            aiHint: 'Based on the project requirements document, create a detailed project scope including objectives, key deliverables, timeline milestones, and success criteria',
            richTextEnabled: true
        });

        console.log('Project scope generated:', result.data.text);
        return result;

    } catch (error) {
        console.error('Example 3 failed:', error.message);
    }
}

/**
 * Example 4: Legal Document Analysis
 */
async function example4_LegalAnalysis(pdfFile) {
    console.log('=== Example 4: Legal Document Analysis ===');

    try {
        const result = await generateAIVariable({
            file: pdfFile,
            fileMetadata: {
                contentType: 'legal-document'
            },
            name: 'Contract Key Terms',
            placeholder: '{KeyTerms}',
            aiHint: 'Extract and summarize the key terms, payment obligations, contract duration, termination clauses, and important deadlines from this service agreement',
            richTextEnabled: false
        });

        console.log('Contract analysis generated:', result.data.text);
        return result;

    } catch (error) {
        console.error('Example 4 failed:', error.message);
    }
}

/**
 * Example 5: Rich Text Content Generation
 */
async function example5_RichTextGeneration() {
    console.log('=== Example 5: Rich Text Content Generation ===');

    try {
        const result = await generateAIVariable({
            name: 'Marketing Campaign Summary',
            placeholder: '{CampaignSummary}',
            templateId: 'marketing-report-template-789',
            aiHint: 'Create a comprehensive marketing campaign summary with structured sections: Executive Overview, Key Metrics (with specific numbers), Strategic Insights, and Action Items. Format with appropriate headings and bullet points.',
            richTextEnabled: true
        });

        console.log('Rich text content generated:', result.data.text);
        return result;

    } catch (error) {
        console.error('Example 5 failed:', error.message);
    }
}

/**
 * Example 6: Batch AI Variable Generation
 */
async function example6_BatchGeneration(dataFile) {
    console.log('=== Example 6: Batch AI Variable Generation ===');

    const variables = [
        {
            name: 'Executive Summary',
            placeholder: '{ExecutiveSummary}',
            aiHint: 'Create a high-level executive summary focusing on strategic outcomes and business impact'
        },
        {
            name: 'Key Metrics',
            placeholder: '{KeyMetrics}',
            aiHint: 'Extract and present the most important quantitative metrics and KPIs'
        },
        {
            name: 'Recommendations',
            placeholder: '{Recommendations}',
            aiHint: 'Provide actionable recommendations based on data analysis and insights'
        }
    ];

    try {
        const results = await Promise.all(
            variables.map(variable => generateAIVariable({
                file: dataFile,
                fileMetadata: {
                    contentType: 'business-data',
                    hasHeaders: true
                },
                name: variable.name,
                placeholder: variable.placeholder,
                aiHint: variable.aiHint,
                richTextEnabled: true
            }))
        );

        console.log('Batch generation completed successfully!');
        results.forEach((result, index) => {
            console.log(`${variables[index].name}: ${result.data.text.substring(0, 100)}...`);
        });

        return results;

    } catch (error) {
        console.error('Example 6 failed:', error.message);
    }
}

/**
 * File Upload Helper
 */
function handleFileUpload(inputId, callback) {
    const fileInput = document.getElementById(inputId);

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name} (${file.size} bytes)`);
            callback(file);
        }
    });
}

/**
 * Complete Workflow Integration Example
 */
async function completeWorkflowExample(sourceFile) {
    console.log('=== Complete Workflow: AI + Template Generation ===');

    try {
        // Step 1: Generate AI content
        const aiResult = await generateAIVariable({
            file: sourceFile,
            fileMetadata: {
                selectedSheet: 'Data',
                hasMultipleSheets: true
            },
            name: 'Business Analysis',
            placeholder: '{BusinessAnalysis}',
            aiHint: 'Generate a comprehensive business analysis including market trends, performance metrics, and strategic recommendations',
            richTextEnabled: true
        });

        console.log('AI content generated successfully');

        // Step 2: Use AI content in template (example integration)
        const templateVariables = [
            {
                name: 'Business Analysis',
                placeholder: '{BusinessAnalysis}',
                text: aiResult.data.text,
                mimeType: aiResult.data.mimeType,
                allowRichTextInjection: aiResult.data.mimeType === 'html' ? 1 : 0
            }
        ];

        console.log('Template variables prepared with AI content');

        // Note: This would integrate with the Template Generation API
        // for complete document creation workflow

        return {
            aiContent: aiResult,
            templateVariables: templateVariables
        };

    } catch (error) {
        console.error('Complete workflow failed:', error.message);
        throw error;
    }
}

// Example usage and demonstrations
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('🤖 AI Variable Generation Examples Loaded');
    console.log('Available functions:');
    console.log('- example1_BasicGeneration()');
    console.log('- example2_ExcelAnalysis(file)');
    console.log('- example3_DocumentAnalysis(file)');
    console.log('- example4_LegalAnalysis(file)');
    console.log('- example5_RichTextGeneration()');
    console.log('- example6_BatchGeneration(file)');
    console.log('- completeWorkflowExample(file)');

} else {
    // Node.js environment
    module.exports = {
        generateAIVariable,
        example1_BasicGeneration,
        example2_ExcelAnalysis,
        example3_DocumentAnalysis,
        example4_LegalAnalysis,
        example5_RichTextGeneration,
        example6_BatchGeneration,
        completeWorkflowExample
    };
}