<?php

// Configuration - Update these values
$API_TOKEN = "YOUR_API_TOKEN";
$ORG_ID = "YOUR_ORGANIZATION_ID";
$BASE_URL = "https://api.turbodocx.com";

/**
 * Upload template with Excel data file attachment and sheet selection
 */
function uploadTemplateWithDataFile() {
    global $API_TOKEN, $ORG_ID, $BASE_URL;

    echo "📊 PHP: Upload template with Excel data file attachment\n";
    echo "====================================================\n";

    $templateFile = './financial-report-template.docx';
    $dataFile = './q4-financial-data.xlsx';

    // Check if files exist
    if (!file_exists($templateFile)) {
        throw new Exception("Template file not found: $templateFile");
    }
    if (!file_exists($dataFile)) {
        throw new Exception("Data file not found: $dataFile");
    }

    $dataFileId = 'php-data-123';

    echo "Template: $templateFile\n";
    echo "Data Source: $dataFile (Sheet: Income Statement)\n";
    echo "Data Range: A1:F50\n\n";

    // Prepare cURL
    $ch = curl_init();

    // File metadata
    $fileMetadata = json_encode([
        $dataFileId => [
            'selectedSheet' => 'Income Statement',
            'hasMultipleSheets' => true,
            'dataRange' => 'A1:F50',
            'description' => 'Q4 financial data for AI variable generation'
        ]
    ]);

    // Variables
    $variables = json_encode([
        [
            'name' => 'Revenue Summary',
            'placeholder' => '{RevenueSummary}',
            'aiHint' => 'Generate revenue summary from attached financial data',
            'dataSourceId' => $dataFileId
        ],
        [
            'name' => 'Expense Analysis',
            'placeholder' => '{ExpenseAnalysis}',
            'aiHint' => 'Analyze expense trends from Q4 data',
            'dataSourceId' => $dataFileId
        ]
    ]);

    // Tags
    $tags = json_encode(['php-upload', 'financial', 'q4', 'ai-enhanced', 'data-driven']);

    // Prepare POST fields
    $postFields = [
        'templateFile' => new CURLFile($templateFile),
        "FileResource-$dataFileId" => new CURLFile($dataFile),
        'name' => 'Q4 Financial Report Template (PHP)',
        'description' => 'Financial report template with Excel data integration uploaded via PHP',
        'fileResourceMetadata' => $fileMetadata,
        'variables' => $variables,
        'tags' => $tags
    ];

    // Set cURL options
    curl_setopt_array($ch, [
        CURLOPT_URL => "$BASE_URL/template/upload-and-create",
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $API_TOKEN",
            "x-rapiddocx-org-id: $ORG_ID",
            "User-Agent: TurboDocx PHP Client"
        ]
    ]);

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_error($ch)) {
        throw new Exception("cURL error: " . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("API error: HTTP $httpCode - $response");
    }

    $result = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    $template = $result['data']['results']['template'];

    echo "✅ Template with data file uploaded successfully!\n";
    echo "Template ID: " . $template['id'] . "\n";
    echo "Template Name: " . $template['name'] . "\n";
    echo "Variables Extracted: " . (isset($template['variables']) ? count($template['variables']) : 0) . "\n";
    echo "Default Font: " . ($template['defaultFont'] ?? 'N/A') . "\n";
    echo "🔗 Redirect URL: " . $result['data']['results']['redirectUrl'] . "\n";

    return $template;
}

/**
 * Upload template with multiple sheets from the same Excel file
 */
