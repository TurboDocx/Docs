#!/bin/bash

# Configuration - Update these values
API_TOKEN="YOUR_API_TOKEN"
ORG_ID="YOUR_ORGANIZATION_ID"
BASE_URL="https://api.turbodocx.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 TurboDocx Template Upload with File Attachment Examples${NC}"
echo "=================================================================="

# Function: Upload template with Excel data file attachment and sheet selection
upload_template_with_data_file() {
    echo -e "\n${YELLOW}📊 Example 1: Template Upload with Single Sheet Data${NC}"
    echo "----------------------------------------------------"

    # Check if required files exist
    TEMPLATE_FILE="./financial-report-template.docx"
    DATA_FILE="./q4-financial-data.xlsx"

    if [ ! -f "$TEMPLATE_FILE" ]; then
        echo -e "${RED}❌ Template file not found: $TEMPLATE_FILE${NC}"
        echo "Please provide a DOCX template file"
        return 1
    fi

    if [ ! -f "$DATA_FILE" ]; then
        echo -e "${RED}❌ Data file not found: $DATA_FILE${NC}"
        echo "Please provide an Excel data file"
        return 1
    fi

    echo "Template: $TEMPLATE_FILE"
    echo "Data Source: $DATA_FILE"
    echo "Selected Sheet: Income Statement"
    echo "Data Range: A1:F50"
    echo ""

    # Generate unique data file ID
    DATA_FILE_ID="curl-data-$RANDOM"

    # Create file metadata JSON
    FILE_METADATA=$(cat <<EOF
{
  "$DATA_FILE_ID": {
    "selectedSheet": "Income Statement",
    "hasMultipleSheets": true,
    "dataRange": "A1:F50",
    "description": "Q4 financial data for AI variable generation"
  }
}
EOF
    )

    # Create variables JSON
    VARIABLES=$(cat <<EOF
[
  {
    "name": "Revenue Summary",
    "placeholder": "{RevenueSummary}",
    "aiHint": "Generate revenue summary from attached financial data",
    "dataSourceId": "$DATA_FILE_ID"
  },
  {
    "name": "Expense Analysis",
    "placeholder": "{ExpenseAnalysis}",
    "aiHint": "Analyze expense trends from Q4 data",
    "dataSourceId": "$DATA_FILE_ID"
  }
]
EOF
    )

    # Create tags JSON
    TAGS='["curl-upload", "financial", "q4", "ai-enhanced", "data-driven"]'

    echo -e "${BLUE}📤 Uploading template with data file...${NC}"

    # Upload to TurboDocx API
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -X POST "$BASE_URL/template/upload-and-create" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "x-rapiddocx-org-id: $ORG_ID" \
        -H "User-Agent: TurboDocx cURL Client" \
        -F "templateFile=@$TEMPLATE_FILE" \
        -F "FileResource-$DATA_FILE_ID=@$DATA_FILE" \
        -F "name=Q4 Financial Report Template (cURL)" \
        -F "description=Financial report template with Excel data integration uploaded via cURL" \
        -F "fileResourceMetadata=$FILE_METADATA" \
        -F "variables=$VARIABLES" \
        -F "tags=$TAGS")

    # Extract HTTP status and response body
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅ Template with data file uploaded successfully!${NC}"

        # Extract key information from response
        TEMPLATE_ID=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.id')
        TEMPLATE_NAME=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.name')
        VARIABLES_COUNT=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.variables | length')
        DEFAULT_FONT=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.defaultFont')
        REDIRECT_URL=$(echo "$RESPONSE_BODY" | jq -r '.data.results.redirectUrl')

        echo "Template ID: $TEMPLATE_ID"
        echo "Template Name: $TEMPLATE_NAME"
        echo "Variables Extracted: $VARIABLES_COUNT"
        echo "Default Font: $DEFAULT_FONT"
        echo "🔗 Redirect URL: $REDIRECT_URL"

        return 0
    else
        echo -e "${RED}❌ Upload failed with HTTP status: $HTTP_STATUS${NC}"
        echo "Response: $RESPONSE_BODY"
        return 1
    fi
}

