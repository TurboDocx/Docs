<?php
/**
 * Path B: Browse and Select Existing Templates
 * Lists templates and folders, loads one template's details, then its PDF preview link
 */

// Configuration - Update these values
$apiToken = "YOUR_API_TOKEN";
$orgId = "YOUR_ORGANIZATION_ID";
$baseUrl = "https://api.turbodocx.com";

function turboDocxGet($url, $apiToken, $orgId) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiToken,
            'x-rapiddocx-org-id: ' . $orgId,
            'User-Agent: TurboDocx API Client'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        throw new Exception("cURL error: " . $error);
    }

    if ($httpCode !== 200) {
        throw new Exception("HTTP error " . $httpCode . ": " . $response);
    }

    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    return $result;
}

function browseTemplates($apiToken, $orgId, $baseUrl, $limit = 25, $offset = 0, $query = '', $showTags = true, $selectedTags = []) {
    $params = [
        'limit' => $limit,
        'offset' => $offset,
        'showTags' => $showTags ? 'true' : 'false'
    ];

    if ($query !== '') {
        $params['query'] = $query;
    }

    $queryString = http_build_query($params);

    // Repeat selectedTags once per tag ID (the API reads ?selectedTags=<id>&selectedTags=<id>)
    foreach ($selectedTags as $tagId) {
        $queryString .= '&selectedTags=' . urlencode($tagId);
    }

    $result = turboDocxGet($baseUrl . "/template-item?" . $queryString, $apiToken, $orgId);
    $data = $result['data'];

    echo "Found " . $data['totalRecords'] . " templates/folders\n";

    return $data;
}

function getTemplateDetails($apiToken, $orgId, $baseUrl, $templateId) {
    $result = turboDocxGet($baseUrl . "/template/" . urlencode($templateId), $apiToken, $orgId);
    $template = $result['data']['results'];

    echo "Template: " . $template['name'] . "\n";
    echo "Variables: " . (isset($template['variables']) ? count($template['variables']) : 0) . "\n";
    echo "Default font: " . ($template['defaultFont'] ?? 'N/A') . "\n";

    return $template;
}

function getTemplatePdfPreview($apiToken, $orgId, $baseUrl, $templateId) {
    $result = turboDocxGet($baseUrl . "/template/" . urlencode($templateId) . "/previewpdflink", $apiToken, $orgId);
    $pdfUrl = $result['results'];

    echo "PDF Preview: " . $pdfUrl . "\n";

    return $pdfUrl;
}

// Example usage - Complete browsing workflow
try {
    echo "=== Path B: Browse and Select Template ===\n";

    // Step 1: Browse templates
    echo "\n1. Browsing templates...\n";
    $browseResult = browseTemplates($apiToken, $orgId, $baseUrl, 10, 0, 'contract', true);

    // Find a template (not a folder)
    $selectedTemplate = null;
    foreach ($browseResult['results'] as $item) {
        if ($item['type'] === 'template') {
            $selectedTemplate = $item;
            break;
        }
    }

    if ($selectedTemplate === null) {
        echo "No templates found in browse results\n";
        exit(1);
    }

    echo "\nSelected template: " . $selectedTemplate['name'] . " (" . $selectedTemplate['id'] . ")\n";

    // Step 2: Get detailed template information
    echo "\n2. Getting template details...\n";
    $templateDetails = getTemplateDetails($apiToken, $orgId, $baseUrl, $selectedTemplate['id']);

    // Step 3: Get PDF preview (optional)
    echo "\n3. Getting PDF preview...\n";
    $pdfPreview = getTemplatePdfPreview($apiToken, $orgId, $baseUrl, $selectedTemplate['id']);

    echo "\n=== Template Ready for Generation ===\n";
    echo "Template ID: " . $templateDetails['id'] . "\n";
    echo "Variables available: " . (isset($templateDetails['variables']) ? count($templateDetails['variables']) : 0) . "\n";
    echo "PDF Preview: " . $pdfPreview . "\n";

} catch (Exception $e) {
    echo "Browsing workflow failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
