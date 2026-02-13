# Configuration
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"

function Generate-AIVariable {
    $uri = "$BASE_URL/ai/generate/variable/one"

    # Create payload
    $payload = @{
        name = "Company Performance Summary"
        placeholder = "{Q4Performance}"
        aiHint = "Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements"
        richTextEnabled = $true
    } | ConvertTo-Json

    # Create headers
    $headers = @{
        'Authorization' = "Bearer $API_TOKEN"
        'x-rapiddocx-org-id' = $ORG_ID
        'Content-Type' = "application/json"
    }

    # Send request
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $payload
        Write-Host "Generated variable: $($response.data)"
        return $response
    }
    catch {
        Write-Error "AI generation failed: $($_.Exception.Message)"
    }
}

# Run the example
Generate-AIVariable