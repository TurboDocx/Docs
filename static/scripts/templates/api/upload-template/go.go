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
	API_TOKEN     = "YOUR_API_TOKEN"
	ORG_ID        = "YOUR_ORGANIZATION_ID"
	BASE_URL      = "https://api.turbodocx.com"
	TEMPLATE_NAME = "Employee Contract Template"
)

// UploadResponse represents the API response structure
type UploadResponse struct {
	Data struct {
		Results struct {
			Template struct {
				ID          string `json:"id"`
				Name        string `json:"name"`
				Description string `json:"description"`
				DefaultFont string `json:"defaultFont"`
				Variables   []struct {
					Name        string `json:"name"`
					Placeholder string `json:"placeholder"`
				} `json:"variables"`
				Fonts []struct {
					Name  string `json:"name"`
					Usage int    `json:"usage"`
				} `json:"fonts"`
			} `json:"template"`
			RedirectURL string `json:"redirectUrl"`
		} `json:"results"`
	} `json:"data"`
}

/**
 * Path A: Upload and Create Template
 * Uploads a .docx/.pptx template and extracts variables automatically
 */
func main() {
	templateFile := "./contract-template.docx"

	result, err := uploadTemplate(templateFile)
	if err != nil {
		fmt.Printf("Upload failed: %v\n", err)
		return
	}

	template := result.Data.Results.Template

	fmt.Printf("Template uploaded successfully: %s\n", template.ID)
	fmt.Printf("Template name: %s\n", template.Name)

	variableCount := 0
	if template.Variables != nil {
		variableCount = len(template.Variables)
	}
	fmt.Printf("Variables extracted: %d\n", variableCount)

	fmt.Printf("Default font: %s\n", template.DefaultFont)

	fontCount := 0
	if template.Fonts != nil {
		fontCount = len(template.Fonts)
	}
	fmt.Printf("Fonts used: %d\n", fontCount)

	fmt.Printf("Redirect to: %s\n", result.Data.Results.RedirectURL)
	fmt.Printf("Ready to generate documents with template: %s\n", template.ID)
}

func uploadTemplate(templateFilePath string) (*UploadResponse, error) {
	// Check if file exists
	if _, err := os.Stat(templateFilePath); os.IsNotExist(err) {
		return nil, fmt.Errorf("template file not found: %s", templateFilePath)
	}

	// Create multipart form data
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Add template file
	file, err := os.Open(templateFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	part, err := writer.CreateFormFile("templateFile", templateFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create form file: %v", err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return nil, fmt.Errorf("failed to copy file: %v", err)
	}

	// Add form fields
	writer.WriteField("name", TEMPLATE_NAME)
	writer.WriteField("description", "Standard employee contract with variable placeholders")
	writer.WriteField("variables", "[]")
	writer.WriteField("tags", `["hr", "contract", "template"]`)

	writer.Close()

	// Create HTTP request
	req, err := http.NewRequest("POST", BASE_URL+"/template/upload-and-create", &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

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

	var result UploadResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	return &result, nil
}