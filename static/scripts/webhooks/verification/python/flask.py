from flask import Flask, request, jsonify
import hashlib
import hmac
import time
import json
import os

app = Flask(__name__)

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
    try:
        webhook_time = int(timestamp)
    except (ValueError, TypeError):
        return False
    
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

def process_webhook_event(payload: dict) -> None:
    """Process webhook event payload"""
    event_type = payload.get('event', '')
    app.logger.info(f"Received event: {event_type}")
    
    if event_type == 'signature.document.completed':
        handle_document_completed(payload.get('data', {}))
    elif event_type == 'signature.document.voided':
        handle_document_voided(payload.get('data', {}))
    else:
        app.logger.warning(f"Unknown event type: {event_type}")

def handle_document_completed(data: dict) -> None:
    """Handle document completion event"""
    document_id = data.get('documentId', 'unknown')
    app.logger.info(f"Document completed: {document_id}")
    # Add your completion logic here

def handle_document_voided(data: dict) -> None:
    """Handle document voided event"""
    document_id = data.get('documentId', 'unknown')
    app.logger.info(f"Document voided: {document_id}")
    # Add your void logic here

@app.route('/webhook', methods=['POST'])
def webhook_handler():
    """
    Main webhook endpoint
    """
    webhook_secret = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
    
    # Get headers and body
    signature = request.headers.get('X-TurboDocx-Signature', '')
    timestamp = request.headers.get('X-TurboDocx-Timestamp', '')
    body = request.get_data()
    
    # Verify signature
    if not verify_webhook_signature(signature, timestamp, body, webhook_secret):
        app.logger.warning('Webhook signature verification failed')
        return 'Unauthorized', 401
    
    try:
        # Parse JSON payload
        payload = json.loads(body)
        
        # Process the event
        process_webhook_event(payload)
        
        return 'OK', 200
        
    except json.JSONDecodeError as e:
        app.logger.error(f'Invalid JSON payload: {e}')
        return 'Bad Request', 400
    except Exception as e:
        app.logger.error(f'Error processing webhook: {e}')
        return 'Internal Server Error', 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': time.time()
    })

# Decorator approach for webhook verification
def verify_webhook(f):
    """Decorator for webhook signature verification"""
    def decorated_function(*args, **kwargs):
        webhook_secret = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
        signature = request.headers.get('X-TurboDocx-Signature', '')
        timestamp = request.headers.get('X-TurboDocx-Timestamp', '')
        body = request.get_data()
        
        if not verify_webhook_signature(signature, timestamp, body, webhook_secret):
            app.logger.warning('Webhook signature verification failed')
            return 'Unauthorized', 401
            
        return f(*args, **kwargs)
    return decorated_function

@app.route('/webhook/decorated', methods=['POST'])
@verify_webhook
def webhook_handler_decorated():
    """
    Alternative webhook endpoint using decorator approach
    """
    try:
        payload = request.get_json()
        process_webhook_event(payload)
        return 'OK', 200
    except Exception as e:
        app.logger.error(f'Error processing webhook: {e}')
        return 'Internal Server Error', 500

# Test function for development
def test_webhook_verification():
    """Test webhook verification functionality"""
    secret = 'test-secret'
    timestamp = str(int(time.time()))
    body = json.dumps({
        'event': 'signature.document.completed',
        'data': {'documentId': 'test123'}
    }).encode('utf-8')
    
    # Generate test signature
    signed_string = f"{timestamp}.{body.decode('utf-8')}"
    signature = "sha256=" + hmac.new(
        secret.encode('utf-8'),
        signed_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Test verification
    result = verify_webhook_signature(signature, timestamp, body, secret)
    print(f"Test verification result: {'PASS' if result else 'FAIL'}")
    
    if result:
        payload = json.loads(body)
        process_webhook_event(payload)
    
    return result

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    secret = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
    
    print(f"Starting Flask webhook server on port {port}")
    print(f"Webhook secret configured: {len(secret)} characters")
    
    # Run test in development mode
    if os.getenv('FLASK_ENV') == 'development':
        test_webhook_verification()
    
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')