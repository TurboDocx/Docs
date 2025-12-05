# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

# Prepare recipients (as JSON string)
$recipients = @(
    @{
        name = "John Smith"
        email = "john.smith@company.com"
        signingOrder = 1
    },
    @{
        name = "Jane Doe"
        email = "jane.doe@partner.com"
        signingOrder = 2
    }
) | ConvertTo-Json -Compress

# Prepare fields (as JSON string) - Coordinate-based
$fields = @(
    @{
        recipientEmail = "john.smith@company.com"
        type = "signature"
        page = 1
        x = 100
        y = 200
        width = 200
        height = 80
        required = $true
    },
    @{
        recipientEmail = "john.smith@company.com"
        type = "date"
        page = 1
        x = 100
        y = 300
        width = 150
        height = 30
        required = $true
    },
    @{
        recipientEmail = "jane.doe@partner.com"
        type = "signature"
        page = 1
        x = 350
        y = 200
        width = 200
        height = 80
        required = $true
    }
) | ConvertTo-Json -Compress -Depth 10

# Prepare file
$filePath = "./contract.pdf"
$fileName = [System.IO.Path]::GetFileName($filePath)
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileContent = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($fileBytes)

# Create boundary
$boundary = [System.Guid]::NewGuid().ToString()

# Build multipart form data
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: application/pdf",
    "",
    $fileContent,
    "--$boundary",
    "Content-Disposition: form-data; name=`"documentName`"",
    "",
    "Contract Agreement",
    "--$boundary",
    "Content-Disposition: form-data; name=`"documentDescription`"",
    "",
    "Please review and sign this contract",
    "--$boundary",
    "Content-Disposition: form-data; name=`"senderName`"",
    "",
    "Your Company",
    "--$boundary",
    "Content-Disposition: form-data; name=`"senderEmail`"",
    "",
    "sender@company.com",
    "--$boundary",
    "Content-Disposition: form-data; name=`"recipients`"",
    "",
    $recipients,
    "--$boundary",
    "Content-Disposition: form-data; name=`"fields`"",
    "",
    $fields,
    "--$boundary--"
)

$body = $bodyLines -join "`r`n"

# Prepare headers
$headers = @{
    "Authorization" = "Bearer $API_TOKEN"
    "x-rapiddocx-org-id" = $ORG_ID
    "User-Agent" = "TurboDocx API Client"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    # Send request
    $response = Invoke-RestMethod `
        -Uri "$BASE_URL/turbosign/single/prepare-for-review" `
        -Method Post `
        -Headers $headers `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

    if ($response.success) {
        Write-Host "✅ Document prepared for review" -ForegroundColor Green
        Write-Host "Document ID: $($response.documentId)"
        Write-Host "Status: $($response.status)"
        Write-Host "Preview URL: $($response.previewUrl)"
        Write-Host "`n📋 Recipients:"
        foreach ($recipient in $response.recipients) {
            Write-Host "  - $($recipient.name) ($($recipient.email)) - ID: $($recipient.id)"
        }
        Write-Host "`n🔍 Open this URL to preview the document:"
        Write-Host $response.previewUrl
    } else {
        Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
        if ($response.code) {
            Write-Host "Error Code: $($response.code)" -ForegroundColor Red
        }
        exit 1
    }
}
catch {
    Write-Host "❌ Exception: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
