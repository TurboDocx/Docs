# Step 2: Add Recipients
$documentId = "4a20eca5-7944-430c-97d5-fcce4be24296"

$payload = @{
    document = @{
        name = "Contract Agreement - Updated"
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
    'Authorization' = 'Bearer YOUR_API_TOKEN'
    'x-rapiddocx-org-id' = 'YOUR_ORGANIZATION_ID'
    'origin' = 'https://www.turbodocx.com'
    'referer' = 'https://www.turbodocx.com'
    'accept' = 'application/json, text/plain, */*'
}

$response = Invoke-RestMethod -Uri "https://www.turbodocx.com/turbosign/documents/$documentId/update-with-recipients" -Method Post -Body $payload -Headers $headers -ContentType 'application/json'
$response | ConvertTo-Json