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

// Complete Workflow: Upload → Generate → Download
// Simple 3-step process for document generation

type Variable struct {
	Name        string `json:"name"`
	Placeholder string `json:"placeholder"`
	Text        string `json:"text"`
}

type Template struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Deliverable struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UploadResponse struct {
	Data struct {
		Results struct {
			Template Template `json:"template"`
		} `json:"results"`
	} `json:"data"`
}

type DeliverableResponse struct {
	Data struct {
		Results struct {
			Deliverable Deliverable `json:"deliverable"`
		} `json:"results"`
	} `json:"data"`
}

// Step 1: Upload template file
func uploadTemplate(templateFilePath string) (*Template, error) {
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	file, err := os.Open(templateFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open template file: %w", err)
	}
	defer file.Close()

	part, err := writer.CreateFormFile("templateFile", templateFilePath)
	if err != nil {
		return nil, err
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}

	writer.WriteField("name", "Simple Template")
	writer.WriteField("description", "Template uploaded for document generation")
	writer.Close()

	req, err := http.NewRequest("POST", BASE_URL+"/template/upload-and-create", &buf)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("upload failed: %d", resp.StatusCode)
	}

	var result UploadResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	template := result.Data.Results.Template
	fmt.Printf("✅ Template uploaded: %s (%s)\n", template.Name, template.ID)

	return &template, nil
}

// Step 2: Generate deliverable with simple variables
func generateDeliverable(templateID string) (*Deliverable, error) {
	variables := []Variable{
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
	}

	payload := map[string]interface{}{
		"templateId":  templateID,
		"name":        "Generated Document",
		"description": "Simple document example",
		"variables":   variables,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", BASE_URL+"/deliverable", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("generation failed: %d", resp.StatusCode)
	}

	var result DeliverableResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	deliverable := result.Data.Results.Deliverable
	fmt.Printf("✅ Document generated: %s (%s)\n", deliverable.Name, deliverable.ID)

	return &deliverable, nil
}

// Step 3: Download generated file
func downloadFile(deliverableID, filename string) error {
	req, err := http.NewRequest("GET", BASE_URL+"/deliverable/file/"+deliverableID, nil)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download failed: %d", resp.StatusCode)
	}

	fmt.Printf("✅ File ready for download: %s\n", filename)

	// In a real application, you would save the file:
	// file, err := os.Create(filename)
	// if err != nil {
	//     return err
	// }
	// defer file.Close()
	// _, err = io.Copy(file, resp.Body)

	return nil
}

// Complete workflow: Upload → Generate → Download
func completeWorkflow(templateFilePath string) error {
	fmt.Println("🚀 Starting complete workflow...")

	// Step 1: Upload template
	fmt.Println("\n📤 Step 1: Uploading template...")
	template, err := uploadTemplate(templateFilePath)
	if err != nil {
		return fmt.Errorf("upload failed: %w", err)
	}

	// Step 2: Generate deliverable
	fmt.Println("\n📝 Step 2: Generating document...")
	deliverable, err := generateDeliverable(template.ID)
	if err != nil {
		return fmt.Errorf("generation failed: %w", err)
	}

	// Step 3: Download file
	fmt.Println("\n📥 Step 3: Downloading file...")
	filename := deliverable.Name + ".docx"
	if err := downloadFile(deliverable.ID, filename); err != nil {
		return fmt.Errorf("download failed: %w", err)
	}

	fmt.Println("\n✅ Workflow complete!")
	fmt.Printf("Template: %s\n", template.ID)
	fmt.Printf("Document: %s\n", deliverable.ID)
	fmt.Printf("File: %s\n", filename)

	return nil
}

// Example usage
func main() {
	// Replace with your template file path
	templatePath := "./template.docx"

	if err := completeWorkflow(templatePath); err != nil {
		fmt.Printf("❌ Workflow failed: %v\n", err)
		os.Exit(1)
	}
}