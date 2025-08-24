const crypto = require('crypto');

/**
 * Verifies a TurboDocx webhook signature
 * @param {Object} request - The request object
 * @param {Object} request.headers - Request headers
 * @param {string} request.rawBody - Raw request body as string
 * @param {string} secret - Your webhook secret
 * @returns {boolean} - True if signature is valid
 */
function verifyWebhookSignature(request, secret) {
  const signature = request.headers['x-turbodocx-signature'];
  const timestamp = request.headers['x-turbodocx-timestamp'];
  const body = request.rawBody;
  
  // Check timestamp is within 5 minutes
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    return false; // Timestamp too old or too far in future
  }
  
  // Generate expected signature
  const signedString = `${timestamp}.${body}`;
  const expectedSignature = 'sha256=' + 
    crypto.createHmac('sha256', secret)
          .update(signedString, 'utf8')
          .digest('hex');
  
  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Express.js middleware for webhook verification
 * @param {string} secret - Your webhook secret
 * @returns {Function} Express middleware
 */
function createWebhookMiddleware(secret) {
  return (req, res, next) => {
    if (!verifyWebhookSignature(req, secret)) {
      return res.status(401).send('Unauthorized');
    }
    next();
  };
}

/**
 * Complete Express.js webhook handler example
 */
function setupWebhookHandler(app, secret) {
  app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    if (!verifyWebhookSignature(req, secret)) {
      return res.status(401).send('Unauthorized');
    }
    
    // Process the webhook
    const payload = JSON.parse(req.body);
    console.log('Received event:', payload.event);
    
    // Always return 200 OK quickly
    res.status(200).send('OK');
    
    // Process the event asynchronously
    processWebhookEvent(payload);
  });
}

async function processWebhookEvent(payload) {
  // Add your webhook processing logic here
  switch (payload.event) {
    case 'signature.document.completed':
      console.log('Document completed:', payload.data.documentId);
      break;
    case 'signature.document.voided':
      console.log('Document voided:', payload.data.documentId);
      break;
    default:
      console.log('Unknown event type:', payload.event);
  }
}

module.exports = {
  verifyWebhookSignature,
  createWebhookMiddleware,
  setupWebhookHandler,
  processWebhookEvent
};