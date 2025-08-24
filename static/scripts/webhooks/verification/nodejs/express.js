const express = require('express');
const crypto = require('crypto');

/**
 * Verifies a TurboDocx webhook signature
 * @param {Object} request - The Express request object
 * @param {string} secret - Your webhook secret
 * @returns {boolean} - True if signature is valid
 */
function verifyWebhookSignature(request, secret) {
  const signature = request.headers['x-turbodocx-signature'];
  const timestamp = request.headers['x-turbodocx-timestamp'];
  const body = request.rawBody || request.body;
  
  if (!signature || !timestamp || !body || !secret) {
    return false;
  }
  
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
 * Process webhook event payload
 * @param {Object} payload - The webhook payload
 */
function processWebhookEvent(payload) {
  const eventType = payload.event;
  console.log('Received event:', eventType);
  
  switch (eventType) {
    case 'signature.document.completed':
      handleDocumentCompleted(payload.data);
      break;
    case 'signature.document.voided':
      handleDocumentVoided(payload.data);
      break;
    default:
      console.log('Unknown event type:', eventType);
  }
}

function handleDocumentCompleted(data) {
  const documentId = data.documentId || 'unknown';
  console.log('Document completed:', documentId);
  // Add your completion logic here
}

function handleDocumentVoided(data) {
  const documentId = data.documentId || 'unknown';
  console.log('Document voided:', documentId);
  // Add your void logic here
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

// Express app setup
const app = express();
const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

// Middleware to capture raw body for signature verification
app.use('/webhook', express.raw({type: 'application/json'}), (req, res, next) => {
  req.rawBody = req.body.toString();
  next();
});

// Apply webhook verification middleware
app.use('/webhook', createWebhookMiddleware(webhookSecret));

// Webhook endpoint
app.post('/webhook', (req, res) => {
  try {
    const payload = JSON.parse(req.rawBody);
    processWebhookEvent(payload);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(400).send('Bad Request');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
  console.log(`Webhook secret configured: ${webhookSecret.length} characters`);
});

module.exports = {
  verifyWebhookSignature,
  processWebhookEvent,
  createWebhookMiddleware,
  app
};