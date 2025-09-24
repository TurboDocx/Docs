# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

##
# Final Step: Generate Deliverable (Both Paths Converge Here)
##

function Generate-Deliverable {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateId,
        [Parameter(Mandatory=$true)]
        [hashtable]$DeliverableData
    )

    $uri = "$BASE_URL/deliverable"

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

        Write-Host "✅ Deliverable generated successfully!" -ForegroundColor Green
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

function Download-Deliverable {
    param(
        [Parameter(Mandatory=$true)]
        [string]$DeliverableId,
        [Parameter(Mandatory=$true)]
        [string]$Filename
    )

    Write-Host "Downloading file: $Filename"

    $uri = "$BASE_URL/deliverable/file/$DeliverableId"

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

        Write-Host "✅ File ready for download: $Filename" -ForegroundColor Green

        $contentType = if ($response.Headers['Content-Type']) { $response.Headers['Content-Type'] } else { 'N/A' }
        $contentLength = if ($response.Headers['Content-Length']) { $response.Headers['Content-Length'] } else { 'N/A' }

        Write-Host "📁 Content-Type: $contentType"
        Write-Host "📊 Content-Length: $contentLength bytes"

        # In a real application, you would save the file
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

function New-SimpleVariables {
    return @(
        @{
            'name' = 'Company Name'
            'placeholder' = '{CompanyName}'
            'text' = 'Acme Corporation'
        },
        @{
            'name' = 'Employee Name'
            'placeholder' = '{EmployeeName}'
            'text' = 'John Smith'
        },
        @{
            'name' = 'Date'
            'placeholder' = '{Date}'
            'text' = 'January 15, 2024'
        }
    )
}

function New-DeliverableData {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateId
    )

    $now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')

    return @{
        'templateId' = $TemplateId
        'name' = 'Contract - John Smith'
        'description' = 'Simple contract example'
        'variables' = New-SimpleVariables
        'metadata' = @{
            'sessions' = @(
                @{
                    'id' = [System.Guid]::NewGuid().ToString()
                    'starttime' = $now
                    'endtime' = $now
                }
            )
            'createdBy' = 'HR Department'
            'documentType' = 'Employment Contract'
            'version' = 'v1.0'
        }
    }
}

# Example usage
try {
    Write-Host "=== Final Step: Generate Deliverable ===" -ForegroundColor Cyan

    # This would come from either Path A (upload) or Path B (browse/select)
    $templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

    $deliverableData = New-DeliverableData -TemplateId $templateId
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