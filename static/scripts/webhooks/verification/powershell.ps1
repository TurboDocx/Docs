# TurboDocx Webhook Verification PowerShell Script - Functional Approach

# Verifies the webhook signature
function Test-TurboDocxWebhookSignature {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Signature,
        
        [Parameter(Mandatory=$true)]
        [string]$Timestamp,
        
        [Parameter(Mandatory=$true)]
        [string]$Body,
        
        [Parameter(Mandatory=$true)]
        [string]$Secret
    )
    
    if ([string]::IsNullOrEmpty($Signature) -or [string]::IsNullOrEmpty($Timestamp)) {
        return $false
    }
    
    # Check timestamp is within 5 minutes
    try {
        $currentTime = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        $webhookTime = [int64]$Timestamp
        
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
    $signedString = "$Timestamp.$Body"
    $expectedSignature = "sha256=" + (Get-TurboDocxHMAC -Data $signedString -Secret $Secret)
    
    # Timing-safe comparison
    return Compare-SecureString -StringA $Signature -StringB $expectedSignature
}

# Computes HMAC-SHA256 for the given data
function Get-TurboDocxHMAC {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Data,
        
        [Parameter(Mandatory=$true)]
        [string]$Secret
    )
    
    $hmacSha256 = New-Object System.Security.Cryptography.HMACSHA256
    $hmacSha256.Key = [System.Text.Encoding]::UTF8.GetBytes($Secret)
    
    $dataBytes = [System.Text.Encoding]::UTF8.GetBytes($Data)
    $hashBytes = $hmacSha256.ComputeHash($dataBytes)
    
    $hmacSha256.Dispose()
    
    return [System.BitConverter]::ToString($hashBytes).Replace("-", "").ToLower()
}

# Timing-safe string comparison (basic implementation)
function Compare-SecureString {
    param(
        [Parameter(Mandatory=$true)]
        [string]$StringA,
        
        [Parameter(Mandatory=$true)]
        [string]$StringB
    )
    
    if ($StringA.Length -ne $StringB.Length) {
        return $false
    }
    
    $result = 0
    for ($i = 0; $i -lt $StringA.Length; $i++) {
        $result = $result -bor ($StringA[$i] -bxor $StringB[$i])
    }
    
    return $result -eq 0
}

# Process webhook event payload
function Invoke-TurboDocxWebhookEvent {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Payload
    )
    
    $eventType = $Payload.event
    Write-Host "Received event: $eventType" -ForegroundColor Green
    
    switch ($eventType) {
        "signature.document.completed" {
            Invoke-DocumentCompleted -Data $Payload.data
        }
        "signature.document.voided" {
            Invoke-DocumentVoided -Data $Payload.data
        }
        default {
            Write-Warning "Unknown event type: $eventType"
        }
    }
}

# Handle document completion event
function Invoke-DocumentCompleted {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Data
    )
    
    $documentId = if ($Data.documentId) { $Data.documentId } else { "unknown" }
    Write-Host "Document completed: $documentId" -ForegroundColor Cyan
    
    # Add your completion logic here
    # Example: Send email, update database, trigger workflow
}

# Handle document voided event
function Invoke-DocumentVoided {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Data
    )
    
    $documentId = if ($Data.documentId) { $Data.documentId } else { "unknown" }
    Write-Host "Document voided: $documentId" -ForegroundColor Yellow
    
    # Add your void logic here
    # Example: Update status, send notifications
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
        
        # Get signature and timestamp from headers
        $signature = $Headers['X-TurboDocx-Signature']
        $timestamp = $Headers['X-TurboDocx-Timestamp']
        
        # Verify signature
        if (-not (Test-TurboDocxWebhookSignature -Signature $signature -Timestamp $timestamp -Body $Body -Secret $WebhookSecret)) {
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
        Invoke-TurboDocxWebhookEvent -Payload $payload
        
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
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
    $body = '{"event":"signature.document.completed","data":{"documentId":"doc123"}}'
    
    # Generate signature for testing
    $signedString = "$timestamp.$body"
    $signature = "sha256=" + (Get-TurboDocxHMAC -Data $signedString -Secret $WebhookSecret)
    
    # Test verification
    $result = Test-TurboDocxWebhookSignature -Signature $signature -Timestamp $timestamp -Body $body -Secret $WebhookSecret
    Write-Host "Verification result: $result" -ForegroundColor $(if ($result) { "Green" } else { "Red" })
    
    if ($result) {
        # Test event processing
        $payload = $body | ConvertFrom-Json -AsHashtable
        Invoke-TurboDocxWebhookEvent -Payload $payload
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