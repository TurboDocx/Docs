package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID    = "YOUR_ORGANIZATION_ID"
	BASE_URL  = "https://api.turbodocx.com"
)

type Recipient struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	SigningOrder int    `json:"signingOrder"`
}

type Field struct {
	RecipientEmail string `json:"recipientEmail"`
	Type           string `json:"type"`
	Page           int    `json:"page,omitempty"`
	X              int    `json:"x,omitempty"`
	Y              int    `json:"y,omitempty"`
	Width          int    `json:"width,omitempty"`
	Height         int    `json:"height,omitempty"`
	Required       bool   `json:"required"`
}

type Response struct {
	Success    bool   `json:"success"`
	DocumentID string `json:"documentId"`
	Message    string `json:"message"`
	Error      string `json:"error,omitempty"`
	Code       string `json:"code,omitempty"`
}

func prepareDocumentForSigning() error {
	// Prepare recipients
	recipients := []Recipient{
		{
			Name:         "John Smith",
			Email:        "john.smith@company.com",
			SigningOrder: 1,
		},
		{
			Name:         "Jane Doe",
			Email:        "jane.doe@partner.com",
			SigningOrder: 2,
		},
	}

	recipientsJSON, err := json.Marshal(recipients)
	if err != nil {
		return fmt.Errorf("failed to marshal recipients: %w", err)
	}

	// Prepare fields - Coordinate-based
	fields := []Field{
		{
			RecipientEmail: "john.smith@company.com",
			Type:           "signature",
			Page:           1,
			X:              100,
			Y:              200,
			Width:          200,
			Height:         80,
			Required:       true,
		},
		{
			RecipientEmail: "john.smith@company.com",
			Type:           "date",
			Page:           1,
			X:              100,
			Y:              300,
			Width:          150,
			Height:         30,
			Required:       true,
		},
		{
			RecipientEmail: "jane.doe@partner.com",
			Type:           "signature",
			Page:           1,
			X:              350,
			Y:              200,
			Width:          200,
			Height:         80,
			Required:       true,
		},
	}

	fieldsJSON, err := json.Marshal(fields)
	if err != nil {
		return fmt.Errorf("failed to marshal fields: %w", err)
	}

	// Optional: CC emails
	ccEmails := []string{"manager@company.com", "legal@company.com"}
	ccEmailsJSON, err := json.Marshal(ccEmails)
	if err != nil {
		return fmt.Errorf("failed to marshal ccEmails: %w", err)
	}

	// Create multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file
	file, err := os.Open("./contract.pdf")
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	part, err := writer.CreateFormFile("file", "contract.pdf")
	if err != nil {
		return fmt.Errorf("failed to create form file: %w", err)
	}
	if _, err := io.Copy(part, file); err != nil {
		return fmt.Errorf("failed to copy file: %w", err)
	}

	// Add form fields
	writer.WriteField("documentName", "Contract Agreement")
	writer.WriteField("documentDescription", "Please review and sign this contract")
	writer.WriteField("senderName", "Your Company")
	writer.WriteField("senderEmail", "sender@company.com")
	writer.WriteField("recipients", string(recipientsJSON))
	writer.WriteField("fields", string(fieldsJSON))
	writer.WriteField("ccEmails", string(ccEmailsJSON))

	err = writer.Close()
	if err != nil {
		return fmt.Errorf("failed to close writer: %w", err)
	}

	// Create request
	req, err := http.NewRequest("POST", BASE_URL+"/turbosign/single/prepare-for-signing", body)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var result Response
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("failed to decode response: %w", err)
	}

	if result.Success {
		fmt.Println("✅ Document sent for signing")
		fmt.Printf("Document ID: %s\n", result.DocumentID)
		fmt.Printf("Message: %s\n", result.Message)
		fmt.Println("\n📧 Emails are being sent to recipients asynchronously")
		fmt.Println("💡 Tip: Set up webhooks to receive notifications when signing is complete")
	} else {
		fmt.Printf("❌ Error: %s\n", result.Error)
		if result.Code != "" {
			fmt.Printf("Error Code: %s\n", result.Code)
		}
		return fmt.Errorf("API error: %s", result.Error)
	}

	return nil
}

func main() {
	if err := prepareDocumentForSigning(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
