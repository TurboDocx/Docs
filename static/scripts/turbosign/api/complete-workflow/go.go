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
	ORG_ID = "YOUR_ORGANIZATION_ID"
	BASE_URL = "https://www.turbodocx.com/turbosign"
	DOCUMENT_NAME = "Contract Agreement"
)

type UploadResponse struct {
	Data struct {
		ID string `json:"id"`
	} `json:"data"`
}

type RecipientResponse struct {
	Data struct {
		Recipients []struct {
			ID string `json:"id"`
		} `json:"recipients"`
	} `json:"data"`
}

func main() {
	// Complete Workflow: Upload → Recipients → Prepare
	
	// Step 1: Upload Document
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	
	writer.WriteField("name", DOCUMENT_NAME)
	
	file, _ := os.Open("./document.pdf")
	defer file.Close()
	part, _ := writer.CreateFormFile("file", "document.pdf")
	io.Copy(part, file)
	writer.Close()
	
	req, _ := http.NewRequest("POST", BASE_URL+"/documents/upload", &buf)
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	
	uploadBody, _ := io.ReadAll(resp.Body)
	var uploadResult UploadResponse
	json.Unmarshal(uploadBody, &uploadResult)
	documentID := uploadResult.Data.ID
	
	// Step 2: Add Recipients
	recipientPayload := fmt.Sprintf(`{
	  "document": {
		"name": "` + DOCUMENT_NAME + ` - Updated",
		"description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
	  },
	  "recipients": [
		{
		  "name": "John Smith",
		  "email": "john.smith@company.com",
		  "signingOrder": 1,
		  "metadata": {
			"color": "hsl(200, 75%%, 50%%)",
			"lightColor": "hsl(200, 75%%, 93%%)"
		  },
		  "documentId": "%s"
		},
		{
		  "name": "Jane Doe",
		  "email": "jane.doe@partner.com",
		  "signingOrder": 2,
		  "metadata": {
			"color": "hsl(270, 75%%, 50%%)",
			"lightColor": "hsl(270, 75%%, 93%%)"
		  },
		  "documentId": "%s"
		}
	  ]
	}`, documentID, documentID)
	
	req2, _ := http.NewRequest("POST", fmt.Sprintf(BASE_URL+"/documents/%s/update-with-recipients", documentID), bytes.NewBufferString(recipientPayload))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Authorization", "Bearer YOUR_API_TOKEN")
	req2.Header.Set("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
	req2.Header.Set("User-Agent", "TurboDocx API Client")
	
	resp2, _ := client.Do(req2)
	defer resp2.Body.Close()
	
	recipientBody, _ := io.ReadAll(resp2.Body)
	var recipientResult RecipientResponse
	json.Unmarshal(recipientBody, &recipientResult)
	recipients := recipientResult.Data.Recipients
	
	// Step 3: Prepare for Signing
	signaturePayload := fmt.Sprintf(`[
	  {
		"recipientId": "%s",
		"type": "signature",
		"template": {
		  "anchor": "{Signature1}",
		  "placement": "replace",
		  "size": { "width": 200, "height": 80 },
		  "offset": { "x": 0, "y": 0 },
		  "caseSensitive": true,
		  "useRegex": false
		},
		"defaultValue": "",
		"required": true
	  },
	  {
		"recipientId": "%s",
		"type": "date",
		"template": {
		  "anchor": "{Date1}",
		  "placement": "replace",
		  "size": { "width": 150, "height": 30 },
		  "offset": { "x": 0, "y": 0 },
		  "caseSensitive": true,
		  "useRegex": false
		},
		"defaultValue": "",
		"required": true
	  },
	  {
		"recipientId": "%s",
		"type": "signature",
		"template": {
		  "anchor": "{Signature2}",
		  "placement": "replace",
		  "size": { "width": 200, "height": 80 },
		  "offset": { "x": 0, "y": 0 },
		  "caseSensitive": true,
		  "useRegex": false
		},
		"defaultValue": "",
		"required": true
	  },
	  {
		"recipientId": "%s",
		"type": "text",
		"template": {
		  "anchor": "{Title2}",
		  "placement": "replace",
		  "size": { "width": 200, "height": 30 },
		  "offset": { "x": 0, "y": 0 },
		  "caseSensitive": true,
		  "useRegex": false
		},
		"defaultValue": "Business Partner",
		"required": false
	  }
	]`, recipients[0].ID, recipients[0].ID, recipients[1].ID, recipients[1].ID)
	
	req3, _ := http.NewRequest("POST", fmt.Sprintf(BASE_URL+"/documents/%s/prepare-for-signing", documentID), bytes.NewBufferString(signaturePayload))
	req3.Header.Set("Content-Type", "application/json")
	req3.Header.Set("Authorization", "Bearer YOUR_API_TOKEN")
	req3.Header.Set("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
	req3.Header.Set("User-Agent", "TurboDocx API Client")
	
	resp3, _ := client.Do(req3)
	defer resp3.Body.Close()
	
	finalBody, _ := io.ReadAll(resp3.Body)
	fmt.Println(string(finalBody))
}