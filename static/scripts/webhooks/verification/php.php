<?php

/**
 * Verifies a TurboDocx webhook signature
 * 
 * @param array $headers Request headers
 * @param string $body Raw request body
 * @param string $secret Your webhook secret
 * @return bool True if signature is valid
 */
function verifyTurboDocxWebhookSignature(array $headers, string $body, string $secret): bool 
{
    $signature = $headers['X-TurboDocx-Signature'] ?? '';
    $timestamp = $headers['X-TurboDocx-Timestamp'] ?? '';
    
    if (empty($signature) || empty($timestamp) || empty($secret)) {
        return false;
    }
    
    // Check timestamp is within 5 minutes
    $currentTime = time();
    $webhookTime = intval($timestamp);
    
    if (abs($currentTime - $webhookTime) > 300) {
        return false;
    }
    
    // Generate expected signature
    $signedString = $timestamp . '.' . $body;
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $signedString, $secret);
    
    // Use timing-safe comparison
    return hash_equals($signature, $expectedSignature);
}

/**
 * Process webhook event payload
 * 
 * @param array $payload Webhook payload
 */
function processTurboDocxWebhookEvent(array $payload): void 
{
    $eventType = $payload['event'] ?? '';
    
    error_log('Received event: ' . $eventType);
    
    switch ($eventType) {
        case 'signature.document.completed':
            handleDocumentCompleted($payload['data'] ?? []);
            break;
            
        case 'signature.document.voided':
            handleDocumentVoided($payload['data'] ?? []);
            break;
            
        default:
            error_log("Unknown event type: $eventType");
    }
}

/**
 * Handle document completion event
 * 
 * @param array $data Event data
 */
function handleDocumentCompleted(array $data): void 
{
    $documentId = $data['documentId'] ?? 'unknown';
    error_log("Document completed: $documentId");
    
    // Add your completion logic here
    // Example: Send email notification, update database, etc.
}

/**
 * Handle document voided event
 * 
 * @param array $data Event data
 */
function handleDocumentVoided(array $data): void 
{
    $documentId = $data['documentId'] ?? 'unknown';
    error_log("Document voided: $documentId");
    
    // Add your void logic here
    // Example: Update status, send notifications, etc.
}

/**
 * Complete webhook handler function
 * 
 * @param string $secret Your webhook secret
 * @param array|null $headers Optional headers (will read from request if null)
 * @param string|null $body Optional body (will read from php://input if null)
 * @return array Response with status code and body
 */
function handleTurboDocxWebhook(string $secret, ?array $headers = null, ?string $body = null): array 
{
    // Get headers and body if not provided
    $headers = $headers ?? getallheaders();
    $body = $body ?? file_get_contents('php://input');
    
    // Verify signature
    if (!verifyTurboDocxWebhookSignature($headers, $body, $secret)) {
        error_log('Webhook signature verification failed');
        return ['status' => 401, 'body' => 'Unauthorized'];
    }
    
    // Process the webhook
    try {
        $payload = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        
        if (!is_array($payload)) {
            throw new JsonException('Payload is not a valid array');
        }
        
        processTurboDocxWebhookEvent($payload);
        
        return ['status' => 200, 'body' => 'OK'];
        
    } catch (JsonException $e) {
        error_log('Invalid JSON payload: ' . $e->getMessage());
        return ['status' => 400, 'body' => 'Bad Request'];
    } catch (Exception $e) {
        error_log('Error processing webhook: ' . $e->getMessage());
        return ['status' => 500, 'body' => 'Internal Server Error'];
    }
}

/**
 * Express-style middleware for webhook verification
 * 
 * @param string $secret Your webhook secret
 * @return callable Middleware function
 */
function createTurboDocxWebhookMiddleware(string $secret): callable 
{
    return function() use ($secret) {
        $result = handleTurboDocxWebhook($secret);
        
        http_response_code($result['status']);
        echo $result['body'];
        
        if ($result['status'] !== 200) {
            exit();
        }
    };
}

/**
 * Test webhook verification (useful for development)
 * 
 * @param string $secret Test secret
 * @return bool Test result
 */
function testWebhookVerification(string $secret = 'test-secret'): bool 
{
    $timestamp = (string) time();
    $body = json_encode([
        'event' => 'signature.document.completed',
        'data' => ['documentId' => 'test123'],
        'timestamp' => $timestamp
    ]);
    
    // Generate test signature
    $signedString = $timestamp . '.' . $body;
    $signature = 'sha256=' . hash_hmac('sha256', $signedString, $secret);
    
    $headers = [
        'X-TurboDocx-Signature' => $signature,
        'X-TurboDocx-Timestamp' => $timestamp
    ];
    
    // Test verification
    $result = verifyTurboDocxWebhookSignature($headers, $body, $secret);
    echo "Test verification result: " . ($result ? 'PASS' : 'FAIL') . "\n";
    
    if ($result) {
        $payload = json_decode($body, true);
        processTurboDocxWebhookEvent($payload);
    }
    
    return $result;
}

// Example usage when script is run directly
if (__FILE__ === $_SERVER['SCRIPT_FILENAME']) {
    $webhookSecret = $_ENV['WEBHOOK_SECRET'] ?? 'your-webhook-secret';
    
    // If running from command line, run test
    if (php_sapi_name() === 'cli') {
        echo "Running webhook verification test...\n";
        testWebhookVerification($webhookSecret);
    } else {
        // Handle webhook request
        $result = handleTurboDocxWebhook($webhookSecret);
        http_response_code($result['status']);
        echo $result['body'];
    }
}

?>