# Function: Upload template with multiple sheets from the same Excel file
upload_template_with_multiple_sheets() {
    echo -e "\n${YELLOW}📈 Example 2: Template Upload with Multi-Sheet Data${NC}"
    echo "---------------------------------------------------"

    # Check if required files exist
    TEMPLATE_FILE="./comprehensive-report-template.docx"
    DATA_FILE="./business-data.xlsx"

    if [ ! -f "$TEMPLATE_FILE" ]; then
        echo -e "${RED}❌ Template file not found: $TEMPLATE_FILE${NC}"
        echo "Please provide a DOCX template file"
        return 1
    fi

    if [ ! -f "$DATA_FILE" ]; then
        echo -e "${RED}❌ Data file not found: $DATA_FILE${NC}"
        echo "Please provide an Excel data file"
        return 1
    fi

    echo "Template: $TEMPLATE_FILE"
    echo "Data Source: $DATA_FILE"
    echo "Primary Sheet: Summary"
    echo "Alternative Sheets: Revenue, Expenses, Projections"
    echo "Data Range: A1:Z100"
    echo ""

    # Generate unique data file ID
    DATA_FILE_ID="curl-multisheet-$RANDOM"

    # Create file metadata JSON for multiple sheets
    FILE_METADATA=$(cat <<EOF
{
  "$DATA_FILE_ID": {
    "selectedSheet": "Summary",
    "hasMultipleSheets": true,
    "alternativeSheets": ["Revenue", "Expenses", "Projections"],
    "dataRange": "A1:Z100",
    "description": "Comprehensive business data across multiple sheets"
  }
}
EOF
    )

    # Create variables JSON that reference different sheets
    VARIABLES=$(cat <<EOF
[
  {
    "name": "Executive Summary",
    "placeholder": "{ExecutiveSummary}",
    "aiHint": "Create executive summary from Summary sheet data",
    "dataSourceId": "$DATA_FILE_ID",
    "sheetReference": "Summary"
  },
  {
    "name": "Revenue Analysis",
    "placeholder": "{RevenueAnalysis}",
    "aiHint": "Analyze revenue trends from Revenue sheet",
    "dataSourceId": "$DATA_FILE_ID",
    "sheetReference": "Revenue"
  },
  {
    "name": "Expense Insights",
    "placeholder": "{ExpenseInsights}",
    "aiHint": "Generate expense insights from Expenses sheet",
    "dataSourceId": "$DATA_FILE_ID",
    "sheetReference": "Expenses"
  }
]
EOF
    )

    # Create tags JSON
    TAGS='["curl-multi-sheet", "comprehensive", "business-analysis", "data-driven"]'

    echo -e "${BLUE}📤 Uploading multi-sheet template...${NC}"

    # Upload to TurboDocx API
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -X POST "$BASE_URL/template/upload-and-create" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "x-rapiddocx-org-id: $ORG_ID" \
        -H "User-Agent: TurboDocx cURL Client" \
        -F "templateFile=@$TEMPLATE_FILE" \
        -F "FileResource-$DATA_FILE_ID=@$DATA_FILE" \
        -F "name=Comprehensive Business Report (cURL Multi-Sheet)" \
        -F "description=Multi-sheet data analysis template uploaded via cURL" \
        -F "fileResourceMetadata=$FILE_METADATA" \
        -F "variables=$VARIABLES" \
        -F "tags=$TAGS")

    # Extract HTTP status and response body
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅ Multi-sheet template uploaded successfully!${NC}"

        # Extract key information from response
        TEMPLATE_ID=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.id')
        TEMPLATE_NAME=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.name')
        VARIABLES_COUNT=$(echo "$RESPONSE_BODY" | jq -r '.data.results.template.variables | length')

        echo "Template ID: $TEMPLATE_ID"
        echo "Template Name: $TEMPLATE_NAME"
        echo "Variables with Sheet References: $VARIABLES_COUNT"
        echo "Sheets Configured: Summary (primary), Revenue, Expenses, Projections"

        return 0
    else
        echo -e "${RED}❌ Multi-sheet upload failed with HTTP status: $HTTP_STATUS${NC}"
        echo "Response: $RESPONSE_BODY"
        return 1
    fi
}

# Function: Create sample files for testing
create_sample_files() {
    echo -e "\n${YELLOW}📝 Creating sample files for testing...${NC}"

    # Note: These would be actual files in a real scenario
    echo "Note: In a real scenario, you would have:"
    echo "  • financial-report-template.docx - Your Word template file"
    echo "  • q4-financial-data.xlsx - Excel file with financial data"
    echo "  • comprehensive-report-template.docx - Multi-purpose template"
    echo "  • business-data.xlsx - Excel file with multiple sheets"
    echo ""
    echo "For testing, make sure these files exist in the current directory."
}

# Function: Check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}🔍 Checking prerequisites...${NC}"

    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq is not installed. Please install jq to parse JSON responses.${NC}"
        echo "Install with: sudo apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
        return 1
    fi

    # Check if curl is available
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ curl is not installed.${NC}"
        return 1
    fi

    # Check if API credentials are set
    if [ "$API_TOKEN" = "YOUR_API_TOKEN" ] || [ "$ORG_ID" = "YOUR_ORGANIZATION_ID" ]; then
        echo -e "${RED}❌ Please update API_TOKEN and ORG_ID in this script.${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    return 0
}

# Main execution
main() {
    echo -e "${BLUE}Starting TurboDocx file attachment examples...${NC}"

    # Check prerequisites
    if ! check_prerequisites; then
        exit 1
    fi

    # Show sample files info
    create_sample_files

    # Example 1: Single sheet data attachment
    if upload_template_with_data_file; then
        echo -e "\n${GREEN}=== Example 1 Complete ===${NC}"
    else
        echo -e "\n${RED}=== Example 1 Failed ===${NC}"
    fi

    # Example 2: Multiple sheet data attachment
    if upload_template_with_multiple_sheets; then
        echo -e "\n${GREEN}=== Example 2 Complete ===${NC}"
    else
        echo -e "\n${RED}=== Example 2 Failed ===${NC}"
    fi

    echo -e "\n${GREEN}🎉 All file attachment examples completed!${NC}"
    echo -e "${BLUE}Ready to generate documents with data-enhanced templates!${NC}"
}

# Show usage if script is called with help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "TurboDocx File Attachment Examples"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --single      Run only single sheet example"
    echo "  --multi       Run only multi-sheet example"
    echo ""
    echo "Before running:"
    echo "  1. Update API_TOKEN and ORG_ID in this script"
    echo "  2. Ensure sample files exist in current directory"
    echo "  3. Install jq for JSON parsing: apt-get install jq"
    exit 0
fi

# Handle command line options
if [ "$1" = "--single" ]; then
    check_prerequisites && upload_template_with_data_file
elif [ "$1" = "--multi" ]; then
    check_prerequisites && upload_template_with_multiple_sheets
else
    # Run all examples
    main
fi