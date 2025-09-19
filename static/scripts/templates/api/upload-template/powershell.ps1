# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"
$TEMPLATE_NAME = "Employee Contract Template"

##
# Path A: Upload and Create Template
# Uploads a .docx/.pptx template and extracts variables automatically
##

function Upload-Template {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateFilePath
    )

    # Check if file exists
    if (-not (Test-Path $TemplateFilePath)) {
        throw "Template file not found: $TemplateFilePath"
    }

    $uri = "$BASE_URL/template/upload-and-create"
    $boundary = "----PowerShellBoundary$((Get-Random -Maximum 1000000))"

    # Read file content
    $fileContent = [System.IO.File]::ReadAllBytes($TemplateFilePath)
    $fileName = [System.IO.Path]::GetFileName($TemplateFilePath)

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
    $bodyLines += $TEMPLATE_NAME

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

    try {
        # Create headers
        $headers = @{
            'Authorization' = "Bearer $API_TOKEN"
            'x-rapiddocx-org-id' = $ORG_ID
            'User-Agent' = 'TurboDocx API Client'
            'Content-Type' = "multipart/form-data; boundary=$boundary"
        }

        Write-Host "Uploading template: $fileName"
        Write-Host "Template name: $TEMPLATE_NAME"

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $bodyBytes

        # Parse response
        $template = $response.data.results.template

        Write-Host "✅ Template uploaded successfully: $($template.id)" -ForegroundColor Green
        Write-Host "Template name: $($template.name)"

        # Handle nullable variables field
        $variableCount = if ($template.variables) { $template.variables.Count } else { 0 }
        Write-Host "Variables extracted: $variableCount"

        Write-Host "Default font: $($template.defaultFont)"

        # Handle nullable fonts field
        $fontCount = if ($template.fonts) { $template.fonts.Count } else { 0 }
        Write-Host "Fonts used: $fontCount"

        Write-Host "Redirect to: $($response.data.results.redirectUrl)"
        Write-Host "Ready to generate documents with template: $($template.id)"

        return $response
    }
    catch {
        Write-Error "Upload failed: $($_.Exception.Message)"
        throw
    }
}

# Example usage
try {
    $templateFile = ".\contract-template.docx"
    $result = Upload-Template -TemplateFilePath $templateFile
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}