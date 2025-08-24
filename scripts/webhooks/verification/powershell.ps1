# TurboDocx Webhook Verification PowerShell Script

# WebhookVerifier class for handling webhook verification
class WebhookVerifier {
    [string]$Secret
    
    WebhookVerifier([string]$secret) {
        $this.Secret = $secret
    }
    
    # Verifies the webhook signature
    [bool] VerifySignature([string]$signature, [string]$timestamp, [string]$body) {
        if ([string]::IsNullOrEmpty($signature) -or [string]::IsNullOrEmpty($timestamp)) {
            return $false
        }
        
        # Check timestamp is within 5 minutes
        try {
            $currentTime = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
            $webhookTime = [int64]$timestamp
            
            if ([Math]::Abs($currentTime - $webhookTime) -gt 300) {
                Write-Warning "Webhook timestamp too old or too far in future"
                return $false
            }
        }
        catch {
            Write-Error "Invalid timestamp format: $_"
            return $false
        }
        
        # Generate expected signature
        $signedString = "$timestamp.$body"
        $expectedSignature = "sha256=" + $this.ComputeHMAC($signedString)
        
        # Timing-safe comparison (PowerShell doesn't have built-in timing-safe comparison)
        return $this.SecureCompare($signature, $expectedSignature)
    }
    
    # Computes HMAC-SHA256 for the given data
    [string] ComputeHMAC([string]$data) {
        $hmacSha256 = New-Object System.Security.Cryptography.HMACSHA256
        $hmacSha256.Key = [System.Text.Encoding]::UTF8.GetBytes($this.Secret)
        
        $dataBytes = [System.Text.Encoding]::UTF8.GetBytes($data)
        $hashBytes = $hmacSha256.ComputeHash($dataBytes)
        
        $hmacSha256.Dispose()
        
        return [System.BitConverter]::ToString($hashBytes).Replace("-", "").ToLower()
    }
    
    # Timing-safe string comparison (basic implementation)
    [bool] SecureCompare([string]$a, [string]$b) {
        if ($a.Length -ne $b.Length) {
            return $false
        }
        
        $result = 0
        for ($i = 0; $i -lt $a.Length; $i++) {
            $result = $result -bor ($a[$i] -bxor $b[$i])
        }
        
        return $result -eq 0
    }
    
    # Process webhook event payload
    [void] ProcessEvent([hashtable]$payload) {
        $eventType = $payload.event
        Write-Host "Received event: $eventType" -ForegroundColor Green
        
        switch ($eventType) {
            "signature.document.completed" {
                $this.HandleDocumentCompleted($payload.data)
            }
            "signature.document.voided" {
                $this.HandleDocumentVoided($payload.data)
            }
            default {
                Write-Warning "Unknown event type: $eventType"
            }
        }
    }
    
    [void] HandleDocumentCompleted([hashtable]$data) {
        $documentId = if ($data.documentId) { $data.documentId } else { "unknown" }
        Write-Host "Document completed: $documentId" -ForegroundColor Cyan
        
        # Add your completion logic here
    }
    
    [void] HandleDocumentVoided([hashtable]$data) {
        $documentId = if ($data.documentId) { $data.documentId } else { "unknown" }
        Write-Host "Document voided: $documentId" -ForegroundColor Yellow
        
        # Add your void logic here
    }
}

# Function to handle webhook request (for use with PowerShell Universal or other web frameworks)
function Invoke-WebhookHandler {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Headers,
        
        [Parameter(Mandatory=$true)]
        [string]$Body,
        
        [Parameter(Mandatory=$true)]
        [string]$WebhookSecret
    )
    
    try {
        # Create verifier
        $verifier = [WebhookVerifier]::new($WebhookSecret)
        
        # Get signature and timestamp from headers
        $signature = $Headers['X-TurboDocx-Signature']
        $timestamp = $Headers['X-TurboDocx-Timestamp']
        
        # Verify signature
        if (-not $verifier.VerifySignature($signature, $timestamp, $Body)) {
            Write-Warning "Webhook signature verification failed"
            return @{ StatusCode = 401; Body = "Unauthorized" }
        }
        
        # Parse JSON payload
        try {
            $payload = $Body | ConvertFrom-Json -AsHashtable
        }
        catch {
            Write-Error "Failed to parse JSON payload: $_"
            return @{ StatusCode = 400; Body = "Bad Request" }
        }
        
        # Process the event
        $verifier.ProcessEvent($payload)
        
        # Return success
        return @{ StatusCode = 200; Body = "OK" }
    }
    catch {
        Write-Error "Error processing webhook: $_"
        return @{ StatusCode = 500; Body = "Internal Server Error" }
    }
}

