package com.turbodocx.webhooks;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WebhookVerificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(WebhookVerificationService.class);
    private final String webhookSecret;
    private final ObjectMapper objectMapper;
    
    public WebhookVerificationService(@Value("${turbodocx.webhook.secret}") String webhookSecret) {
        this.webhookSecret = Objects.requireNonNull(webhookSecret, "Webhook secret cannot be null");
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Verifies a TurboDocx webhook signature
     * 
     * @param signature X-TurboDocx-Signature header value
     * @param timestamp X-TurboDocx-Timestamp header value  
     * @param body Raw request body
     * @return true if signature is valid
     */
    public boolean verifySignature(String signature, String timestamp, String body) {
        if (signature == null || timestamp == null || body == null) {
            return false;
        }
        
        try {
            // Check timestamp is within 5 minutes
            long currentTime = System.currentTimeMillis() / 1000;
            long webhookTime = Long.parseLong(timestamp);
            
            if (Math.abs(currentTime - webhookTime) > 300) {
                logger.warn("Webhook timestamp too old or too far in future");
                return false;
            }
            
            // Generate expected signature
            String signedString = timestamp + "." + body;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                webhookSecret.getBytes(StandardCharsets.UTF_8), 
                "HmacSHA256"
            );
            mac.init(secretKeySpec);
            
            byte[] hash = mac.doFinal(signedString.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            String expectedSignature = "sha256=" + hexString.toString();
            
            // Timing-safe comparison
            return MessageDigest.isEqual(
                signature.getBytes(StandardCharsets.UTF_8),
                expectedSignature.getBytes(StandardCharsets.UTF_8)
            );
            
        } catch (Exception e) {
            logger.error("Error verifying webhook signature", e);
            return false;
        }
    }
    
    /**
     * Process webhook event payload
     * 
     * @param body Raw request body containing the webhook payload
     */
    public void processEvent(String body) {
        try {
            JsonNode payload = objectMapper.readTree(body);
            String eventType = payload.get("event").asText();
            
            logger.info("Received event: {}", eventType);
            
            switch (eventType) {
                case "signature.document.completed":
                    handleDocumentCompleted(payload.get("data"));
                    break;
                    
                case "signature.document.voided":
                    handleDocumentVoided(payload.get("data"));
                    break;
                    
                default:
                    logger.warn("Unknown event type: {}", eventType);
            }
            
        } catch (Exception e) {
            logger.error("Error processing webhook event", e);
            throw new RuntimeException("Failed to process webhook event", e);
        }
    }
    
    private void handleDocumentCompleted(JsonNode data) {
        String documentId = data.get("document_id").asText();
        logger.info("Document completed: {}", documentId);
        
        // Add your completion logic here
    }
    
    private void handleDocumentVoided(JsonNode data) {
        String documentId = data.get("document_id").asText();
        logger.info("Document voided: {}", documentId);
        
        // Add your void logic here
    }
}

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {
    
    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);
    private final WebhookVerificationService verificationService;
    
    public WebhookController(WebhookVerificationService verificationService) {
        this.verificationService = verificationService;
    }
    
    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("X-TurboDocx-Signature") String signature,
            @RequestHeader("X-TurboDocx-Timestamp") String timestamp,
            @RequestBody String body) {
        
        try {
            // Verify signature
            if (!verificationService.verifySignature(signature, timestamp, body)) {
                logger.warn("Webhook signature verification failed");
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            // Process the event
            verificationService.processEvent(body);
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            logger.error("Error handling webhook", e);
            return ResponseEntity.badRequest().body("Error processing webhook");
        }
    }
}

// Configuration class for Spring Boot applications
@Component
public class WebhookConfig {
    
    @Value("${turbodocx.webhook.secret:#{null}}")
    private String webhookSecret;
    
    public void validateConfiguration() {
        if (webhookSecret == null || webhookSecret.trim().isEmpty()) {
            throw new IllegalStateException(
                "Webhook secret must be configured via 'turbodocx.webhook.secret' property"
            );
        }
    }
}

// Data classes for webhook payloads
public class WebhookPayload {
    private String event;
    private JsonNode data;
    private String timestamp;
    
    // Constructors
    public WebhookPayload() {}
    
    public WebhookPayload(String event, JsonNode data, String timestamp) {
        this.event = event;
        this.data = data;
        this.timestamp = timestamp;
    }
    
    // Getters and setters
    public String getEvent() { return event; }
    public void setEvent(String event) { this.event = event; }
    
    public JsonNode getData() { return data; }
    public void setData(JsonNode data) { this.data = data; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    
    @Override
    public String toString() {
        return "WebhookPayload{" +
               "event='" + event + '\'' +
               ", timestamp='" + timestamp + '\'' +
               '}';
    }
}