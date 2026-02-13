#!/usr/bin/env python3

import requests
import json
import uuid
from pathlib import Path
from typing import Optional, Dict, Any, Union

# Configuration - Update these values
API_TOKEN = "YOUR_API_TOKEN"
ORG_ID = "YOUR_ORGANIZATION_ID"
BASE_URL = "https://api.turbodocx.com"

class AIVariableGenerator:
    """
    AI-Powered Variable Generation Client
    Generate intelligent content for template variables using AI with file attachments
    """

    def __init__(self, api_token: str, org_id: str, base_url: str = BASE_URL):
        self.api_token = api_token
        self.org_id = org_id
        self.base_url = base_url

    def generate_variable(
        self,
        name: str,
        placeholder: str,
        ai_hint: str,
        file_path: Optional[str] = None,
        file_metadata: Optional[Dict[str, Any]] = None,
        template_id: Optional[str] = None,
        rich_text_enabled: bool = False
    ) -> Dict[str, Any]:
        """
        Generate AI-powered variable content with optional file attachment

        Args:
            name: Variable display name
            placeholder: Template placeholder (e.g., '{VariableName}')
            ai_hint: Instructions for AI content generation
            file_path: Path to file for AI analysis (optional)
            file_metadata: File-specific metadata (optional)
            template_id: Template ID for context (optional)
            rich_text_enabled: Enable HTML/rich text output

        Returns:
            Dict containing generated content and metadata
        """
        url = f"{self.base_url}/ai/generate/variable/one"

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'x-rapiddocx-org-id': self.org_id,
            'User-Agent': 'TurboDocx AI Client'
        }

        # Prepare form data
        data = {
            'name': name,
            'placeholder': placeholder,
            'aiHint': ai_hint,
            'richTextEnabled': str(rich_text_enabled).lower()
        }

        files = {}

        # Handle file attachment
        if file_path:
            file_uuid = str(uuid.uuid4())
            file_path_obj = Path(file_path)

            if not file_path_obj.exists():
                raise FileNotFoundError(f"File not found: {file_path}")

            # Open file for upload
            files[f'FileResource-{file_uuid}'] = (
                file_path_obj.name,
                open(file_path_obj, 'rb'),
                self._get_content_type(file_path_obj)
            )

            # Prepare file metadata
            default_metadata = {
                file_uuid: {
                    'contentType': 'document',
                    'hasMultipleSheets': False
                }
            }

            if file_metadata:
                default_metadata[file_uuid].update(file_metadata)

            data['fileResourceMetadata'] = json.dumps(default_metadata)

        try:
            print(f"Generating AI variable: {name}")
            print(f"AI Hint: {ai_hint[:100]}...")

            response = requests.post(url, headers=headers, data=data, files=files)
            response.raise_for_status()

            result = response.json()

            print("✅ AI Variable generated successfully!")
            print(f"Content Type: {result['data']['mimeType']}")
            print(f"Generated Content: {result['data']['text'][:100]}...")

            return result

        except requests.exceptions.RequestException as e:
            error_msg = f"AI Variable generation failed: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {e.response.text}"
            print(f"❌ {error_msg}")
            raise

        finally:
            # Close file handles
            for file_handle in files.values():
                if hasattr(file_handle[1], 'close'):
                    file_handle[1].close()

    def _get_content_type(self, file_path: Path) -> str:
        """Get appropriate content type based on file extension"""
        extension = file_path.suffix.lower()
        content_types = {
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xls': 'application/vnd.ms-excel',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.pdf': 'application/pdf',
            '.csv': 'text/csv',
            '.txt': 'text/plain',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg'
        }
        return content_types.get(extension, 'application/octet-stream')

def example1_basic_generation():
    """Example 1: Basic AI Variable Generation (no file)"""
    print('=== Example 1: Basic AI Variable Generation ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        result = generator.generate_variable(
            name='Company Overview',
            placeholder='{CompanyOverview}',
            ai_hint='Generate a professional company overview for a technology consulting firm specializing in digital transformation and cloud solutions',
            rich_text_enabled=False
        )

        print(f"Generated content: {result['data']['text']}")
        return result

    except Exception as e:
        print(f"Example 1 failed: {str(e)}")

def example2_excel_analysis(file_path: str):
    """Example 2: Excel File Analysis"""
    print('=== Example 2: Excel File Analysis ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        result = generator.generate_variable(
            name='Financial Performance Summary',
            placeholder='{FinancialSummary}',
            ai_hint='Analyze the Q4 financial data and generate a comprehensive executive summary highlighting revenue growth, profit margins, key performance indicators, and strategic recommendations',
            file_path=file_path,
            file_metadata={
                'selectedSheet': 'Q4 Results',
                'hasMultipleSheets': True,
                'dataRange': 'A1:F50',
                'contentType': 'financial-data'
            },
            rich_text_enabled=True
        )

        print(f"Financial analysis: {result['data']['text']}")
        return result

    except Exception as e:
        print(f"Example 2 failed: {str(e)}")

