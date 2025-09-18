<?php
// Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN";
$ORG_ID = "YOUR_ORGANIZATION_ID";
$BASE_URL = "https://api.turbodocx.com";
$DOCUMENT_NAME = "Contract Agreement";

// Step 1: Upload Document
$url = $BASE_URL . '/documents/upload';

$headers = [
    'Authorization: Bearer ' . $API_TOKEN,
    'x-rapiddocx-org-id: ' . $ORG_ID,
    'User-Agent: TurboDocx API Client'
];

$postFields = [
    'name' => $DOCUMENT_NAME,
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