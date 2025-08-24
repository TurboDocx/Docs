from fastapi import FastAPI, Request, HTTPException, Depends
import hashlib
import hmac
import time
import json
import os
from typing import Dict, Any

app = FastAPI(title="TurboDocx Webhook Handler")

def verify_webhook_signature(signature: str, timestamp: str, body: bytes, secret: str) -> bool:
    """
    Verifies a TurboDocx webhook signature
    
    Args:
        signature: X-TurboDocx-Signature header value
        timestamp: X-TurboDocx-Timestamp header value  
        body: Raw request body bytes
        secret: Webhook secret
    
    Returns:
        bool: True if signature is valid
    """
    if not signature or not timestamp or not body or not secret:
        return False
    
    # Check timestamp is within 5 minutes
    current_time = int(time.time())
    webhook_time = int(timestamp)
    
    if abs(current_time - webhook_time) > 300:
        return False
    
    # Generate expected signature
    signed_string = f"{timestamp}.{body.decode('utf-8')}"
    expected_signature = "sha256=" + hmac.new(
        secret.encode('utf-8'),
        signed_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Timing-safe comparison
    return hmac.compare_digest(signature, expected_signature)

def process_webhook_event(payload: Dict[str, Any]) -> None:
    """Process webhook event payload"""
    event_type = payload.get('event', '')
    print(f"Received event: {event_type}")
    
    if event_type == 'signature.document.completed':
        handle_document_completed(payload.get('data', {}))
    elif event_type == 'signature.document.voided':
        handle_document_voided(payload.get('data', {}))
    else:
        print(f"Unknown event type: {event_type}")

def handle_document_completed(data: Dict[str, Any]) -> None:
    """Handle document completion event"""
    document_id = data.get('documentId', 'unknown')
    print(f"Document completed: {document_id}")
    # Add your completion logic here

def handle_document_voided(data: Dict[str, Any]) -> None:
    """Handle document voided event"""
    document_id = data.get('documentId', 'unknown')
    print(f"Document voided: {document_id}")
    # Add your void logic here

# Dependency to get webhook secret
def get_webhook_secret():
    return os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')

async def verify_signature(request: Request, secret: str = Depends(get_webhook_secret)):
    """FastAPI dependency for webhook signature verification"""
    signature = request.headers.get('x-turbodocx-signature', '')
    timestamp = request.headers.get('x-turbodocx-timestamp', '')
    body = await request.body()
    
    if not verify_webhook_signature(signature, timestamp, body, secret):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return json.loads(body)

@app.post("/webhook")
async def webhook_handler(payload: Dict[str, Any] = Depends(verify_signature)):
    """
    Webhook endpoint with automatic signature verification
    """
    try:
        process_webhook_event(payload)
        return {"status": "ok"}
    except Exception as e:
        print(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": time.time()
    }

# Alternative manual verification approach
@app.post("/webhook/manual")
async def webhook_handler_manual(request: Request):
    """
    Webhook endpoint with manual signature verification
    """
    secret = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
    signature = request.headers.get('x-turbodocx-signature', '')
    timestamp = request.headers.get('x-turbodocx-timestamp', '')
    body = await request.body()
    
    # Verify signature
    if not verify_webhook_signature(signature, timestamp, body, secret):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        payload = json.loads(body)
        process_webhook_event(payload)
        return {"status": "ok"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    except Exception as e:
        print(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv('PORT', 8000))
    secret = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
    
    print(f"Starting webhook server on port {port}")
    print(f"Webhook secret configured: {len(secret)} characters")
    
    uvicorn.run(app, host="0.0.0.0", port=port)