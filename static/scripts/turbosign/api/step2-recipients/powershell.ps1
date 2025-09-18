# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://www.turbodocx.com/turbosign"
$DOCUMENT_NAME = "Contract Agreement"

# Step 2: Add Recipients
$documentId = "4a20eca5-7944-430c-97d5-fcce4be24296"

$payload = @{
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

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $API_TOKEN"
    'x-rapiddocx-org-id' = $ORG_ID
    'User-Agent' = 'TurboDocx API Client'
}

$response = Invoke-RestMethod -Uri "$BASE_URL/documents/$documentId/update-with-recipients" -Method Post -Body $payload -Headers $headers -ContentType 'application/json'
$response | ConvertTo-Json