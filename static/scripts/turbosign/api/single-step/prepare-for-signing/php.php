<?php

// Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN";
$ORG_ID = "YOUR_ORGANIZATION_ID";
$BASE_URL = "https://api.turbodocx.com";

// Initialize cURL
$ch = curl_init();

// Prepare recipients (as JSON string)
$recipients = json_encode([
    [
        "name" => "John Smith",
        "email" => "john.smith@company.com",
        "signingOrder" => 1
    ],
    [
        "name" => "Jane Doe",
        "email" => "jane.doe@partner.com",
        "signingOrder" => 2
    ]
]);

// Prepare fields (as JSON string) - Coordinate-based positioning
$fields = json_encode([
    [
        "recipientEmail" => "john.smith@company.com",
        "type" => "signature",
        "page" => 1,
        "x" => 100,
        "y" => 200,
        "width" => 200,
        "height" => 80,
        "required" => true
    ],
    [
        "recipientEmail" => "john.smith@company.com",
        "type" => "date",
        "page" => 1,
        "x" => 100,
        "y" => 300,
        "width" => 150,
        "height" => 30,
        "required" => true
    ],
    [
        "recipientEmail" => "jane.doe@partner.com",
        "type" => "signature",
        "page" => 1,
        "x" => 350,
        "y" => 200,
        "width" => 200,
        "height" => 80,
        "required" => true
    ]
]);

// Optional: Add CC emails
$ccEmails = json_encode(["manager@company.com", "legal@company.com"]);

// Prepare POST fields
$postFields = [
    'file' => new CURLFile('./contract.pdf', 'application/pdf', 'contract.pdf'),
    'documentName' => 'Contract Agreement',
    'documentDescription' => 'Please review and sign this contract',
    'senderName' => 'Your Company',
    'senderEmail' => 'sender@company.com',
    'recipients' => $recipients,
    'fields' => $fields,
    'ccEmails' => $ccEmails
];

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_URL => $BASE_URL . '/turbosign/single/prepare-for-signing',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $API_TOKEN,
        'x-rapiddocx-org-id: ' . $ORG_ID,
        'User-Agent: TurboDocx API Client'
    ]
]);

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch) . "\n";
    curl_close($ch);
    exit(1);
}

curl_close($ch);

// Parse response
$result = json_decode($response, true);

if ($result['success']) {
    echo "✅ Document sent for signing\n";
    echo "Document ID: " . $result['documentId'] . "\n";
    echo "Message: " . $result['message'] . "\n";
    echo "\n📧 Emails are being sent to recipients asynchronously\n";
    echo "💡 Tip: Set up webhooks to receive notifications when signing is complete\n";
} else {
    echo "❌ Error: " . ($result['error'] ?? $result['message']) . "\n";
    if (isset($result['code'])) {
        echo "Error Code: " . $result['code'] . "\n";
    }
    exit(1);
}

?>
