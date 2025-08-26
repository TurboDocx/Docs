const fastify = require('fastify')({ logger: true });
const crypto = require('crypto');

/**
 * Verifies a TurboDocx webhook signature
 * @param {Object} request - The Fastify request object
 * @param {string} secret - Your webhook secret
 * @returns {boolean} - True if signature is valid
 */
function verifyWebhookSignature(request, secret) {
  const signature = request.headers['x-turbodocx-signature'];
  const timestamp = request.headers['x-turbodocx-timestamp'];
  const body = request.rawBody || JSON.stringify(request.body);
  
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
  fastify.log.info('Received event:', eventType);
  
  switch (eventType) {
    case 'signature.document.completed':
      handleDocumentCompleted(payload.data);
      break;
    case 'signature.document.voided':
      handleDocumentVoided(payload.data);
      break;
    default:
      fastify.log.warn('Unknown event type:', eventType);
  }
}

function handleDocumentCompleted(data) {
  const documentId = data.document_id || 'unknown';
  fastify.log.info('Document completed:', documentId);
  // Add your completion logic here
}

function handleDocumentVoided(data) {
  const documentId = data.document_id || 'unknown';
  fastify.log.info('Document voided:', documentId);
  // Add your void logic here
}

const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

// Add content parsing with raw body capture
fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  req.rawBody = body.toString();
  try {
    const json = JSON.parse(body);
    done(null, json);
  } catch (err) {
    done(err);
  }
});

// Webhook verification hook
fastify.addHook('preHandler', async (request, reply) => {
  if (request.url === '/webhook' && request.method === 'POST') {
    if (!verifyWebhookSignature(request, webhookSecret)) {
      reply.code(401).send('Unauthorized');
      return;
    }
  }
});

// Webhook endpoint
fastify.post('/webhook', {
  schema: {
    body: {
      type: 'object',
      properties: {
        event: { type: 'string' },
        data: { type: 'object' },
        timestamp: { type: 'string' }
      },
      required: ['event']
    }
  }
}, async (request, reply) => {
  try {
    processWebhookEvent(request.body);
    reply.code(200).send('OK');
  } catch (error) {
    fastify.log.error('Error processing webhook:', error);
    reply.code(500).send('Internal Server Error');
  }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Webhook server listening on port ${PORT}`);
    fastify.log.info(`Webhook secret configured: ${webhookSecret.length} characters`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = {
  verifyWebhookSignature,
  processWebhookEvent,
  fastify
};