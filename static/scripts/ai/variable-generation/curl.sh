#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

##
# AI-Powered Variable Generation Examples
# Generate intelligent content for template variables using AI with optional file attachments
##

# Example 1: Basic AI Variable Generation (no file attachment)
echo "=== Example 1: Basic AI Variable Generation ==="
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Company Overview" \
  -F "placeholder={CompanyOverview}" \
  -F "aiHint=Generate a professional company overview for a technology consulting firm specializing in digital transformation" \
  -F "richTextEnabled=false"

echo -e "\n=== Example 2: AI Generation with Excel File Attachment ==="
# Example 2: AI Variable Generation with Excel File
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "FileResource-e0f12963-10ff-496a-9703-06df14f171af=@financial-report.xlsx" \
  -F "fileResourceMetadata={\"e0f12963-10ff-496a-9703-06df14f171af\":{\"selectedSheet\":\"Q4 Results\",\"hasMultipleSheets\":true,\"dataRange\":\"A1:F50\"}}" \
  -F "name=Financial Performance Summary" \
  -F "placeholder={FinancialSummary}" \
  -F "templateId=quarterly-report-template-123" \
  -F "aiHint=Analyze the Q4 financial data and generate a comprehensive executive summary highlighting revenue growth, profit margins, and key performance indicators" \
  -F "richTextEnabled=true"

echo -e "\n=== Example 3: AI Generation with Word Document ==="
# Example 3: AI Variable Generation with Word Document
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "FileResource-abc12345-def6-789a-bcde-123456789abc=@project-requirements.docx" \
  -F "fileResourceMetadata={\"abc12345-def6-789a-bcde-123456789abc\":{\"contentType\":\"project-document\"}}" \
  -F "name=Project Scope" \
  -F "placeholder={ProjectScope}" \
  -F "templateId=project-proposal-template-456" \
  -F "aiHint=Based on the project requirements document, create a detailed project scope including objectives, deliverables, timeline, and success criteria" \
  -F "richTextEnabled=true"

echo -e "\n=== Example 4: Contract Analysis ==="
# Example 4: Legal Document Analysis
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "FileResource-legal123-456a-789b-cdef-987654321abc=@service-agreement.pdf" \
  -F "fileResourceMetadata={\"legal123-456a-789b-cdef-987654321abc\":{\"contentType\":\"legal-document\"}}" \
  -F "name=Contract Key Terms" \
  -F "placeholder={KeyTerms}" \
  -F "aiHint=Extract and summarize the key terms, payment obligations, contract duration, and important deadlines from this service agreement" \
  -F "richTextEnabled=false"

echo -e "\n=== Example 5: Rich Text Generation ==="
# Example 5: Rich Text Content Generation
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Marketing Campaign Summary" \
  -F "placeholder={CampaignSummary}" \
  -F "templateId=marketing-report-template-789" \
  -F "aiHint=Create a comprehensive marketing campaign summary with bullet points for key metrics, formatted sections for strategy overview, and highlighted call-to-action recommendations" \
  -F "richTextEnabled=true"

echo -e "\n=== Example 6: Data Analysis with CSV ==="
# Example 6: CSV Data Analysis
curl "${BASE_URL}/ai/generate/variable/one" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "x-rapiddocx-org-id: ${ORG_ID}" \
  -H "User-Agent: TurboDocx AI Client" \
  -H "Content-Type: multipart/form-data" \
  -F "FileResource-data789-abc1-2345-6def-abcdef123456=@sales-data.csv" \
  -F "fileResourceMetadata={\"data789-abc1-2345-6def-abcdef123456\":{\"contentType\":\"sales-data\",\"hasHeaders\":true}}" \
  -F "name=Sales Performance Analysis" \
  -F "placeholder={SalesAnalysis}" \
  -F "aiHint=Analyze the sales data to identify top-performing products, seasonal trends, and growth opportunities. Provide actionable insights for sales strategy" \
  -F "richTextEnabled=true"

echo -e "\n=== AI Variable Generation Examples Complete ==="
echo "All examples demonstrate different aspects of AI-powered variable generation:"
echo "1. Basic text generation without file attachments"
echo "2. Excel spreadsheet analysis with sheet selection"
echo "3. Word document content extraction"
echo "4. Legal document term extraction"
echo "5. Rich text formatting for presentation"
echo "6. CSV data analysis and insights"