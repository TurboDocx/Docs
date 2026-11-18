<?php
/**
 * Complete Template Workflow
 * Path A: upload a new template, Path B: browse and select an existing one.
 * Both paths then generate a deliverable and download it.
 */

// Configuration - Update these values
$apiToken = "YOUR_API_TOKEN";
$orgId = "YOUR_ORGANIZATION_ID";
$baseUrl = "https://api.turbodocx.com";

class TemplateWorkflowManager
{
    private $apiToken;
    private $orgId;
    private $baseUrl;

    public function __construct($apiToken, $orgId, $baseUrl)
    {
        $this->apiToken = $apiToken;
        $this->orgId = $orgId;
        $this->baseUrl = $baseUrl;
        echo "=== TurboDocx Template Generation Workflow Manager ===\n";
    }

    public function demonstrateCompleteWorkflow()
    {
        echo "\n=== Demonstrating Path A: Upload Template ===\n";
        $templateIdA = $this->demonstrateUploadWorkflow();

        echo "\n=== Demonstrating Path B: Browse Templates ===\n";
        $templateIdB = $this->demonstrateBrowseWorkflow();

        if ($templateIdA) {
            echo "\n=== Generating Deliverable from Uploaded Template ===\n";
            $this->generateAndDownloadDeliverable($templateIdA, "A");
        }

        if ($templateIdB) {
            echo "\n=== Generating Deliverable from Selected Template ===\n";
            $this->generateAndDownloadDeliverable($templateIdB, "B");
        }
    }

    // ===============================
    // PATH A: Upload New Template
    // ===============================

    private function demonstrateUploadWorkflow()
    {
        try {
            echo "\n--- Path A: Upload and Create Template ---\n";

            $templateFile = "./contract-template.docx";
            if (!file_exists($templateFile)) {
                echo "Template file not found: " . $templateFile . "\n";
                return null;
            }

            $result = $this->uploadTemplate($templateFile);
            $template = $result['data']['results']['template'];

            echo "Upload workflow completed\n";
            echo "Template ID: " . $template['id'] . "\n";

            return $template['id'];
        } catch (Exception $e) {
            echo "Upload workflow failed: " . $e->getMessage() . "\n";
            return null;
        }
    }

