<?php
// Step 1: Upload Document
$url = 'https://www.turbodocx.com/turbosign/documents/upload';

$headers = [
    'Authorization: Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id: YOUR_ORGANIZATION_ID',
    'origin: https://www.turbodocx.com',
    'referer: https://www.turbodocx.com',
    'accept: application/json, text/plain, */*'
];

$postFields = [
    'name' => 'Contract Agreement',
    'file' => new CURLFile('./document.pdf', 'application/pdf', 'document.pdf')
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>