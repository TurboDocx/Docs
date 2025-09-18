package main

import (
	"bytes"
	"fmt"
	"net/http"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID = "YOUR_ORGANIZATION_ID"
	BASE_URL = "https://www.turbodocx.com/turbosign"
)

func main() {
	// Step 3: Prepare for Signing
	documentID := "4a20eca5-7944-430c-97d5-fcce4be24296"
	
	payload := `[
	  {
		"recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
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
		"recipientId": "5f673f37-9912-4e72-85aa-8f3649760f6b",
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
		"recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
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
		"recipientId": "a8b9c1d2-3456-7890-abcd-ef1234567890",
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
	]`
	
	req, _ := http.NewRequest("POST", fmt.Sprintf(BASE_URL+"/documents/%s/prepare-for-signing", documentID), bytes.NewBufferString(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	
	body := make([]byte, 1024)
	resp.Body.Read(body)
	fmt.Println(string(body))
}