    private function uploadTemplate($templateFile)
    {
        $postData = [
            'templateFile' => new CURLFile($templateFile, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', basename($templateFile)),
            'name' => 'Employee Contract Template',
            'description' => 'Standard employee contract with variable placeholders',
            'variables' => '[]',
            'tags' => '[]'
        ];

        // Upload and create answers 201 Created
        return $this->request('POST', '/template/upload-and-create', $postData, 201);
    }

    // ===============================
    // PATH B: Browse Existing Templates
    // ===============================

    private function demonstrateBrowseWorkflow()
    {
        try {
            echo "\n--- Path B: Browse and Select Template ---\n";

            $browseResult = $this->browseTemplates(10, 0, 'contract', true);

            $selectedTemplate = null;
            foreach ($browseResult['results'] as $item) {
                if ($item['type'] === 'template') {
                    $selectedTemplate = $item;
                    break;
                }
            }

            if ($selectedTemplate === null) {
                echo "No templates found in browse results\n";
                return null;
            }

            echo "Selected: " . $selectedTemplate['name'] . "\n";

            $templateDetails = $this->getTemplateDetails($selectedTemplate['id']);
            $pdfPreview = $this->getTemplatePdfPreview($selectedTemplate['id']);

            echo "Browse workflow completed\n";
            echo "Template ID: " . $templateDetails['id'] . "\n";
            echo "PDF Preview: " . $pdfPreview . "\n";

            return $templateDetails['id'];
        } catch (Exception $e) {
            echo "Browse workflow failed: " . $e->getMessage() . "\n";
            return null;
        }
    }

    private function browseTemplates($limit, $offset, $query, $showTags, $selectedTags = [])
    {
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

        $result = $this->request('GET', '/template-item?' . $queryString);
        echo "Found " . $result['data']['totalRecords'] . " templates/folders\n";

        return $result['data'];
    }

    private function getTemplateDetails($templateId)
    {
        $result = $this->request('GET', '/template/' . urlencode($templateId));
        $template = $result['data']['results'];

        echo "Template: " . $template['name'] . "\n";
        echo "Variables: " . (isset($template['variables']) ? count($template['variables']) : 0) . "\n";

        return $template;
    }

    private function getTemplatePdfPreview($templateId)
    {
        $result = $this->request('GET', '/template/' . urlencode($templateId) . '/previewpdflink');

        return $result['results'];
    }

    // ===============================
    // COMMON: Generate and Download
    // ===============================

    private function generateAndDownloadDeliverable($templateId, $pathLabel)
    {
        try {
            echo "\n--- Generating Deliverable (Path " . $pathLabel . ") ---\n";

            $deliverable = $this->generateDeliverable([
                'templateId' => $templateId,
                'name' => 'Contract Document - Path ' . $pathLabel,
                'description' => 'Employment contract generated via workflow path ' . $pathLabel,
                'variables' => [
                    ['placeholder' => '{EmployeeName}', 'text' => 'John Smith', 'mimeType' => 'text'],
                    ['placeholder' => '{CompanyName}', 'text' => 'TechCorp Solutions Inc.', 'mimeType' => 'text'],
                    ['placeholder' => '{JobTitle}', 'text' => 'Senior Software Engineer', 'mimeType' => 'text']
                ],
                'tags' => ['hr', 'contract', 'employee']
            ]);

            $this->downloadDeliverable($deliverable['id'], $deliverable['name'] . '_path_' . $pathLabel . '.docx');

            echo "Complete workflow finished for Path " . $pathLabel . "\n";
        } catch (Exception $e) {
            echo "Deliverable generation failed for Path " . $pathLabel . ": " . $e->getMessage() . "\n";
        }
    }

    private function generateDeliverable($deliverableData)
    {
        echo "Generating deliverable: " . $deliverableData['name'] . "\n";

        $result = $this->request('POST', '/v1/deliverable', json_encode($deliverableData), 200, true);
        $deliverable = $result['data']['results']['deliverable'];

        echo "Deliverable generated: " . $deliverable['id'] . "\n";

        return $deliverable;
    }

    private function downloadDeliverable($deliverableId, $filename)
    {
        echo "Downloading file: " . $filename . "\n";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/v1/deliverable/file/' . urlencode($deliverableId),
            CURLOPT_HTTPHEADER => $this->headers(),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60
        ]);
        $fileContent = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Download failed: " . $httpCode);
        }

        file_put_contents($filename, $fileContent);
        echo "Saved " . strlen($fileContent) . " bytes to " . $filename . "\n";
    }

    // ===============================
    // HTTP helper
    // ===============================

    private function headers($json = false)
    {
        $headers = [
            'Authorization: Bearer ' . $this->apiToken,
            'x-rapiddocx-org-id: ' . $this->orgId,
            'User-Agent: TurboDocx API Client'
        ];
        if ($json) {
            $headers[] = 'Content-Type: application/json';
        }
        return $headers;
    }

    private function request($method, $path, $body = null, $expectedStatus = 200, $json = false)
    {
        $ch = curl_init();
        $options = [
            CURLOPT_URL => $this->baseUrl . $path,
            CURLOPT_HTTPHEADER => $this->headers($json),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT => 60
        ];
        if ($method === 'POST') {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = $body;
        }
        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL error: " . $error);
        }
        if ($httpCode !== $expectedStatus) {
            throw new Exception("HTTP error " . $httpCode . ": " . $response);
        }

        $result = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }
        return $result;
    }
}

// Example usage
try {
    $workflowManager = new TemplateWorkflowManager($apiToken, $orgId, $baseUrl);
    $workflowManager->demonstrateCompleteWorkflow();

    echo "\n=== Workflow Demonstration Complete ===\n";
    echo "Upload path: when you have a new template to add\n";
    echo "Browse path: when you want to use an existing template\n";
} catch (Exception $e) {
    echo "Workflow demonstration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
