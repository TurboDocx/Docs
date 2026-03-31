# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

##
# Generate Deliverable
##

function Generate-Deliverable {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateId,
        [Parameter(Mandatory=$true)]
        [hashtable]$DeliverableData
    )

    $uri = "$BASE_URL/v1/deliverable"

    Write-Host "Generating deliverable..."
    Write-Host "Template ID: $TemplateId"
    Write-Host "Deliverable Name: $($DeliverableData.name)"
    Write-Host "Variables: $($DeliverableData.variables.Count)"

    try {
        # Create headers
        $headers = @{
            'Authorization' = "Bearer $API_TOKEN"
            'x-rapiddocx-org-id' = $ORG_ID
            'User-Agent' = 'TurboDocx API Client'
            'Content-Type' = 'application/json'
        }

        # Convert to JSON
        $jsonBody = $DeliverableData | ConvertTo-Json -Depth 10

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $jsonBody

        # Parse JSON response
        $deliverable = $response.data.results.deliverable

        Write-Host "Deliverable generated successfully!" -ForegroundColor Green
        Write-Host "Deliverable ID: $($deliverable.id)"
        Write-Host "Created by: $($deliverable.createdBy)"
        Write-Host "Created on: $($deliverable.createdOn)"
        Write-Host "Template ID: $($deliverable.templateId)"

        return $deliverable
    }
    catch {
        Write-Error "Deliverable generation failed: $($_.Exception.Message)"
        throw
    }
}

##
# Download Deliverable
##

function Download-Deliverable {
    param(
        [Parameter(Mandatory=$true)]
        [string]$DeliverableId,
        [Parameter(Mandatory=$true)]
        [string]$Filename
    )

    Write-Host "Downloading file: $Filename"

    $uri = "$BASE_URL/v1/deliverable/file/$DeliverableId"

    try {
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

        Write-Host "File ready for download: $Filename" -ForegroundColor Green

        $contentType = if ($response.Headers['Content-Type']) { $response.Headers['Content-Type'] } else { 'N/A' }
        $contentLength = if ($response.Headers['Content-Length']) { $response.Headers['Content-Length'] } else { 'N/A' }

        Write-Host "Content-Type: $contentType"
        Write-Host "Content-Length: $contentLength bytes"

        # Save the file
        # [System.IO.File]::WriteAllBytes($Filename, $response.Content)

        return @{
            'filename' = $Filename
            'content_type' = $contentType
            'content_length' = $contentLength
        }
    }
    catch {
        Write-Error "Download failed: $($_.Exception.Message)"
        throw
    }
}

##
# Example Usage
##

try {
    Write-Host "=== Generate Deliverable ===" -ForegroundColor Cyan

    # Template ID from a previous upload or browse step
    $templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

    # Build the deliverable payload
    $deliverableData = @{
        'templateId' = $templateId
        'name' = 'Employee Contract - John Smith'
        'description' = 'Employment contract for new senior developer'
        'variables' = @(
            @{ 'placeholder' = '{EmployeeName}'; 'text' = 'John Smith'; 'mimeType' = 'text' },
            @{ 'placeholder' = '{CompanyName}'; 'text' = 'TechCorp Solutions Inc.'; 'mimeType' = 'text' },
            @{ 'placeholder' = '{JobTitle}'; 'text' = 'Senior Software Engineer'; 'mimeType' = 'text' },
            @{
                'mimeType' = 'html'
                'placeholder' = '{ContactBlock}'
                'text' = '<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>'
                'subvariables' = @(
                    @{ 'placeholder' = '{contactName}'; 'text' = 'Jane Doe'; 'mimeType' = 'text' },
                    @{ 'placeholder' = '{contactPhone}'; 'text' = '(555) 123-4567'; 'mimeType' = 'text' }
                )
            }
        )
        'tags' = @('hr', 'contract', 'employee')
    }

    $deliverable = Generate-Deliverable -TemplateId $templateId -DeliverableData $deliverableData

    # Download the generated file
    Write-Host "`n=== Download Generated File ===" -ForegroundColor Cyan
    $downloadResult = Download-Deliverable -DeliverableId $deliverable.id -Filename "$($deliverable.name).docx"

    Write-Host "`nGeneration and download completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "Deliverable generation failed: $($_.Exception.Message)"
    exit 1
}
