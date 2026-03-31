<?php

// Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN";
$ORG_ID = "YOUR_ORGANIZATION_ID";
$BASE_URL = "https://api.turbodocx.com";

/**
 * Final Step: Generate Deliverable (Both Paths Converge Here)
 */
function generateDeliverable($templateId, $deliverableData) {
    global $API_TOKEN, $ORG_ID, $BASE_URL;

    $url = $BASE_URL . "/v1/deliverable";

    echo "Generating deliverable...\n";
    echo "Template ID: " . $templateId . "\n";
    echo "Deliverable Name: " . $deliverableData['name'] . "\n";
    echo "Variables: " . count($deliverableData['variables']) . "\n";

    $headers = [
        "Authorization: Bearer " . $API_TOKEN,
        "x-rapiddocx-org-id: " . $ORG_ID,
        "User-Agent: TurboDocx API Client",
        "Content-Type: application/json",
    ];

    $jsonBody = json_encode($deliverableData);
    if ($jsonBody === false) {
        throw new Exception("Failed to encode deliverable data as JSON: " . json_last_error_msg());
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonBody);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL error: " . $error);
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("HTTP error " . $httpCode . ": " . $response);
    }

    $result = json_decode($response, true);
    if ($result === null) {
        throw new Exception("Failed to parse JSON response: " . json_last_error_msg());
    }

    $deliverable = $result['data']['results']['deliverable'];

    echo "Deliverable generated successfully!\n";
    echo "Deliverable ID: " . $deliverable['id'] . "\n";
    echo "Created by: " . $deliverable['createdBy'] . "\n";
    echo "Created on: " . $deliverable['createdOn'] . "\n";
    echo "Template ID: " . $deliverable['templateId'] . "\n";

    return $deliverable;
}

/**
 * Download a generated deliverable file
 */
function downloadDeliverable($deliverableId, $filename) {
    global $API_TOKEN, $ORG_ID, $BASE_URL;

    echo "Downloading file: " . $filename . "\n";

    $url = $BASE_URL . "/v1/deliverable/file/" . $deliverableId;

    $headers = [
        "Authorization: Bearer " . $API_TOKEN,
        "x-rapiddocx-org-id: " . $ORG_ID,
        "User-Agent: TurboDocx API Client",
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL error: " . $error);
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode !== 200) {
        curl_close($ch);
        throw new Exception("Download failed: HTTP " . $httpCode);
    }

    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: 'N/A';
    $contentLength = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
    $contentLengthStr = ($contentLength >= 0) ? $contentLength . " bytes" : "N/A";

    curl_close($ch);

    echo "File ready for download: " . $filename . "\n";
    echo "Content-Type: " . $contentType . "\n";
    echo "Content-Length: " . $contentLengthStr . "\n";

    // In a real application, you would save the file
    // file_put_contents($filename, $response);

    return [
        'filename' => $filename,
        'content_type' => $contentType,
        'content_length' => $contentLengthStr,
    ];
}

// Example usage
try {
    echo "=== Final Step: Generate Deliverable ===\n";

    // This would come from either Path A (upload) or Path B (browse/select)
    $templateId = "0b1099cf-d7b9-41a4-822b-51b68fd4885a";

    $deliverableData = [
        'templateId' => $templateId,
        'name' => 'Employee Contract - John Smith',
        'description' => 'Employment contract for new senior developer',
        'variables' => [
            ['placeholder' => '{EmployeeName}', 'text' => 'John Smith', 'mimeType' => 'text'],
            ['placeholder' => '{CompanyName}', 'text' => 'TechCorp Solutions Inc.', 'mimeType' => 'text'],
            ['placeholder' => '{JobTitle}', 'text' => 'Senior Software Engineer', 'mimeType' => 'text'],
            [
                'mimeType' => 'html',
                'placeholder' => '{ContactBlock}',
                'text' => '<div><p>Contact: {contactName}</p><p>Phone: {contactPhone}</p></div>',
                'subvariables' => [
                    ['placeholder' => '{contactName}', 'text' => 'Jane Doe', 'mimeType' => 'text'],
                    ['placeholder' => '{contactPhone}', 'text' => '(555) 123-4567', 'mimeType' => 'text'],
                ],
            ],
        ],
        'tags' => ['hr', 'contract', 'employee'],
    ];

    $deliverable = generateDeliverable($templateId, $deliverableData);

    // Download the generated file
    echo "\n=== Download Generated File ===\n";
    downloadDeliverable($deliverable['id'], $deliverable['name'] . ".docx");

} catch (Exception $e) {
    echo "Deliverable generation failed: " . $e->getMessage() . "\n";
    exit(1);
}
