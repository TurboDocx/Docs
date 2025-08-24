<?php

class TurboDocxWebhookVerifier 
{
    private string $secret;
    
    public function __construct(string $secret) 
    {
        $this->secret = $secret;
    }
    
    /**
     * Verifies a TurboDocx webhook signature
     * 
     * @param array $headers Request headers
     * @param string $body Raw request body
     * @return bool True if signature is valid
     */
    public function verifySignature(array $headers, string $body): bool 
    {
        $signature = $headers['X-TurboDocx-Signature'] ?? '';
        $timestamp = $headers['X-TurboDocx-Timestamp'] ?? '';
        
        if (empty($signature) || empty($timestamp)) {
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
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $signedString, $this->secret);
        
        // Use timing-safe comparison
        return hash_equals($signature, $expectedSignature);
    }
    
    /**
     * Process webhook event
     * 
     * @param array $payload Webhook payload
     */
    public function processEvent(array $payload): void 
    {
        $eventType = $payload['event'] ?? '';
        
        switch ($eventType) {
            case 'signature.document.completed':
                $this->handleDocumentCompleted($payload['data']);
                break;
                
            case 'signature.document.voided':
                $this->handleDocumentVoided($payload['data']);
                break;
                
            default:
                error_log("Unknown event type: $eventType");
        }
    }
    
    private function handleDocumentCompleted(array $data): void 
    {
        $documentId = $data['documentId'] ?? 'unknown';
        error_log("Document completed: $documentId");
        
        // Add your completion logic here
    }
    
    private function handleDocumentVoided(array $data): void 
    {
        $documentId = $data['documentId'] ?? 'unknown';
        error_log("Document voided: $documentId");
        
        // Add your void logic here
    }
}

/**
 * Simple webhook handler function
 * 
 * @param string $secret Your webhook secret
 */
function handleTurboDocxWebhook(string $secret): void 
{
    $verifier = new TurboDocxWebhookVerifier($secret);
    
    // Get headers and body
    $headers = getallheaders();
    $body = file_get_contents('php://input');
    
    // Verify signature
    if (!$verifier->verifySignature($headers, $body)) {
        http_response_code(401);
        exit('Unauthorized');
    }
    
    // Process the webhook
    try {
        $payload = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        
        error_log('Received event: ' . ($payload['event'] ?? 'unknown'));
        
        $verifier->processEvent($payload);
        
        // Always return 200 OK quickly
        http_response_code(200);
        echo 'OK';
        
    } catch (JsonException $e) {
        error_log('Invalid JSON payload: ' . $e->getMessage());
        http_response_code(400);
        exit('Bad Request');
    }
}

// Example usage
if (__FILE__ === $_SERVER['SCRIPT_FILENAME']) {
    $webhookSecret = $_ENV['WEBHOOK_SECRET'] ?? 'your-webhook-secret';
    handleTurboDocxWebhook($webhookSecret);
}

?>