function uploadTemplateWithMultipleSheets() {
    global $API_TOKEN, $ORG_ID, $BASE_URL;

    echo "\n📈 PHP: Upload template with multi-sheet data\n";
    echo "============================================\n";

    $templateFile = './comprehensive-report-template.docx';
    $dataFile = './business-data.xlsx';

    // Check if files exist
    if (!file_exists($templateFile)) {
        throw new Exception("Template file not found: $templateFile");
    }
    if (!file_exists($dataFile)) {
        throw new Exception("Data file not found: $dataFile");
    }

    $dataFileId = 'php-multisheet-456';

    echo "Template: $templateFile\n";
    echo "Data Source: $dataFile\n";
    echo "Primary Sheet: Summary\n";
    echo "Alternative Sheets: Revenue, Expenses, Projections\n\n";

    // Prepare cURL
    $ch = curl_init();

    // File metadata for multiple sheets
    $fileMetadata = json_encode([
        $dataFileId => [
            'selectedSheet' => 'Summary',
            'hasMultipleSheets' => true,
            'alternativeSheets' => ['Revenue', 'Expenses', 'Projections'],
            'dataRange' => 'A1:Z100',
            'description' => 'Comprehensive business data across multiple sheets'
        ]
    ]);

    // Variables that reference different sheets
    $variables = json_encode([
        [
            'name' => 'Executive Summary',
            'placeholder' => '{ExecutiveSummary}',
            'aiHint' => 'Create executive summary from Summary sheet data',
            'dataSourceId' => $dataFileId,
            'sheetReference' => 'Summary'
        ],
        [
            'name' => 'Revenue Analysis',
            'placeholder' => '{RevenueAnalysis}',
            'aiHint' => 'Analyze revenue trends from Revenue sheet',
            'dataSourceId' => $dataFileId,
            'sheetReference' => 'Revenue'
        ],
        [
            'name' => 'Expense Insights',
            'placeholder' => '{ExpenseInsights}',
            'aiHint' => 'Generate expense insights from Expenses sheet',
            'dataSourceId' => $dataFileId,
            'sheetReference' => 'Expenses'
        ]
    ]);

    // Tags
    $tags = json_encode(['php-multi-sheet', 'comprehensive', 'business-analysis']);

    // Prepare POST fields
    $postFields = [
        'templateFile' => new CURLFile($templateFile),
        "FileResource-$dataFileId" => new CURLFile($dataFile),
        'name' => 'Comprehensive Business Report (PHP Multi-Sheet)',
        'description' => 'Multi-sheet data analysis template uploaded via PHP',
        'fileResourceMetadata' => $fileMetadata,
        'variables' => $variables,
        'tags' => $tags
    ];

    // Set cURL options
    curl_setopt_array($ch, [
        CURLOPT_URL => "$BASE_URL/template/upload-and-create",
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $API_TOKEN",
            "x-rapiddocx-org-id: $ORG_ID",
            "User-Agent: TurboDocx PHP Client"
        ]
    ]);

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_error($ch)) {
        throw new Exception("cURL error: " . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("API error: HTTP $httpCode - $response");
    }

    $result = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    $template = $result['data']['results']['template'];

    echo "✅ Multi-sheet template uploaded successfully!\n";
    echo "Template ID: " . $template['id'] . "\n";
    echo "Template Name: " . $template['name'] . "\n";
    echo "Variables with Sheet References: " . (isset($template['variables']) ? count($template['variables']) : 0) . "\n";
    echo "Sheets Configured: Summary (primary), Revenue, Expenses, Projections\n";

    return $template;
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
    global $API_TOKEN, $ORG_ID;

    if ($API_TOKEN === 'YOUR_API_TOKEN' || $ORG_ID === 'YOUR_ORGANIZATION_ID') {
        throw new Exception("Please update API_TOKEN and ORG_ID in this script.");
    }

    // Check if cURL is available
    if (!function_exists('curl_init')) {
        throw new Exception("cURL extension is not installed. Please install php-curl.");
    }

    // Check if JSON functions are available
    if (!function_exists('json_encode') || !function_exists('json_decode')) {
        throw new Exception("JSON extension is not available. Please install php-json.");
    }

    echo "✅ Prerequisites check passed\n";
}

/**
 * Create sample files info
 */
function createSampleFilesInfo() {
    echo "\n📝 Required sample files:\n";
    echo "Note: In a real scenario, you would have:\n";
    echo "  • financial-report-template.docx - Your Word template file\n";
    echo "  • q4-financial-data.xlsx - Excel file with financial data\n";
    echo "  • comprehensive-report-template.docx - Multi-purpose template\n";
    echo "  • business-data.xlsx - Excel file with multiple sheets\n\n";
    echo "For testing, make sure these files exist in the current directory.\n\n";
}

/**
 * Main execution
 */
function main() {
    echo "🚀 TurboDocx PHP File Attachment Examples\n";
    echo "=========================================\n";

    try {
        // Check prerequisites
        checkPrerequisites();

        // Show sample files info
        createSampleFilesInfo();

        // Example 1: Single sheet data attachment
        uploadTemplateWithDataFile();
        echo "\n✅ Example 1 completed successfully!\n";

        // Example 2: Multiple sheet data attachment
        uploadTemplateWithMultipleSheets();
        echo "\n✅ Example 2 completed successfully!\n";

        echo "\n🎉 All PHP file attachment examples completed!\n";
        echo "Ready to generate documents with data-enhanced templates!\n";

    } catch (Exception $e) {
        echo "\n❌ Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}

// Handle command line arguments
if (isset($argv[1])) {
    switch ($argv[1]) {
        case '--help':
        case '-h':
            echo "TurboDocx PHP File Attachment Examples\n\n";
            echo "Usage: php " . basename(__FILE__) . " [OPTIONS]\n\n";
            echo "Options:\n";
            echo "  --help, -h    Show this help message\n";
            echo "  --single      Run only single sheet example\n";
            echo "  --multi       Run only multi-sheet example\n\n";
            echo "Before running:\n";
            echo "  1. Update API_TOKEN and ORG_ID in this script\n";
            echo "  2. Ensure sample files exist in current directory\n";
            echo "  3. Install required PHP extensions: curl, json\n";
            exit(0);

        case '--single':
            try {
                checkPrerequisites();
                uploadTemplateWithDataFile();
                echo "✅ Single sheet example completed!\n";
            } catch (Exception $e) {
                echo "❌ Error: " . $e->getMessage() . "\n";
                exit(1);
            }
            break;

        case '--multi':
            try {
                checkPrerequisites();
                uploadTemplateWithMultipleSheets();
                echo "✅ Multi-sheet example completed!\n";
            } catch (Exception $e) {
                echo "❌ Error: " . $e->getMessage() . "\n";
                exit(1);
            }
            break;

        default:
            echo "Unknown option: " . $argv[1] . "\n";
            echo "Use --help for usage information.\n";
            exit(1);
    }
} else {
    // Run all examples
    main();
}

?>