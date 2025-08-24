package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

// WebhookVerifier handles webhook signature verification
type WebhookVerifier struct {
	Secret string
}

// NewWebhookVerifier creates a new webhook verifier
func NewWebhookVerifier(secret string) *WebhookVerifier {
	return &WebhookVerifier{
		Secret: secret,
	}
}

// VerifySignature verifies the webhook signature
func (wv *WebhookVerifier) VerifySignature(signature, timestamp, body string) bool {
	if signature == "" || timestamp == "" {
		return false
	}

	// Check timestamp is within 5 minutes
	ts, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil {
		return false
	}

	currentTime := time.Now().Unix()
	if abs(currentTime-ts) > 300 {
		return false
	}

	// Generate expected signature
	signedString := timestamp + "." + body
	expectedSignature := "sha256=" + wv.computeHMAC(signedString)

	// Timing-safe comparison
	return hmac.Equal([]byte(signature), []byte(expectedSignature))
}

// computeHMAC computes HMAC-SHA256 for the given data
func (wv *WebhookVerifier) computeHMAC(data string) string {
	h := hmac.New(sha256.New, []byte(wv.Secret))
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}

// WebhookPayload represents the webhook payload structure
type WebhookPayload struct {
	Event     string                 `json:"event"`
	Data      map[string]interface{} `json:"data"`
	Timestamp string                 `json:"timestamp"`
}

// ProcessEvent processes the webhook event
func (wv *WebhookVerifier) ProcessEvent(payload *WebhookPayload) {
	log.Printf("Received event: %s", payload.Event)

	switch payload.Event {
	case "signature.document.completed":
		wv.handleDocumentCompleted(payload.Data)
	case "signature.document.voided":
		wv.handleDocumentVoided(payload.Data)
	default:
		log.Printf("Unknown event type: %s", payload.Event)
	}
}

func (wv *WebhookVerifier) handleDocumentCompleted(data map[string]interface{}) {
	documentID, ok := data["documentId"].(string)
	if !ok {
		documentID = "unknown"
	}
	log.Printf("Document completed: %s", documentID)
	
	// Add your completion logic here
}

func (wv *WebhookVerifier) handleDocumentVoided(data map[string]interface{}) {
	documentID, ok := data["documentId"].(string)
	if !ok {
		documentID = "unknown"
	}
	log.Printf("Document voided: %s", documentID)
	
	// Add your void logic here
}

// WebhookHandler handles HTTP requests for webhooks
type WebhookHandler struct {
	Verifier *WebhookVerifier
}

// NewWebhookHandler creates a new webhook handler
func NewWebhookHandler(secret string) *WebhookHandler {
	return &WebhookHandler{
		Verifier: NewWebhookVerifier(secret),
	}
}

// ServeHTTP handles the webhook HTTP request
func (wh *WebhookHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read the body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Get headers
	signature := r.Header.Get("X-TurboDocx-Signature")
	timestamp := r.Header.Get("X-TurboDocx-Timestamp")

	// Verify signature
	if !wh.Verifier.VerifySignature(signature, timestamp, string(body)) {
		log.Printf("Webhook signature verification failed")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse payload
	var payload WebhookPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Printf("Failed to parse JSON payload: %v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// Process the event
	wh.Verifier.ProcessEvent(&payload)

	// Return success
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

// abs returns the absolute value of x
func abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}

// Example usage
func main() {
	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		webhookSecret = "your-webhook-secret"
	}

	handler := NewWebhookHandler(webhookSecret)

	http.Handle("/webhook", handler)

	fmt.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}