package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID    = "YOUR_ORGANIZATION_ID"
	BASE_URL  = "https://api.turbodocx.com"
)

// DeliverableRequest represents the request structure for deliverable generation
type DeliverableRequest struct {
	TemplateID  string     `json:"templateId"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Variables   []Variable `json:"variables"`
}

type Variable struct {
	Name        string `json:"name"`
	Placeholder string `json:"placeholder"`
	Text        string `json:"text"`
}


// DeliverableResponse represents the API response structure
type DeliverableResponse struct {
	Data struct {
		Results struct {
			Deliverable struct {
				ID         string `json:"id"`
				Name       string `json:"name"`
				CreatedBy  string `json:"createdBy"`
				CreatedOn  string `json:"createdOn"`
				TemplateID string `json:"templateId"`
			} `json:"deliverable"`
		} `json:"results"`
	} `json:"data"`
}

/**
 * Final Step: Generate Deliverable (Both Paths Converge Here)
 */
func main() {
	fmt.Println("=== Final Step: Generate Deliverable ===")

	// This would come from either Path A (upload) or Path B (browse/select)
	templateID := "0b1099cf-d7b9-41a4-822b-51b68fd4885a"

	deliverableData := createDeliverableData(templateID)
	deliverable, err := generateDeliverable(deliverableData)
	if err != nil {
		fmt.Printf("Deliverable generation failed: %v\n", err)
		return
	}

	// Download the generated file
	fmt.Println("\n=== Download Generated File ===")
	err = downloadDeliverable(deliverable.Data.Results.Deliverable.ID,
		deliverable.Data.Results.Deliverable.Name+".docx")
	if err != nil {
		fmt.Printf("Download failed: %v\n", err)
		return
	}
}

/**
 * Generate a deliverable document from template with variable substitution
 */
func generateDeliverable(deliverableData DeliverableRequest) (*DeliverableResponse, error) {
	fmt.Println("Generating deliverable...")
	fmt.Printf("Template ID: %s\n", deliverableData.TemplateID)
	fmt.Printf("Deliverable Name: %s\n", deliverableData.Name)
	fmt.Printf("Variables: %d\n", len(deliverableData.Variables))

	// Convert to JSON
	jsonData, err := json.Marshal(deliverableData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal JSON: %v", err)
	}

	// Create request
	req, err := http.NewRequest("POST", BASE_URL+"/deliverable", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", "application/json")

	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("HTTP error %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var result DeliverableResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	deliverable := result.Data.Results.Deliverable
	fmt.Println("✅ Deliverable generated successfully!")
	fmt.Printf("Deliverable ID: %s\n", deliverable.ID)
	fmt.Printf("Created by: %s\n", deliverable.CreatedBy)
	fmt.Printf("Created on: %s\n", deliverable.CreatedOn)
	fmt.Printf("Template ID: %s\n", deliverable.TemplateID)

	return &result, nil
}

/**
 * Download the generated deliverable file
 */
func downloadDeliverable(deliverableID, filename string) error {
	fmt.Printf("Downloading file: %s\n", filename)

	requestURL := fmt.Sprintf("%s/deliverable/file/%s", BASE_URL, deliverableID)

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download failed: %d", resp.StatusCode)
	}

	fmt.Printf("✅ File ready for download: %s\n", filename)

	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "N/A"
	}

	contentLength := resp.Header.Get("Content-Length")
	if contentLength == "" {
		contentLength = "N/A"
	}

	fmt.Printf("📁 Content-Type: %s\n", contentType)
	fmt.Printf("📊 Content-Length: %s bytes\n", contentLength)

	// In a real application, you would save the file
	// body, err := io.ReadAll(resp.Body)
	// if err != nil {
	//     return fmt.Errorf("failed to read file content: %v", err)
	// }
	// err = os.WriteFile(filename, body, 0644)
	// if err != nil {
	//     return fmt.Errorf("failed to save file: %v", err)
	// }

	return nil
}

/**
 * Create example deliverable data with complex variables
 */
func createDeliverableData(templateID string) DeliverableRequest {
	return DeliverableRequest{
		TemplateID:  templateID,
		Name:        "Contract - John Smith",
		Description: "Simple contract example",
		Variables: []Variable{
			{
				Name:        "Company Name",
				Placeholder: "{CompanyName}",
				Text:        "Acme Corporation",
			},
			{
				Name:        "Employee Name",
				Placeholder: "{EmployeeName}",
				Text:        "John Smith",
			},
			{
				Name:        "Date",
				Placeholder: "{Date}",
				Text:        "January 15, 2024",
			},
		},
	}
}