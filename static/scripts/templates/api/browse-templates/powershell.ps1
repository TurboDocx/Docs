# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

##
# Path B: Browse and Select Existing Templates
##

function Browse-Templates {
    param(
        [int]$Limit = 25,
        [int]$Offset = 0,
        [string]$Query = '',
        [bool]$ShowTags = $true,
        [string[]]$SelectedTags = $null
    )

    # Build query parameters
    $params = @{
        'limit' = $Limit
        'offset' = $Offset
        'showTags' = $ShowTags.ToString().ToLower()
    }

    if ($Query -ne '') {
        $params['query'] = $Query
    }

    if ($SelectedTags) {
        foreach ($tag in $SelectedTags) {
            $params["selectedTags[]"] = $tag
        }
    }

    # Build query string
    $queryString = ($params.GetEnumerator() | ForEach-Object {
        "$([System.Web.HttpUtility]::UrlEncode($_.Key))=$([System.Web.HttpUtility]::UrlEncode($_.Value))"
    }) -join '&'

    $uri = "$BASE_URL/template-item?$queryString"

    try {
        # Create headers
        $headers = @{
            'Authorization' = "Bearer $API_TOKEN"
            'x-rapiddocx-org-id' = $ORG_ID
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers

        # Parse response
        $data = $response.data

        Write-Host "Found $($data.totalRecords) templates/folders"

        return $data
    }
    catch {
        Write-Error "Browse failed: $($_.Exception.Message)"
        throw
    }
}

function Get-TemplateDetails {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateId
    )

    $uri = "$BASE_URL/template/$TemplateId"

    try {
        # Create headers
        $headers = @{
            'Authorization' = "Bearer $API_TOKEN"
            'x-rapiddocx-org-id' = $ORG_ID
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers

        $template = $response.data.results

        Write-Host "Template: $($template.name)"

        $variableCount = if ($template.variables) { $template.variables.Count } else { 0 }
        Write-Host "Variables: $variableCount"

        $defaultFont = if ($template.defaultFont) { $template.defaultFont } else { 'N/A' }
        Write-Host "Default font: $defaultFont"

        return $template
    }
    catch {
        Write-Error "Failed to get template details: $($_.Exception.Message)"
        throw
    }
}

function Get-TemplatePdfPreview {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateId
    )

    $uri = "$BASE_URL/template/$TemplateId/previewpdflink"

    try {
        # Create headers
        $headers = @{
            'Authorization' = "Bearer $API_TOKEN"
            'x-rapiddocx-org-id' = $ORG_ID
            'User-Agent' = 'TurboDocx API Client'
        }

        # Make request
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers

        $pdfUrl = $response.results

        Write-Host "PDF Preview: $pdfUrl"

        return $pdfUrl
    }
    catch {
        Write-Error "Failed to get PDF preview: $($_.Exception.Message)"
        throw
    }
}

# Example usage - Complete browsing workflow
try {
    Write-Host "=== Path B: Browse and Select Template ===" -ForegroundColor Cyan

    # Step 1: Browse all templates
    Write-Host "`n1. Browsing templates..." -ForegroundColor Yellow
    $browseResult = Browse-Templates -Limit 10 -Offset 0 -Query 'contract' -ShowTags $true

    # Find a template (not a folder)
    $selectedTemplate = $browseResult.results | Where-Object { $_.type -eq 'template' } | Select-Object -First 1

    if ($null -eq $selectedTemplate) {
        Write-Host "No templates found in browse results" -ForegroundColor Red
        exit 1
    }

    Write-Host "`nSelected template: $($selectedTemplate.name) ($($selectedTemplate.id))"

    # Step 2: Get detailed template information
    Write-Host "`n2. Getting template details..." -ForegroundColor Yellow
    $templateDetails = Get-TemplateDetails -TemplateId $selectedTemplate.id

    # Step 3: Get PDF preview (optional)
    Write-Host "`n3. Getting PDF preview..." -ForegroundColor Yellow
    $pdfPreview = Get-TemplatePdfPreview -TemplateId $selectedTemplate.id

    Write-Host "`n=== Template Ready for Generation ===" -ForegroundColor Green
    Write-Host "Template ID: $($templateDetails.id)"

    $variableCount = if ($templateDetails.variables) { $templateDetails.variables.Count } else { 0 }
    Write-Host "Variables available: $variableCount"
    Write-Host "PDF Preview: $pdfPreview"
}
catch {
    Write-Error "Browsing workflow failed: $($_.Exception.Message)"
    exit 1
}