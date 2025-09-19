# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

##
# Complete Template Workflow Manager
# Demonstrates both upload and browse/select paths
##

class TemplateWorkflowManager {
    [string]$ApiToken
    [string]$OrgId
    [string]$BaseUrl

    TemplateWorkflowManager([string]$apiToken, [string]$orgId, [string]$baseUrl) {
        $this.ApiToken = $apiToken
        $this.OrgId = $orgId
        $this.BaseUrl = $baseUrl
        Write-Host "=== TurboDocx Template Generation Workflow Manager ===" -ForegroundColor Cyan
    }

    [void] DemonstrateCompleteWorkflow() {
        Write-Host "`nSelect workflow path:" -ForegroundColor Yellow
        Write-Host "A) Upload new template"
        Write-Host "B) Browse and select existing template"

        # For this example, we'll demonstrate both paths
        Write-Host "`n=== Demonstrating Path A: Upload Template ===" -ForegroundColor Magenta
        $templateIdA = $this.DemonstrateUploadWorkflow()

        Write-Host "`n=== Demonstrating Path B: Browse Templates ===" -ForegroundColor Magenta
        $templateIdB = $this.DemonstrateBrowseWorkflow()

        # Generate deliverables for both templates if successful
        if ($templateIdA) {
            Write-Host "`n=== Generating Deliverable from Uploaded Template ===" -ForegroundColor Green
            $this.GenerateAndDownloadDeliverable($templateIdA, "A")
        }

        if ($templateIdB) {
            Write-Host "`n=== Generating Deliverable from Selected Template ===" -ForegroundColor Green
            $this.GenerateAndDownloadDeliverable($templateIdB, "B")
        }
    }

    [string] DemonstrateUploadWorkflow() {
        try {
            Write-Host "`n--- Path A: Upload and Create Template ---" -ForegroundColor Yellow

            # Check for template file
            $templateFile = ".\contract-template.docx"
            if (-not (Test-Path $templateFile)) {
                Write-Host "⚠️  Template file not found: $templateFile" -ForegroundColor Yellow
                Write-Host "Creating a placeholder message for demonstration"
                return $null
            }

            $result = $this.UploadTemplate($templateFile)
            $template = $result.data.results.template

            Write-Host "✅ Upload workflow completed" -ForegroundColor Green
            Write-Host "Template ID: $($template.id)"
            Write-Host "Ready for deliverable generation"

            return $template.id
        }
        catch {
            Write-Host "❌ Upload workflow failed: $($_.Exception.Message)" -ForegroundColor Red
            return $null
        }
    }

    [string] DemonstrateBrowseWorkflow() {
        try {
            Write-Host "`n--- Path B: Browse and Select Template ---" -ForegroundColor Yellow

            # Browse templates
            $browseResult = $this.BrowseTemplates(10, 0, 'contract', $true)

            # Find first template (not folder)
            $selectedTemplate = $browseResult.results | Where-Object { $_.type -eq 'template' } | Select-Object -First 1

            if ($null -eq $selectedTemplate) {
                Write-Host "⚠️  No templates found in browse results" -ForegroundColor Yellow
                return $null
            }

            Write-Host "Selected: $($selectedTemplate.name)"

            # Get detailed information
            $templateDetails = $this.GetTemplateDetails($selectedTemplate.id)

            # Optionally get PDF preview
            $pdfPreview = $this.GetTemplatePdfPreview($selectedTemplate.id)

            Write-Host "✅ Browse workflow completed" -ForegroundColor Green
            Write-Host "Template ID: $($templateDetails.id)"
            Write-Host "PDF Preview: $pdfPreview"
            Write-Host "Ready for deliverable generation"

            return $templateDetails.id
        }
        catch {
            Write-Host "❌ Browse workflow failed: $($_.Exception.Message)" -ForegroundColor Red
            return $null
        }
    }

