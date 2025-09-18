# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"
$DOCUMENT_NAME = "Contract Agreement"

# Complete Workflow: Upload → Recipients → Prepare

# Step 1: Upload Document
$boundary = "----PowerShellBoundary$([System.Guid]::NewGuid())"
$filePath = "./document.pdf"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)

$formData = @"
--$boundary
Content-Disposition: form-data; name="name"

$DOCUMENT_NAME
--$boundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

"@

$formDataBytes = [System.Text.Encoding]::UTF8.GetBytes($formData)
$endBoundary = [System.Text.Encoding]::UTF8.GetBytes("`r`n--$boundary--`r`n")

$uploadBody = New-Object byte[] ($formDataBytes.Length + $fileBytes.Length + $endBoundary.Length)
[Array]::Copy($formDataBytes, 0, $uploadBody, 0, $formDataBytes.Length)
[Array]::Copy($fileBytes, 0, $uploadBody, $formDataBytes.Length, $fileBytes.Length)
[Array]::Copy($endBoundary, 0, $uploadBody, $formDataBytes.Length + $fileBytes.Length, $endBoundary.Length)

$uploadHeaders = @{
    'Authorization' = "Bearer $API_TOKEN"
    'x-rapiddocx-org-id' = $ORG_ID
    'User-Agent' = 'TurboDocx API Client'
    'Content-Type' = "multipart/form-data; boundary=$boundary"
}

$uploadResponse = Invoke-RestMethod -Uri "$BASE_URL/documents/upload" -Method Post -Body $uploadBody -Headers $uploadHeaders
$documentId = $uploadResponse.data.id

# Step 2: Add Recipients
$recipientPayload = @{
    document = @{
        name = "$DOCUMENT_NAME - Updated"
        description = "This document requires electronic signatures from both parties. Please review all content carefully before signing."
    }
    recipients = @(
        @{
            name = "John Smith"
            email = "john.smith@company.com"
            signingOrder = 1
            metadata = @{
                color = "hsl(200, 75%, 50%)"
                lightColor = "hsl(200, 75%, 93%)"
            }
            documentId = $documentId
        },
        @{
            name = "Jane Doe"
            email = "jane.doe@partner.com"
            signingOrder = 2
            metadata = @{
                color = "hsl(270, 75%, 50%)"
                lightColor = "hsl(270, 75%, 93%)"
            }
            documentId = $documentId
        }
    )
} | ConvertTo-Json -Depth 10

$recipientHeaders = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $API_TOKEN"
    'x-rapiddocx-org-id' = $ORG_ID
    'User-Agent' = 'TurboDocx API Client'
}

$recipientResponse = Invoke-RestMethod -Uri "$BASE_URL/documents/$documentId/update-with-recipients" -Method Post -Body $recipientPayload -Headers $recipientHeaders -ContentType 'application/json'
$recipients = $recipientResponse.data.recipients

# Step 3: Prepare for Signing
$signatureFields = @(
    @{
        recipientId = $recipients[0].id
        type = "signature"
        template = @{
            anchor = "{Signature1}"
            placement = "replace"
            size = @{ width = 200; height = 80 }
            offset = @{ x = 0; y = 0 }
            caseSensitive = $true
            useRegex = $false
        }
        defaultValue = ""
        required = $true
    },
    @{
        recipientId = $recipients[0].id
        type = "date"
        template = @{
            anchor = "{Date1}"
            placement = "replace"
            size = @{ width = 150; height = 30 }
            offset = @{ x = 0; y = 0 }
            caseSensitive = $true
            useRegex = $false
        }
        defaultValue = ""
        required = $true
    },
    @{
        recipientId = $recipients[1].id
        type = "signature"
        template = @{
            anchor = "{Signature2}"
            placement = "replace"
            size = @{ width = 200; height = 80 }
            offset = @{ x = 0; y = 0 }
            caseSensitive = $true
            useRegex = $false
        }
        defaultValue = ""
        required = $true
    },
    @{
        recipientId = $recipients[1].id
        type = "text"
        template = @{
            anchor = "{Title2}"
            placement = "replace"
            size = @{ width = 200; height = 30 }
            offset = @{ x = 0; y = 0 }
            caseSensitive = $true
            useRegex = $false
        }
        defaultValue = "Business Partner"
        required = $false
    }
) | ConvertTo-Json -Depth 10

$prepareHeaders = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $API_TOKEN"
    'x-rapiddocx-org-id' = $ORG_ID
    'User-Agent' = 'TurboDocx API Client'
}

$finalResponse = Invoke-RestMethod -Uri "$BASE_URL/documents/$documentId/prepare-for-signing" -Method Post -Body $signatureFields -Headers $prepareHeaders -ContentType 'application/json'
$finalResponse | ConvertTo-Json