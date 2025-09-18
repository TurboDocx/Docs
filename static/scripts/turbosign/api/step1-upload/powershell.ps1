# Step 1: Upload Document
$boundary = "----PowerShellBoundary$([System.Guid]::NewGuid())"
$filePath = "./document.pdf"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)

$formData = @"
--$boundary
Content-Disposition: form-data; name="name"

Contract Agreement
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
    'Authorization' = 'Bearer YOUR_API_TOKEN'
    'x-rapiddocx-org-id' = 'YOUR_ORGANIZATION_ID'
    'User-Agent' = 'TurboDocx API Client'
    'Content-Type' = "multipart/form-data; boundary=$boundary"
}

$response = Invoke-RestMethod -Uri "https://www.turbodocx.com/turbosign/documents/upload" -Method Post -Body $body -Headers $headers
$response | ConvertTo-Json