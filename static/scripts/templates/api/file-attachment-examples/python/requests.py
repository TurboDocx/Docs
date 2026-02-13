import requests
import json

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

def upload_template_with_data_file():
    """
    Upload template with Excel data file attachment and sheet selection
    This demonstrates advanced template upload with data source integration
    """
    try:
        url = f"{BASE_URL}/template/upload-and-create"

        # Prepare files for upload
        files = {}

        # 1. Main template file (DOCX/PPTX)
        with open('./financial-report-template.docx', 'rb') as template_file:
            files['templateFile'] = ('financial-report-template.docx', template_file.read(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

        # 2. Excel data source file
        data_file_id = 'financial-data-123'
        with open('./q4-financial-data.xlsx', 'rb') as data_file:
            files[f'FileResource-{data_file_id}'] = ('q4-financial-data.xlsx', data_file.read(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        # 3. Form data for template metadata
        data = {
            'name': 'Q4 Financial Report Template',
            'description': 'Financial report template with Excel data integration for AI variable generation',

            # Sheet selection and data range metadata
            'fileResourceMetadata': json.dumps({
                data_file_id: {
                    "selectedSheet": "Income Statement",
                    "hasMultipleSheets": True,
                    "dataRange": "A1:F50",
                    "description": "Q4 financial data for AI variable generation"
                }
            }),

            # Pre-define variables that will use the attached data
            'variables': json.dumps([
                {
                    "name": "Revenue Summary",
                    "placeholder": "{RevenueSummary}",
                    "aiHint": "Generate revenue summary from attached financial data",
                    "dataSourceId": data_file_id
                },
                {
                    "name": "Expense Analysis",
                    "placeholder": "{ExpenseAnalysis}",
                    "aiHint": "Analyze expense trends from Q4 data",
                    "dataSourceId": data_file_id
                }
            ]),

            # Add tags for organization
            'tags': json.dumps(["financial", "q4", "ai-enhanced", "data-driven"])
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        print('Uploading template with Excel data file...')
        print('Template: financial-report-template.docx')
        print('Data Source: q4-financial-data.xlsx (Sheet: Income Statement)')
        print('Data Range: A1:F50')

        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()

        result = response.json()
        template = result['data']['results']['template']

        print('✅ Template with data file uploaded successfully!')
        print(f'Template ID: {template["id"]}')
        print(f'Template Name: {template["name"]}')
        print(f'Variables Extracted: {len(template.get("variables", []))}')
        print(f'Data Sources Attached: {len(template.get("dataSources", []))}')
        print(f'Default Font: {template.get("defaultFont", "N/A")}')
        print(f'Fonts Used: {len(template.get("fonts", []))}')

        # Show data source information
        if template.get('dataSources'):
            print('\n📊 Attached Data Sources:')
            for i, source in enumerate(template['dataSources'], 1):
                print(f'  {i}. {source["filename"]} ({source["selectedSheet"]})')

        print(f'\n🔗 Redirect URL: {result["data"]["results"]["redirectUrl"]}')

        return template

    except requests.exceptions.RequestException as e:
        print(f'❌ Error uploading template with data file: {e}')
        raise
    except Exception as e:
        print(f'❌ Unexpected error: {e}')
        raise

def upload_template_with_multiple_sheets():
    """
    Example: Process multiple sheets from the same Excel file
    """
    try:
        url = f"{BASE_URL}/template/upload-and-create"

        files = {}

        # Template file
        with open('./comprehensive-report-template.docx', 'rb') as template_file:
            files['templateFile'] = ('comprehensive-report-template.docx', template_file.read(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

        # Single Excel file but reference multiple sheets
        data_file_id = 'business-data-456'
        with open('./business-data.xlsx', 'rb') as data_file:
            files[f'FileResource-{data_file_id}'] = ('business-data.xlsx', data_file.read(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        # Form data with multiple sheet usage
        data = {
            'name': 'Comprehensive Business Report',
            'description': 'Multi-sheet data analysis template',

            # Define multiple sheet usage
            'fileResourceMetadata': json.dumps({
                data_file_id: {
                    "selectedSheet": "Summary",  # Primary sheet
                    "hasMultipleSheets": True,
                    "alternativeSheets": ["Revenue", "Expenses", "Projections"],  # Additional sheets
                    "dataRange": "A1:Z100",
                    "description": "Comprehensive business data across multiple sheets"
                }
            }),

            # Variables that reference different sheets
            'variables': json.dumps([
                {
                    "name": "Executive Summary",
                    "placeholder": "{ExecutiveSummary}",
                    "aiHint": "Create executive summary from Summary sheet data",
                    "dataSourceId": data_file_id,
                    "sheetReference": "Summary"
                },
                {
                    "name": "Revenue Analysis",
                    "placeholder": "{RevenueAnalysis}",
                    "aiHint": "Analyze revenue trends from Revenue sheet",
                    "dataSourceId": data_file_id,
                    "sheetReference": "Revenue"
                }
            ])
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'x-rapiddocx-org-id': ORG_ID,
            'User-Agent': 'TurboDocx API Client'
        }

        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()

        result = response.json()
        print('✅ Multi-sheet template uploaded successfully!')
        print(f'Template ID: {result["data"]["results"]["template"]["id"]}')

        return result['data']['results']['template']

    except requests.exceptions.RequestException as e:
        print(f'❌ Error uploading multi-sheet template: {e}')
        raise

def main():
    """
    Run file attachment examples
    """
    print('=== Template Upload with File Attachment Examples ===\n')

    try:
        # Example 1: Single sheet data attachment
        template1 = upload_template_with_data_file()
        print('\n=== Example 1 Complete ===\n')

        # Example 2: Multiple sheet data attachment
        template2 = upload_template_with_multiple_sheets()
        print('\n=== All Examples Complete ===')
        print('Ready to generate documents with data-enhanced templates!')

    except Exception as e:
        print(f'\n❌ Example failed: {e}')

if __name__ == "__main__":
    main()