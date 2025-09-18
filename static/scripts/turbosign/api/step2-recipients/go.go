package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
	// Step 2: Add Recipients
	documentID := "4a20eca5-7944-430c-97d5-fcce4be24296"
	
	payload := `{
	  "document": {
		"name": "Contract Agreement - Updated",
		"description": "This document requires electronic signatures from both parties. Please review all content carefully before signing."
	  },
	  "recipients": [
		{
		  "name": "John Smith",
		  "email": "john.smith@company.com",
		  "signingOrder": 1,
		  "metadata": {
			"color": "hsl(200, 75%, 50%)",
			"lightColor": "hsl(200, 75%, 93%)"
		  },
		  "documentId": "` + documentID + `"
		},
		{
		  "name": "Jane Doe",
		  "email": "jane.doe@partner.com",
		  "signingOrder": 2,
		  "metadata": {
			"color": "hsl(270, 75%, 50%)",
			"lightColor": "hsl(270, 75%, 93%)"
		  },
		  "documentId": "` + documentID + `"
		}
	  ]
	}`
	
	req, _ := http.NewRequest("POST", fmt.Sprintf("https://www.turbodocx.com/turbosign/documents/%s/update-with-recipients", documentID), bytes.NewBufferString(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer YOUR_API_TOKEN")
	req.Header.Set("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
	req.Header.Set("User-Agent", "TurboDocx API Client")
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	
	body := make([]byte, 1024)
	resp.Body.Read(body)
	fmt.Println(string(body))
}