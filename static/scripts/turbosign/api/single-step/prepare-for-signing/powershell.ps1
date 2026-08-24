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
# A controlling checkbox carries a stable metadata.fieldKey; a dependent field
# references it with metadata.conditional.controllingFieldKey. Here, checking
# "Request changes" reveals a text box asking the signer to explain.
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
    },
    # Controlling checkbox — carries a stable fieldKey
    @{
        recipientEmail = "john.smith@company.com"
        type = "checkbox"
        page = 1
        x = 100
        y = 400
        width = 20
        height = 20
        required = $false
        metadata = @{
            fieldKey = "request_changes"
        }
    },
    # Dependent text field — hidden until the checkbox above is checked
    @{
        recipientEmail = "john.smith@company.com"
        type = "text"
        page = 1
        x = 130
        y = 400
        width = 300
        height = 60
        required = $false
        defaultValue = ""
        metadata = @{
            conditional = @{
                controllingFieldKey = "request_changes"  # = the checkbox's fieldKey
                operator = "is_checked"                  # "is_checked" | "is_not_checked"
                action = "show"                          # "show" (hidden until met) | "unlock" (locked until met)
            }
        }
    }
) | ConvertTo-Json -Compress -Depth 10

# Optional: CC emails
$ccEmails = @("manager@company.com", "legal@company.com") | ConvertTo-Json -Compress

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
    "--$boundary",
    "Content-Disposition: form-data; name=`"ccEmails`"",
    "",
    $ccEmails,
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
        -Uri "$BASE_URL/turbosign/single/prepare-for-signing" `
        -Method Post `
        -Headers $headers `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

    if ($response.success) {
        Write-Host "✅ Document sent for signing" -ForegroundColor Green
        Write-Host "Document ID: $($response.documentId)"
        Write-Host "Message: $($response.message)"
        Write-Host "`n📧 Emails are being sent to recipients asynchronously"
        Write-Host "💡 Tip: Set up webhooks to receive notifications when signing is complete"
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