    [void] GenerateAndDownloadDeliverable([string]$templateId, [string]$pathLabel) {
        try {
            Write-Host "`n--- Generating Deliverable (Path $pathLabel) ---" -ForegroundColor Yellow

            $deliverableData = $this.CreateDeliverableData($templateId, $pathLabel)
            $deliverable = $this.GenerateDeliverable($templateId, $deliverableData)

            # Download the file
            $downloadResult = $this.DownloadDeliverable(
                $deliverable.id,
                "$($deliverable.name)_path_$pathLabel.docx"
            )

            Write-Host "✅ Complete workflow finished successfully for Path $pathLabel" -ForegroundColor Green
            Write-Host "Deliverable ID: $($deliverable.id)"
            Write-Host "Download info: $($downloadResult | ConvertTo-Json -Compress)"
        }
        catch {
            Write-Host "❌ Deliverable generation failed for Path $pathLabel : $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    [hashtable] UploadTemplate([string]$templateFilePath) {
        $uri = "$($this.BaseUrl)/template/upload-and-create"
        $boundary = "----PowerShellBoundary$((Get-Random -Maximum 1000000))"

        # Read file content
        $fileContent = [System.IO.File]::ReadAllBytes($templateFilePath)
        $fileName = [System.IO.Path]::GetFileName($templateFilePath)

        # Build multipart form data
        $bodyLines = @()

        # Template file field
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"templateFile`"; filename=`"$fileName`""
        $bodyLines += "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        $bodyLines += ""

        # Convert file content to string for inclusion
        $encoding = [System.Text.Encoding]::GetEncoding("ISO-8859-1")
        $bodyLines += $encoding.GetString($fileContent)

        # Name field
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"name`""
        $bodyLines += ""
        $bodyLines += "Employee Contract Template"

        # Description field
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"description`""
        $bodyLines += ""
        $bodyLines += "Standard employee contract with variable placeholders"

        # Variables field
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"variables`""
        $bodyLines += ""
        $bodyLines += "[]"

        # Tags field
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"tags`""
        $bodyLines += ""
        $bodyLines += '["hr", "contract", "template"]'

        $bodyLines += "--$boundary--"

        # Join with CRLF
        $body = ($bodyLines -join "`r`n")
        $bodyBytes = $encoding.GetBytes($body)

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
            'Content-Type' = "multipart/form-data; boundary=$boundary"
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $bodyBytes
        return $response
    }

    [hashtable] BrowseTemplates([int]$limit, [int]$offset, [string]$query, [bool]$showTags) {
        # Build query parameters
        $params = @{
            'limit' = $limit
            'offset' = $offset
            'showTags' = $showTags.ToString().ToLower()
        }

        if ($query -ne '') {
            $params['query'] = $query
        }

        # Build query string
        $queryString = ($params.GetEnumerator() | ForEach-Object {
            "$([System.Web.HttpUtility]::UrlEncode($_.Key))=$([System.Web.HttpUtility]::UrlEncode($_.Value))"
        }) -join '&'

        $uri = "$($this.BaseUrl)/template-item?$queryString"

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
        return $response.data
    }

    [hashtable] GetTemplateDetails([string]$templateId) {
        $uri = "$($this.BaseUrl)/template/$templateId"

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
        return $response.data.results
    }

    [string] GetTemplatePdfPreview([string]$templateId) {
        $uri = "$($this.BaseUrl)/template/$templateId/previewpdflink"

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
        return $response.results
    }

    [hashtable] GenerateDeliverable([string]$templateId, [hashtable]$deliverableData) {
        $uri = "$($this.BaseUrl)/deliverable"

        Write-Host "Generating deliverable..."
        Write-Host "Template ID: $templateId"
        Write-Host "Deliverable Name: $($deliverableData.name)"
        Write-Host "Variables: $($deliverableData.variables.Count)"

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
            'Content-Type' = 'application/json'
        }

        # Convert to JSON
        $jsonBody = $deliverableData | ConvertTo-Json -Depth 10

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $jsonBody

        # Parse JSON response
        $deliverable = $response.data.results.deliverable

        Write-Host "✅ Deliverable generated successfully!" -ForegroundColor Green
        Write-Host "Deliverable ID: $($deliverable.id)"
        Write-Host "Created by: $($deliverable.createdBy)"
        Write-Host "Created on: $($deliverable.createdOn)"
        Write-Host "Template ID: $($deliverable.templateId)"

        return $deliverable
    }

