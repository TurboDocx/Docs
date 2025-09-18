# Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN"
$ORG_ID = "YOUR_ORGANIZATION_ID"
$BASE_URL = "https://api.turbodocx.com"
$DOCUMENT_NAME = "Contract Agreement"

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

$body = New-Object byte[] ($formDataBytes.Length + $fileBytes.Length + $endBoundary.Length)
[Array]::Copy($formDataBytes, 0, $body, 0, $formDataBytes.Length)
[Array]::Copy($fileBytes, 0, $body, $formDataBytes.Length, $fileBytes.Length)
[Array]::Copy($endBoundary, 0, $body, $formDataBytes.Length + $fileBytes.Length, $endBoundary.Length)

$headers = @{
    'Authorization' = "Bearer $API_TOKEN"
    'x-rapiddocx-org-id' = $ORG_ID
    'User-Agent' = 'TurboDocx API Client'
    'Content-Type' = "multipart/form-data; boundary=$boundary"
}

$response = Invoke-RestMethod -Uri "$BASE_URL/documents/upload" -Method Post -Body $body -Headers $headers
$response | ConvertTo-Json