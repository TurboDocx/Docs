---
title: AI-Powered Variable Generation API
sidebar_position: 1
description: Complete guide for AI-powered variable generation API with file attachments, context-aware content creation, and intelligent data extraction from documents.
keywords:
  - ai variable generation
  - ai content generation api
  - intelligent variable creation
  - ai document processing
  - file attachment api
  - context-aware ai
  - ai prompt engineering
  - variable automation
  - ai api integration
  - document intelligence
  - smart content generation
  - ai-powered templates
  - turbodocx ai api
---

import ScriptLoader from '@site/src/components/ScriptLoader';

# AI-Powered Variable Generation API

Transform your document workflows with intelligent, context-aware variable generation. This API leverages advanced AI to automatically create rich, relevant content for your template variables by analyzing uploaded files, understanding context, and generating human-quality text based on your specific prompts.

![Template Generation API Integration Overview](/img/ai/ai.webp)

## Overview

The AI Variable Generation API represents the cutting edge of document automation, enabling you to:

- **Generate Intelligent Content**: Create contextually relevant variable content using AI
- **Process File Attachments**: Extract insights from Excel, Word, PDF, and other document formats
- **Context-Aware Generation**: Leverage template context for more accurate content creation
- **Rich Text Support**: Generate formatted content with HTML, markdown, or plain text
- **Smart Data Extraction**: Automatically parse and understand structured data from spreadsheets

### Key Capabilities

- 🧠 **AI-Powered Content Creation**: Advanced language models generate human-quality content
- 📎 **File Attachment Processing**: Upload and analyze documents for context-driven generation
- 📊 **Spreadsheet Intelligence**: Select specific sheets and extract relevant data automatically
- 🎯 **Context Integration**: Use existing templates to inform and guide content generation
- ✨ **Rich Text Generation**: Create formatted content with styling and structure
- 🔧 **Customizable Prompts**: Fine-tune AI behavior with specific instructions and hints

## How It Works

The AI Variable Generation process follows a simple but powerful workflow:

1. **Upload Context Files** - Attach documents (Excel, Word, PDF) that contain relevant data
2. **Define Variable Parameters** - Specify the variable name, placeholder, and generation context
3. **Craft AI Prompts** - Provide specific instructions to guide content generation
4. **Generate Content** - AI analyzes files and context to create intelligent variable content
5. **Integrate Results** - Use generated content directly in your template workflows

<!-- ![AI Variable Generation Workflow](/img/ai-variable-generation/workflow.png) -->

## TLDR; Quick Example 🚀

Ready to jump in? Here are complete working examples in multiple programming languages:

<ScriptLoader
  scriptPath="ai/variable-generation"
  id="ai-variable-generation-examples"
  label="AI Variable Generation Examples"
/>

**Response:**

```json
{
  "data": {
    "mimeType": "html",
    "text": "<p><strong>Q4 Performance Summary:</strong> Our organization achieved exceptional results in Q4 2024, with revenue growing 23% year-over-year to $4.2M. Key highlights include improved operational efficiency, successful product launches, and strong market penetration in target segments.</p>"
  }
}
```

Now let's dive into the complete implementation guide...

## Prerequisites

Before you begin generating AI-powered variables, ensure you have:

- **API Access Token**: Bearer token for authentication
- **Organization ID**: Your organization identifier
- **Template Context** (Optional): Existing template ID for enhanced context
- **Source Files** (Optional): Documents containing data for AI analysis

### Getting Your Credentials

