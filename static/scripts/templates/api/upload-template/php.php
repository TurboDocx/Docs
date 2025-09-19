<?php
/**
 * Path A: Upload and Create Template
 * Uploads a .docx/.pptx template and extracts variables automatically
 */

// Configuration - Update these values
$apiToken = "YOUR_API_TOKEN";
$orgId = "YOUR_ORGANIZATION_ID";
$baseUrl = "https://api.turbodocx.com";
$templateName = "Employee Contract Template";
$templateFile = "./contract-template.docx";

function uploadTemplate($apiToken, $orgId, $baseUrl, $templateName, $templateFile) {
    $url = $baseUrl . "/template/upload-and-create";

    // Check if file exists
    if (!file_exists($templateFile)) {
        throw new Exception("Template file not found: " . $templateFile);
    }

    // Prepare headers
    $headers = [
        'Authorization: Bearer ' . $apiToken,
        'x-rapiddocx-org-id: ' . $orgId,
        'User-Agent: TurboDocx API Client'
    ];

    // Prepare POST data
    $postData = [
        'templateFile' => new CURLFile($templateFile, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', basename($templateFile)),
        'name' => $templateName,
        'description' => 'Standard employee contract with variable placeholders',
        'variables' => '[]',
        'tags' => '["hr", "contract", "template"]'
    ];

    // Initialize cURL
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT => 60
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        throw new Exception("cURL error: " . $error);
    }

    if ($httpCode !== 200) {
        throw new Exception("HTTP error: " . $httpCode . " - " . $response);
    }

    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    return $result;
}

// Example usage
try {
    $result = uploadTemplate($apiToken, $orgId, $baseUrl, $templateName, $templateFile);
    $template = $result['data']['template'];

    echo "Template uploaded successfully: " . $template['id'] . "\n";
    echo "Variables extracted: " . count($template['variables']) . "\n";
    echo "Redirect to: " . $result['data']['redirectUrl'] . "\n";

    echo "Ready to generate documents with template: " . $template['id'] . "\n";

} catch (Exception $e) {
    echo "Upload failed: " . $e->getMessage() . "\n";
}
?>