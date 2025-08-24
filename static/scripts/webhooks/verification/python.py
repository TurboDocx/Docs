import hmac
import hashlib
import time
import json
import os
from typing import Dict, Any, Optional
from flask import Flask, request, abort

def verify_webhook_signature(headers: Dict[str, str], body: str, secret: str) -> bool:
    """
    Verifies a TurboDocx webhook signature
    
    Args:
        headers: Request headers dictionary
        body: Raw request body as string
        secret: Your webhook secret
        
    Returns:
        bool: True if signature is valid
    """
    signature = headers.get('X-TurboDocx-Signature', '')
    timestamp = headers.get('X-TurboDocx-Timestamp', '')
    
    if not signature or not timestamp:
        return False
    
    # Check timestamp is within 5 minutes
    current_time = int(time.time())
    try:
        webhook_time = int(timestamp)
    except ValueError:
        return False
        
    if abs(current_time - webhook_time) > 300:
        return False
    
    # Generate expected signature
    signed_string = f"{timestamp}.{body}"
    expected_signature = 'sha256=' + hmac.new(
        secret.encode('utf-8'),
        signed_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Use timing-safe comparison
    return hmac.compare_digest(signature, expected_signature)

def create_webhook_decorator(secret: str):
    """
    Creates a Flask decorator for webhook verification
    
    Args:
        secret: Your webhook secret
        
    Returns:
        Decorator function
    """
    def webhook_required(f):
        def decorated_function(*args, **kwargs):
            headers = dict(request.headers)
            body = request.get_data(as_text=True)
            
            if not verify_webhook_signature(headers, body, secret):
                abort(401)
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function
    return webhook_required

def setup_webhook_handler(app: Flask, secret: str):
    """
    Sets up a complete Flask webhook handler
    
    Args:
        app: Flask application instance
        secret: Your webhook secret
    """
    @app.route('/webhook', methods=['POST'])
    def handle_webhook():
        headers = dict(request.headers)
        body = request.get_data(as_text=True)
        
        if not verify_webhook_signature(headers, body, secret):
            abort(401)
        
        # Process the webhook
        try:
            payload = request.get_json()
            print(f"Received event: {payload['event']}")
            
            # Process the event
            process_webhook_event(payload)
            
            # Always return 200 OK quickly
            return 'OK', 200
            
        except Exception as e:
            print(f"Error processing webhook: {e}")
            return 'Bad Request', 400

def process_webhook_event(payload: Dict[str, Any]) -> None:
    """
    Process webhook event payload
    
    Args:
        payload: The webhook payload
    """
    event_type = payload.get('event')
    
    if event_type == 'signature.document.completed':
        print(f"Document completed: {payload['data']['documentId']}")
        # Add your completion logic here
        
    elif event_type == 'signature.document.voided':
        print(f"Document voided: {payload['data']['documentId']}")
        # Add your void logic here
        
    else:
        print(f"Unknown event type: {event_type}")

# Example usage
if __name__ == '__main__':
    app = Flask(__name__)
    webhook_secret = os.environ.get('WEBHOOK_SECRET', 'your-webhook-secret')
    
    setup_webhook_handler(app, webhook_secret)
    
    app.run(host='0.0.0.0', port=5000, debug=True)