1. **Login to TurboDocx**: Visit [https://www.turbodocx.com](https://www.turbodocx.com)
2. **Navigate to Settings**: Access your organization settings
3. **API Keys Section**: Generate or retrieve your API access token
4. **Organization ID**: Copy your organization ID from the settings

![Template API Credentials](/img/turbosign/api/api-key.png)
![Organization ID Location](/img/turbosign/api/org-id.png)

### Supported File Types

The AI Variable Generation API supports a wide range of file formats:

| File Type         | Extensions              | Use Cases                                       |
| ----------------- | ----------------------- | ----------------------------------------------- |
| **Spreadsheets**  | `.xlsx`, `.xls`, `.csv` | Financial data, reports, lists, structured data |
| **Documents**     | `.docx`, `.doc`, `.pdf` | Contracts, reports, proposals, text content     |
| **Presentations** | `.pptx`, `.ppt`         | Slide content, presentations, visual data       |
| **Images**        | `.png`, `.jpg`, `.jpeg` | Charts, diagrams, visual content analysis       |
| **Text Files**    | `.txt`, `.md`           | Plain text, documentation, notes                |

## Authentication

All AI Variable Generation API requests require authentication using a Bearer token:

```http
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx AI Client
```

## API Reference

### Generate Single Variable

Create AI-powered content for a single template variable with optional file attachments.

#### Endpoint

```http
POST https://api.turbodocx.com/ai/generate/variable/one
```

#### Headers

```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_TOKEN
x-rapiddocx-org-id: YOUR_ORGANIZATION_ID
User-Agent: TurboDocx AI Client
```

#### Request Body (Form Data)

The request uses multipart form data to support file uploads alongside variable parameters:

```javascript
{
  // File attachment (optional)
  "FileResource-{uuid}": [BINARY_FILE_DATA],

  // File metadata (required if file attached)
  "fileResourceMetadata": "{\"file-uuid\":{\"selectedSheet\":\"Sheet1\",\"hasMultipleSheets\":true}}",

  // Variable definition
  "name": "Company Performance Summary",
  "placeholder": "{PerformanceSummary}",

  // Context and guidance
  "templateId": "template-abc123", // Optional: for context
  "aiHint": "Generate a professional summary of company performance",

  // Output settings
  "richTextEnabled": "true" // or "false"
}
```

#### Request Parameters

| Parameter              | Type   | Required    | Description                                          |
| ---------------------- | ------ | ----------- | ---------------------------------------------------- |
| `FileResource-{uuid}`  | file   | No          | Binary file data for AI analysis                     |
| `fileResourceMetadata` | string | Conditional | JSON metadata for attached files                     |
| `name`                 | string | Yes         | Display name for the variable                        |
| `placeholder`          | string | Yes         | Template placeholder (e.g., `{VariableName}`)        |
| `templateId`           | string | No          | Template ID for context-aware generation             |
| `aiHint`               | string | Yes         | Instructions for AI content generation               |
| `richTextEnabled`      | string | No          | Enable HTML/rich text output (`"true"` or `"false"`) |

#### File Metadata Structure

When attaching files, provide metadata to guide AI processing:

```json
{
  "file-uuid-here": {
    "selectedSheet": "Q4 Results", // For spreadsheets: specific sheet
    "hasMultipleSheets": true, // Whether file has multiple sheets
    "dataRange": "A1:D100", // Optional: specific cell range
    "contentType": "financial-data" // Optional: content classification
  }
}
```

#### Response

```json
{
  "data": {
    "mimeType": "text|html|markdown",
    "text": "Generated variable content based on AI analysis"
  }
}
```

#### Response Fields

| Field           | Type   | Description                                 |
| --------------- | ------ | ------------------------------------------- |
| `data.mimeType` | string | Content format (`text`, `html`, `markdown`) |
| `data.text`     | string | Generated variable content                  |

## Advanced Features

### File Attachment Workflows

#### Excel/Spreadsheet Processing

When working with spreadsheets, the AI can analyze specific sheets and data ranges:

```bash
# Example: Financial data analysis
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-fin123=@quarterly-financials.xlsx' \
  -F 'fileResourceMetadata={"fin123":{"selectedSheet":"Income Statement","hasMultipleSheets":true,"dataRange":"A1:F50"}}' \
  -F 'name=Revenue Analysis' \
  -F 'placeholder={RevenueAnalysis}' \
  -F 'aiHint=Analyze the quarterly revenue trends and provide insights on growth patterns, highlighting key metrics and year-over-year changes' \
  -F 'richTextEnabled=true'
```

#### Document Content Extraction

For text documents, the AI can extract and synthesize key information:

```bash
# Example: Contract analysis
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-doc456=@contract-draft.docx' \
  -F 'fileResourceMetadata={"doc456":{"contentType":"legal-document"}}' \
  -F 'name=Contract Key Terms' \
  -F 'placeholder={KeyTerms}' \
  -F 'aiHint=Extract and summarize the key terms, obligations, and important dates from this contract document' \
  -F 'richTextEnabled=false'
```

### Context-Aware Generation

Leverage existing template context for more accurate content generation:

```bash
# Using template context
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'name=Project Scope Description' \
  -F 'placeholder={ProjectScope}' \
  -F 'templateId=project-template-789' \
  -F 'aiHint=Generate a detailed project scope description that aligns with the project template structure and includes deliverables, timeline, and success criteria' \
  -F 'richTextEnabled=true'
```

### Rich Text Generation

Enable rich text for formatted output with HTML styling:

```bash
# Rich text example
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'name=Executive Summary' \
  -F 'placeholder={ExecutiveSummary}' \
  -F 'aiHint=Create a comprehensive executive summary with bullet points, key metrics, and strategic recommendations formatted for presentation' \
  -F 'richTextEnabled=true'
```

**Rich Text Response Example:**

```json
{
  "data": {
    "mimeType": "html",
    "text": "<h3>Executive Summary</h3><p><strong>Overview:</strong> Q4 2024 delivered exceptional results across all key performance indicators.</p><ul><li><strong>Revenue Growth:</strong> 23% increase year-over-year</li><li><strong>Market Expansion:</strong> Successfully entered 3 new geographic markets</li><li><strong>Operational Efficiency:</strong> 15% improvement in cost optimization</li></ul><p><em>Strategic Recommendations:</em> Continue aggressive growth strategy while maintaining operational excellence.</p>"
  }
}
```

## Code Examples

### Complete Implementation Examples

<ScriptLoader
  scriptPath="ai/variable-generation"
  id="ai-variable-generation-examples"
  label="AI Variable Generation - Complete Examples"
/>

## Use Cases & Examples

### 1. Financial Report Analysis

**Scenario**: Generate executive summaries from quarterly financial spreadsheets

```bash
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-12345=@Q4-financials.xlsx' \
  -F 'fileResourceMetadata={"12345":{"selectedSheet":"Summary","hasMultipleSheets":true}}' \
  -F 'name=Financial Performance Summary' \
  -F 'placeholder={FinancialSummary}' \
  -F 'aiHint=Create a concise executive summary highlighting revenue growth, profit margins, and key financial metrics from the Q4 data' \
  -F 'richTextEnabled=true'
```

### 2. Contract Key Terms Extraction

**Scenario**: Extract important terms and dates from legal documents

```bash
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-67890=@service-agreement.pdf' \
  -F 'name=Contract Terms' \
  -F 'placeholder={ContractTerms}' \
  -F 'aiHint=Extract contract duration, payment terms, key obligations, and important deadlines in a structured format' \
  -F 'richTextEnabled=false'
```

### 3. Project Proposal Generation

**Scenario**: Create project descriptions based on scope documents

```bash
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-abcde=@project-requirements.docx' \
  -F 'name=Project Description' \
  -F 'placeholder={ProjectDescription}' \
  -F 'templateId=proposal-template-123' \
  -F 'aiHint=Generate a professional project description including objectives, deliverables, timeline, and success criteria based on the requirements document' \
  -F 'richTextEnabled=true'
```

### 4. Data-Driven Insights

**Scenario**: Generate insights from research data and surveys

```bash
curl 'https://api.turbodocx.com/ai/generate/variable/one' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'x-rapiddocx-org-id: YOUR_ORG_ID' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FileResource-xyz789=@market-research.xlsx' \
  -F 'fileResourceMetadata={"xyz789":{"selectedSheet":"Survey Results","hasMultipleSheets":true}}' \
  -F 'name=Market Insights' \
  -F 'placeholder={MarketInsights}' \
  -F 'aiHint=Analyze the survey data and generate key market insights, trends, and actionable recommendations for product strategy' \
  -F 'richTextEnabled=true'
```

## AI Prompt Engineering

### Writing Effective AI Hints

The quality of generated content depends heavily on your AI prompts. Follow these best practices:

#### ✅ Do: Be Specific and Clear

```bash
# Good prompt
'aiHint=Generate a professional project timeline with 5 key milestones, including dates, deliverables, and success criteria for a 6-month software development project'

# Poor prompt
'aiHint=make a timeline'
```

#### ✅ Do: Provide Context and Format Requirements

```bash
# Good prompt
'aiHint=Create an executive summary in bullet point format highlighting Q4 revenue (target: $2M), customer acquisition metrics, and year-over-year growth percentages'

# Poor prompt
'aiHint=summarize the data'
```

#### ✅ Do: Specify Tone and Audience

```bash
# Good prompt
'aiHint=Write a formal, executive-level summary suitable for board presentation, focusing on strategic implications and ROI metrics'

# Poor prompt
'aiHint=write a summary'
```

### Advanced Prompt Techniques

#### 1. Role-Based Prompts

```bash
'aiHint=Acting as a senior financial analyst, review the quarterly data and provide insights on revenue trends, cost optimization opportunities, and market positioning recommendations'
```

#### 2. Structured Output Prompts

```bash
'aiHint=Generate a risk assessment with three sections: 1) High-priority risks with mitigation strategies, 2) Medium-priority risks with monitoring plans, 3) Risk summary and overall assessment'
```

#### 3. Data-Driven Prompts

```bash
'aiHint=Based on the attached sales data, calculate month-over-month growth rates, identify top-performing products, and recommend strategies for underperforming segments'
```

## Best Practices

### File Preparation

#### Excel/Spreadsheet Files

- **Clean Data**: Remove empty rows, merged cells, and formatting inconsistencies
- **Clear Headers**: Use descriptive column headers in the first row
- **Consistent Formatting**: Use consistent date formats, number formats, and text casing
- **Specific Sheets**: Select the most relevant sheet containing the target data

#### Document Files

- **Clear Structure**: Use headings, bullet points, and logical organization
- **Relevant Content**: Include only content relevant to the AI task
- **Text Format**: Ensure text is selectable (not embedded images)
- **File Size**: Keep files under 25MB for optimal processing

### Performance Optimization

#### Efficient File Usage

```bash
# Good: Specific sheet selection
'fileResourceMetadata={"uuid":{"selectedSheet":"Revenue Data","dataRange":"A1:E100"}}'

# Poor: Processing entire workbook
'fileResourceMetadata={"uuid":{"hasMultipleSheets":true}}'
```

#### Smart Prompting

```bash
# Good: Specific, actionable prompt
'aiHint=Extract the top 5 revenue-generating products from the sales data and provide a brief analysis of their performance trends'

# Poor: Vague prompt
'aiHint=tell me about the sales'
```

### Error Handling

#### File Processing Errors

- **Check File Format**: Ensure files are in supported formats
- **Verify File Size**: Keep attachments under the size limit
- **Test File Access**: Ensure files are not corrupted or password-protected

#### AI Generation Errors

- **Simplify Prompts**: Break complex requests into smaller, specific tasks
- **Provide Context**: Include relevant background information in prompts
- **Iterate and Refine**: Test prompts and refine based on output quality

### Security Considerations

#### Data Privacy

- **Sensitive Information**: Review files for confidential data before upload
- **Access Controls**: Ensure proper API token management and access restrictions
- **Data Retention**: Understand how uploaded files are processed and stored

#### API Security

- **Token Protection**: Store API tokens securely in environment variables
- **HTTPS Only**: Always use HTTPS for API communication
- **Rate Limiting**: Implement appropriate rate limiting for production use

## Error Handling & Troubleshooting

### Common HTTP Status Codes

| Status Code | Description           | Solution                                                    |
| ----------- | --------------------- | ----------------------------------------------------------- |
| `200`       | Success               | Request completed successfully                              |
| `400`       | Bad Request           | Check request format, file attachments, and required fields |
| `401`       | Unauthorized          | Verify API token and authentication headers                 |
| `403`       | Forbidden             | Check organization ID and API permissions                   |
| `413`       | Payload Too Large     | Reduce file size or compress attachments                    |
| `422`       | Unprocessable Entity  | Validate AI prompt, file metadata, and parameters           |
| `429`       | Too Many Requests     | Implement rate limiting and retry logic                     |
| `500`       | Internal Server Error | Contact support if persistent                               |

### Common Issues

#### File Upload Problems

**Symptoms**: Files not processing or upload errors

**Solutions**:

- Verify file format is supported (Excel, Word, PDF, etc.)
- Check file size is under 25MB
- Ensure file is not corrupted or password-protected
- Validate file metadata JSON format

#### AI Generation Quality Issues

**Symptoms**: Generated content is not relevant or useful

**Solutions**:

- Provide more specific and detailed AI prompts
- Include relevant context in the aiHint parameter
- Use templateId for additional context
- Break complex requests into smaller, focused tasks

#### Context Recognition Problems

**Symptoms**: AI not understanding file content correctly

**Solutions**:

- Use selectedSheet parameter for Excel files
- Specify relevant data ranges in file metadata
- Ensure file content is clearly structured
- Provide additional context in AI prompts

### Debugging Tips

1. **Start Simple**: Test with basic prompts before adding complexity
2. **Validate Files**: Ensure uploaded files are properly formatted and accessible
3. **Check Metadata**: Verify file metadata JSON is properly structured
4. **Monitor Responses**: Review mimeType and content format in responses
5. **Iterate Prompts**: Refine AI hints based on output quality

## Integration Patterns

### Template Workflow Integration

Combine AI variable generation with template processing for complete automation:

```javascript
// 1. Generate AI content
const aiResponse = await generateAIVariable({
  file: "financial-data.xlsx",
  aiHint: "Generate Q4 performance summary",
  richText: true,
});

// 2. Use in template generation
const templateData = {
  templateId: "quarterly-report-template",
  variables: [
    {
      name: "Q4 Performance",
      placeholder: "{Q4Performance}",
      text: aiResponse.data.text,
      mimeType: aiResponse.data.mimeType,
    },
  ],
};

// 3. Generate final document
const deliverable = await generateDeliverable(templateData);
```

### Batch Processing Pattern

Process multiple variables with AI for comprehensive content generation:

```javascript
const aiVariables = [
  { name: "Executive Summary", hint: "Create executive summary" },
  { name: "Financial Analysis", hint: "Analyze financial metrics" },
  { name: "Market Insights", hint: "Generate market insights" },
];

const generatedContent = await Promise.all(
  aiVariables.map((variable) =>
    generateAIVariable({
      file: "company-data.xlsx",
      aiHint: variable.hint,
      name: variable.name,
    })
  )
);
```

## Next Steps

### Advanced AI Features to Explore

📖 **[Template Generation API →](/docs/TurboDocx%20Templating/API%20Templates)**
📖 **[Webhook Integration →](/docs/Webhooks/webhook-configuration)**
📖 **[Bulk Processing →](/docs/Templates/bulk-generation)**
📖 **[API Authentication →](/docs/API/turbodocx-api-documentation)**

### Related Documentation

- [Template Management Guide](/docs/Templates/template-management)
- [Variable Types and Formatting](/docs/Templates/variable-types)
- [Integration Examples](/docs/Integrations)
- [Best Practices Guide](/docs/Templates/best-practices)

## Support

Need help with AI-powered variable generation? We're here to help:

- **Discord Community**: [Join our Discord server](https://discord.gg/NYKwz4BcpX) for real-time support
- **Documentation**: [https://docs.turbodocx.com](https://docs.turbodocx.com)
- **AI Examples**: Browse our example gallery for inspiration

---

Ready to revolutionize your document workflows with AI-powered content generation? Start creating intelligent, context-aware variables that transform how you build documents! 🤖✨
