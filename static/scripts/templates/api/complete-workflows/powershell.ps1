# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

<#
Complete Workflow: Upload → Generate → Download
Simple 3-step process for document generation
#>

function Upload-Template {
    param(
        [string]$TemplateFilePath
    )

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
    $bodyLines += "Content-Type: application/octet-stream"
    $bodyLines += ""

    # Convert file content to string for inclusion
    $encoding = [System.Text.Encoding]::GetEncoding("ISO-8859-1")
    $bodyLines += $encoding.GetString($fileContent)

    # Name field
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"name`""
    $bodyLines += ""
    $bodyLines += "Simple Template"

    # Description field
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"description`""
    $bodyLines += ""
    $bodyLines += "Template uploaded for document generation"

    $bodyLines += "--$boundary--"

    # Join with CRLF
    $body = ($bodyLines -join "`r`n")
    $bodyBytes = $encoding.GetBytes($body)

    # Create headers
    $headers = @{
        'Authorization' = "Bearer $API_TOKEN"
        'x-rapiddocx-org-id' = $ORG_ID
        'User-Agent' = 'TurboDocx API Client'
        'Content-Type' = "multipart/form-data; boundary=$boundary"
    }

    # Make request
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $bodyBytes
    $template = $response.data.results.template

    Write-Host "✅ Template uploaded: $($template.name) ($($template.id))"
    return $template
}

function Generate-Deliverable {
    param(
        [string]$TemplateId
    )

    $payload = @{
        templateId = $TemplateId
        name = "Generated Document"
        description = "Simple document example"
        variables = @(
            @{
                name = "Company Name"
                placeholder = "{CompanyName}"
                text = "Acme Corporation"
            },
            @{
                name = "Employee Name"
                placeholder = "{EmployeeName}"
                text = "John Smith"
            },
            @{
                name = "Date"
                placeholder = "{Date}"
                text = "January 15, 2024"
            }
        )
    }

    $uri = "$BASE_URL/deliverable"

    # Create headers
    $headers = @{
        'Authorization' = "Bearer $API_TOKEN"
        'x-rapiddocx-org-id' = $ORG_ID
        'User-Agent' = 'TurboDocx API Client'
        'Content-Type' = 'application/json'
    }

    # Convert to JSON
    $jsonBody = $payload | ConvertTo-Json -Depth 10

    # Make request
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $jsonBody
    $deliverable = $response.data.results.deliverable

    Write-Host "✅ Document generated: $($deliverable.name) ($($deliverable.id))"
    return $deliverable
}

function Download-File {
    param(
        [string]$DeliverableId,
        [string]$Filename
    )

    $uri = "$BASE_URL/deliverable/file/$DeliverableId"

    # Create headers
    $headers = @{
        'Authorization' = "Bearer $API_TOKEN"
        'x-rapiddocx-org-id' = $ORG_ID
        'User-Agent' = 'TurboDocx API Client'
    }

    # Make request
    $response = Invoke-WebRequest -Uri $uri -Method Get -Headers $headers

    if ($response.StatusCode -ne 200) {
        throw "Download failed: $($response.StatusCode)"
    }

    Write-Host "✅ File ready for download: $Filename"

    # In a real application, you would save the file:
    # [System.IO.File]::WriteAllBytes($Filename, $response.Content)
}

function Complete-Workflow {
    param(
        [string]$TemplateFilePath
    )

    Write-Host "🚀 Starting complete workflow..."

    # Step 1: Upload template
    Write-Host "`n📤 Step 1: Uploading template..."
    $template = Upload-Template -TemplateFilePath $TemplateFilePath

    # Step 2: Generate deliverable
    Write-Host "`n📝 Step 2: Generating document..."
    $deliverable = Generate-Deliverable -TemplateId $template.id

    # Step 3: Download file
    Write-Host "`n📥 Step 3: Downloading file..."
    $filename = "$($deliverable.name).docx"
    Download-File -DeliverableId $deliverable.id -Filename $filename

    Write-Host "`n✅ Workflow complete!"
    Write-Host "Template: $($template.id)"
    Write-Host "Document: $($deliverable.id)"
    Write-Host "File: $filename"
}

# Example usage
try {
    # Replace with your template file path
    $templatePath = "./template.docx"
    Complete-Workflow -TemplateFilePath $templatePath
}
catch {
    Write-Host "❌ Workflow failed: $($_.Exception.Message)" -ForegroundColor Red
}