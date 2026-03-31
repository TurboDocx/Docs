<?php

// Configuration
$API_TOKEN = "YOUR_API_TOKEN";
$ORG_ID = "YOUR_ORGANIZATION_ID";
$BASE_URL = "https://api.turbodocx.com";

function generateAIVariable() {
    global $API_TOKEN, $ORG_ID, $BASE_URL;

    $url = $BASE_URL . "/ai/generate/variable/one";

    $payload = array(
        'name' => 'Company Performance Summary',
        'placeholder' => '{Q4Performance}',
        'aiHint' => 'Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements',
        'richTextEnabled' => true
    );

    $jsonPayload = json_encode($payload);

    // Set up headers
    $headers = array(
        'Authorization: Bearer ' . $API_TOKEN,
        'x-rapiddocx-org-id: ' . $ORG_ID,
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonPayload)
    );

    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_error($ch)) {
        throw new Exception("cURL error: " . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("AI generation failed: HTTP " . $httpCode);
    }

    $result = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    echo "Generated variable: " . json_encode($result['data']) . "\n";
    return $result;
}

// Run the example
try {
    generateAIVariable();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

?>