def example3_document_analysis(file_path: str):
    """Example 3: Word Document Analysis"""
    print('=== Example 3: Word Document Analysis ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        result = generator.generate_variable(
            name='Project Scope',
            placeholder='{ProjectScope}',
            ai_hint='Based on the project requirements document, create a detailed project scope including objectives, key deliverables, timeline milestones, and success criteria',
            file_path=file_path,
            file_metadata={
                'contentType': 'project-document'
            },
            rich_text_enabled=True
        )

        print(f"Project scope: {result['data']['text']}")
        return result

    except Exception as e:
        print(f"Example 3 failed: {str(e)}")

def example4_legal_analysis(file_path: str):
    """Example 4: Legal Document Analysis"""
    print('=== Example 4: Legal Document Analysis ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        result = generator.generate_variable(
            name='Contract Key Terms',
            placeholder='{KeyTerms}',
            ai_hint='Extract and summarize the key terms, payment obligations, contract duration, termination clauses, and important deadlines from this service agreement',
            file_path=file_path,
            file_metadata={
                'contentType': 'legal-document'
            },
            rich_text_enabled=False
        )

        print(f"Contract analysis: {result['data']['text']}")
        return result

    except Exception as e:
        print(f"Example 4 failed: {str(e)}")

def example5_rich_text_generation():
    """Example 5: Rich Text Content Generation"""
    print('=== Example 5: Rich Text Content Generation ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        result = generator.generate_variable(
            name='Marketing Campaign Summary',
            placeholder='{CampaignSummary}',
            ai_hint='Create a comprehensive marketing campaign summary with structured sections: Executive Overview, Key Metrics (with specific numbers), Strategic Insights, and Action Items. Format with appropriate headings and bullet points.',
            rich_text_enabled=True
        )

        print(f"Rich text content: {result['data']['text']}")
        return result

    except Exception as e:
        print(f"Example 5 failed: {str(e)}")

def example6_batch_generation(file_path: str):
    """Example 6: Batch AI Variable Generation"""
    print('=== Example 6: Batch AI Variable Generation ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    variables = [
        {
            'name': 'Executive Summary',
            'placeholder': '{ExecutiveSummary}',
            'ai_hint': 'Create a high-level executive summary focusing on strategic outcomes and business impact'
        },
        {
            'name': 'Key Metrics',
            'placeholder': '{KeyMetrics}',
            'ai_hint': 'Extract and present the most important quantitative metrics and KPIs'
        },
        {
            'name': 'Recommendations',
            'placeholder': '{Recommendations}',
            'ai_hint': 'Provide actionable recommendations based on data analysis and insights'
        }
    ]

    try:
        results = []
        for variable in variables:
            result = generator.generate_variable(
                name=variable['name'],
                placeholder=variable['placeholder'],
                ai_hint=variable['ai_hint'],
                file_path=file_path,
                file_metadata={
                    'contentType': 'business-data',
                    'hasHeaders': True
                },
                rich_text_enabled=True
            )
            results.append(result)

        print('Batch generation completed successfully!')
        for i, result in enumerate(results):
            print(f"{variables[i]['name']}: {result['data']['text'][:100]}...")

        return results

    except Exception as e:
        print(f"Example 6 failed: {str(e)}")

def complete_workflow_example(file_path: str):
    """Complete Workflow: AI + Template Generation Integration"""
    print('=== Complete Workflow: AI + Template Generation ===')

    generator = AIVariableGenerator(API_TOKEN, ORG_ID)

    try:
        # Step 1: Generate AI content
        ai_result = generator.generate_variable(
            name='Business Analysis',
            placeholder='{BusinessAnalysis}',
            ai_hint='Generate a comprehensive business analysis including market trends, performance metrics, and strategic recommendations',
            file_path=file_path,
            file_metadata={
                'selectedSheet': 'Data',
                'hasMultipleSheets': True
            },
            rich_text_enabled=True
        )

        print('AI content generated successfully')

        # Step 2: Prepare template variables with AI content
        template_variables = [{
            'name': 'Business Analysis',
            'placeholder': '{BusinessAnalysis}',
            'text': ai_result['data']['text'],
            'mimeType': ai_result['data']['mimeType'],
            'allowRichTextInjection': 1 if ai_result['data']['mimeType'] == 'html' else 0
        }]

        print('Template variables prepared with AI content')

        # Note: This would integrate with the Template Generation API
        # for complete document creation workflow

        return {
            'ai_content': ai_result,
            'template_variables': template_variables
        }

    except Exception as e:
        print(f"Complete workflow failed: {str(e)}")
        raise

# Example usage and demonstrations
if __name__ == '__main__':
    print('🤖 AI Variable Generation Examples')
    print('Available functions:')
    print('- example1_basic_generation()')
    print('- example2_excel_analysis(file_path)')
    print('- example3_document_analysis(file_path)')
    print('- example4_legal_analysis(file_path)')
    print('- example5_rich_text_generation()')
    print('- example6_batch_generation(file_path)')
    print('- complete_workflow_example(file_path)')

    # Run basic example
    try:
        example1_basic_generation()
    except Exception as e:
        print(f"Demo failed: {str(e)}")
        print("Please update API_TOKEN and ORG_ID with your credentials")