    [hashtable] DownloadDeliverable([string]$deliverableId, [string]$filename) {
        Write-Host "Downloading file: $filename"

        $uri = "$($this.BaseUrl)/deliverable/file/$deliverableId"

        # Create headers
        $headers = @{
            'Authorization' = "Bearer $($this.ApiToken)"
            'x-rapiddocx-org-id' = $this.OrgId
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-WebRequest -Uri $uri -Method Get -Headers $headers

        if ($response.StatusCode -ne 200) {
            throw "Download failed: $($response.StatusCode)"
        }

        Write-Host "✅ File ready for download: $filename" -ForegroundColor Green

        $contentType = if ($response.Headers['Content-Type']) { $response.Headers['Content-Type'] } else { 'N/A' }
        $contentLength = if ($response.Headers['Content-Length']) { $response.Headers['Content-Length'] } else { 'N/A' }

        Write-Host "📁 Content-Type: $contentType"
        Write-Host "📊 Content-Length: $contentLength bytes"

        # In a real application, you would save the file
        # [System.IO.File]::WriteAllBytes($filename, $response.Content)

        return @{
            'filename' = $filename
            'content_type' = $contentType
            'content_length' = $contentLength
        }
    }

    [hashtable] CreateDeliverableData([string]$templateId, [string]$pathLabel) {
        $now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')

        return @{
            'templateId' = $templateId
            'name' = "Contract Document - Path $pathLabel"
            'description' = "Employment contract generated via workflow path $pathLabel"
            'variables' = $this.CreateComplexVariables()
            'tags' = @('hr', 'contract', 'employee', 'engineering')
            'fonts' = '[{"name":"Arial","usage":269}]'
            'defaultFont' = 'Arial'
            'replaceFonts' = $true
            'metadata' = @{
                'sessions' = @(
                    @{
                        'id' = [System.Guid]::NewGuid().ToString()
                        'starttime' = $now
                        'endtime' = $now
                    }
                )
                'createdBy' = 'PowerShell Workflow Manager'
                'documentType' = 'Employment Contract'
                'version' = 'v1.0'
                'workflowPath' = $pathLabel
            }
        }
    }

    [array] CreateComplexVariables() {
        return @(
            @{
                'mimeType' = 'text'
                'name' = 'Employee Name'
                'placeholder' = '{EmployeeName}'
                'text' = 'John Smith'
                'allowRichTextInjection' = 0
                'autogenerated' = $false
                'count' = 1
                'order' = 1
                'subvariables' = @(
                    @{
                        'placeholder' = '{EmployeeName.Title}'
                        'text' = 'Senior Software Engineer'
                    },
                    @{
                        'placeholder' = '{EmployeeName.StartDate}'
                        'text' = 'January 15, 2024'
                    }
                )
                'metadata' = @{
                    'department' = 'Engineering'
                    'level' = 'Senior'
                }
                'aiPrompt' = 'Generate a professional job description for a senior software engineer role'
            },
            @{
                'mimeType' = 'text'
                'name' = 'Company Information'
                'placeholder' = '{CompanyInfo}'
                'text' = 'TechCorp Solutions Inc.'
                'allowRichTextInjection' = 1
                'autogenerated' = $false
                'count' = 1
                'order' = 2
                'subvariables' = @(
                    @{
                        'placeholder' = '{CompanyInfo.Address}'
                        'text' = '123 Innovation Drive, Tech City, TC 12345'
                    },
                    @{
                        'placeholder' = '{CompanyInfo.Phone}'
                        'text' = '(555) 123-4567'
                    }
                )
                'metadata' = @{}
                'aiPrompt' = ''
            }
        )
    }
}

# Example usage
try {
    Add-Type -AssemblyName System.Web

    $workflowManager = [TemplateWorkflowManager]::new($API_TOKEN, $ORG_ID, $BASE_URL)
    $workflowManager.DemonstrateCompleteWorkflow()

    Write-Host "`n=== Workflow Demonstration Complete ===" -ForegroundColor Green
    Write-Host "Both upload and browse/select paths have been demonstrated."
    Write-Host "Choose the appropriate path for your use case:"
    Write-Host "- Upload path: When you have new templates to create"
    Write-Host "- Browse path: When you want to use existing templates"
}
catch {
    Write-Error "Workflow demonstration failed: $($_.Exception.Message)"
    exit 1
}