# Function for Azure Functions or similar serverless environments
function Invoke-TurboDocxWebhook {
    param(
        [Parameter(Mandatory=$true)]
        $Request,
        
        [Parameter(Mandatory=$true)]
        [string]$WebhookSecret
    )
    
    # Extract headers and body from the request object
    $headers = @{}
    foreach ($header in $Request.Headers.GetEnumerator()) {
        $headers[$header.Key] = $header.Value
    }
    
    # Get the raw body
    $body = $Request.RawBody
    
    # Process the webhook
    return Invoke-WebhookHandler -Headers $headers -Body $body -WebhookSecret $WebhookSecret
}

# Example usage and testing functions
function Test-WebhookVerification {
    param(
        [string]$WebhookSecret = "test-secret"
    )
    
    Write-Host "Testing webhook verification..." -ForegroundColor Magenta
    
    # Create test data
    $verifier = [WebhookVerifier]::new($WebhookSecret)
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
    $body = '{"event":"signature.document.completed","data":{"documentId":"doc123"}}'
    
    # Generate signature for testing
    $signedString = "$timestamp.$body"
    $signature = "sha256=" + $verifier.ComputeHMAC($signedString)
    
    # Test verification
    $result = $verifier.VerifySignature($signature, $timestamp, $body)
    Write-Host "Verification result: $result" -ForegroundColor $(if ($result) { "Green" } else { "Red" })
    
    if ($result) {
        # Test event processing
        $payload = $body | ConvertFrom-Json -AsHashtable
        $verifier.ProcessEvent($payload)
    }
    
    return $result
}

function Start-WebhookListener {
    param(
        [int]$Port = 8080,
        [string]$WebhookSecret = $env:WEBHOOK_SECRET
    )
    
    if ([string]::IsNullOrEmpty($WebhookSecret)) {
        $WebhookSecret = "your-webhook-secret"
        Write-Warning "No WEBHOOK_SECRET environment variable found, using default"
    }
    
    Write-Host "Starting webhook listener on port $Port..." -ForegroundColor Green
    Write-Host "Webhook secret configured: $($WebhookSecret.Length) characters" -ForegroundColor Yellow
    
    # Note: This is a simple example. For production use, consider PowerShell Universal,
    # Azure Functions, or other proper web hosting solutions.
    
    Write-Host @"
To test this webhook handler, you can use the following curl command:

curl -X POST http://localhost:$Port/webhook \
  -H "Content-Type: application/json" \
  -H "X-TurboDocx-Signature: sha256=<signature>" \
  -H "X-TurboDocx-Timestamp: <timestamp>" \
  -d '{"event":"signature.document.completed","data":{"documentId":"test123"}}'

Or run the test function:
Test-WebhookVerification -WebhookSecret '$WebhookSecret'
"@
}

# Export functions for module use
Export-ModuleMember -Function Invoke-WebhookHandler, Invoke-TurboDocxWebhook, Test-WebhookVerification, Start-WebhookListener

# Example usage when script is run directly
if ($MyInvocation.InvocationName -ne '.') {
    # Run test if no parameters provided
    if ($args.Count -eq 0) {
        Test-WebhookVerification
        Start-WebhookListener
    }
    else {
        # Handle command line arguments
        switch ($args[0]) {
            "test" {
                $secret = if ($args[1]) { $args[1] } else { "test-secret" }
                Test-WebhookVerification -WebhookSecret $secret
            }
            "listen" {
                $port = if ($args[1]) { [int]$args[1] } else { 8080 }
                Start-WebhookListener -Port $port
            }
            default {
                Write-Host "Usage: powershell.ps1 [test|listen] [parameters]"
                Write-Host "  test [secret]     - Run verification test"
                Write-Host "  listen [port]     - Start webhook listener"
            }
        }
    }
}