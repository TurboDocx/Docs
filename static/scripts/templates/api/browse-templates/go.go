package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID    = "YOUR_ORGANIZATION_ID"
	BASE_URL  = "https://api.turbodocx.com"
)

// BrowseResponse represents the browse API response structure
type BrowseResponse struct {
	Data struct {
		Results []struct {
			ID          string `json:"id"`
			Name        string `json:"name"`
			Description string `json:"description"`
			Type        string `json:"type"`
			CreatedOn   string `json:"createdOn"`
			Email       string `json:"email"`
		} `json:"results"`
		TotalRecords int `json:"totalRecords"`
	} `json:"data"`
}

// TemplateDetailsResponse represents the template details API response
type TemplateDetailsResponse struct {
	Data struct {
		Results struct {
			ID          string `json:"id"`
			Name        string `json:"name"`
			Description string `json:"description"`
			DefaultFont string `json:"defaultFont"`
			Variables   []struct {
				Name        string `json:"name"`
				Placeholder string `json:"placeholder"`
			} `json:"variables"`
		} `json:"results"`
	} `json:"data"`
}

// PDFPreviewResponse represents the PDF preview API response
type PDFPreviewResponse struct {
	Results string `json:"results"`
}

/**
 * Path B: Browse and Select Existing Templates
 */
func main() {
	fmt.Println("=== Path B: Browse and Select Template ===")

	// Step 1: Browse templates
	fmt.Println("\n1. Browsing templates...")
	browseResult, err := browseTemplates(10, 0, "contract", true, nil)
	if err != nil {
		fmt.Printf("Browse failed: %v\n", err)
		return
	}

	// Find a template (not a folder)
	var selectedTemplate *struct {
		ID          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
		Type        string `json:"type"`
		CreatedOn   string `json:"createdOn"`
		Email       string `json:"email"`
	}

	for _, item := range browseResult.Data.Results {
		if item.Type == "template" {
			selectedTemplate = &item
			break
		}
	}

	if selectedTemplate == nil {
		fmt.Println("No templates found in browse results")
		return
	}

	fmt.Printf("\nSelected template: %s (%s)\n", selectedTemplate.Name, selectedTemplate.ID)

	// Step 2: Get detailed template information
	fmt.Println("\n2. Getting template details...")
	templateDetails, err := getTemplateDetails(selectedTemplate.ID)
	if err != nil {
		fmt.Printf("Failed to get template details: %v\n", err)
		return
	}

	// Step 3: Get PDF preview (optional)
	fmt.Println("\n3. Getting PDF preview...")
	pdfPreview, err := getTemplatePDFPreview(selectedTemplate.ID)
	if err != nil {
		fmt.Printf("Failed to get PDF preview: %v\n", err)
		return
	}

	fmt.Println("\n=== Template Ready for Generation ===")
	fmt.Printf("Template ID: %s\n", templateDetails.Data.Results.ID)

	variableCount := 0
	if templateDetails.Data.Results.Variables != nil {
		variableCount = len(templateDetails.Data.Results.Variables)
	}
	fmt.Printf("Variables available: %d\n", variableCount)
	fmt.Printf("PDF Preview: %s\n", pdfPreview)
}

/**
 * Step 1: Browse Templates and Folders
 */
func browseTemplates(limit, offset int, query string, showTags bool, selectedTags []string) (*BrowseResponse, error) {
	// Build query parameters
	params := url.Values{}
	params.Set("limit", fmt.Sprintf("%d", limit))
	params.Set("offset", fmt.Sprintf("%d", offset))
	params.Set("showTags", fmt.Sprintf("%t", showTags))

	if query != "" {
		params.Set("query", query)
	}

	if selectedTags != nil {
		for _, tag := range selectedTags {
			params.Add("selectedTags[]", tag)
		}
	}

	requestURL := fmt.Sprintf("%s/template-item?%s", BASE_URL, params.Encode())

	// Create request
	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

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

	var result BrowseResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	fmt.Printf("Found %d templates/folders\n", result.Data.TotalRecords)

	return &result, nil
}

/**
 * Step 2: Get Template Details by ID
 */
func getTemplateDetails(templateID string) (*TemplateDetailsResponse, error) {
	requestURL := fmt.Sprintf("%s/template/%s", BASE_URL, templateID)

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

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

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var result TemplateDetailsResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	template := result.Data.Results
	fmt.Printf("Template: %s\n", template.Name)

	variableCount := 0
	if template.Variables != nil {
		variableCount = len(template.Variables)
	}
	fmt.Printf("Variables: %d\n", variableCount)

	defaultFont := template.DefaultFont
	if defaultFont == "" {
		defaultFont = "N/A"
	}
	fmt.Printf("Default font: %s\n", defaultFont)

	return &result, nil
}

/**
 * Step 3: Get PDF Preview Link (Optional)
 */
func getTemplatePDFPreview(templateID string) (string, error) {
	requestURL := fmt.Sprintf("%s/template/%s/previewpdflink", BASE_URL, templateID)

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("HTTP error %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var result PDFPreviewResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", fmt.Errorf("failed to parse JSON: %v", err)
	}

	fmt.Printf("PDF Preview: %s\n", result.Results)

	return result.Results, nil
}