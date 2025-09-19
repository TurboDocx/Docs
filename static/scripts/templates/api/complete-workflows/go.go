package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"time"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID    = "YOUR_ORGANIZATION_ID"
	BASE_URL  = "https://api.turbodocx.com"
)

// Response structures
type UploadResponse struct {
	Data struct {
		Results struct {
			Template struct {
				ID          string `json:"id"`
				Name        string `json:"name"`
				DefaultFont string `json:"defaultFont"`
				Variables   []struct {
					Name string `json:"name"`
				} `json:"variables"`
				Fonts []struct {
					Name string `json:"name"`
				} `json:"fonts"`
			} `json:"template"`
		} `json:"results"`
	} `json:"data"`
}

type BrowseResponse struct {
	Data struct {
		Results []struct {
			ID   string `json:"id"`
			Name string `json:"name"`
			Type string `json:"type"`
		} `json:"results"`
		TotalRecords int `json:"totalRecords"`
	} `json:"data"`
}

type TemplateDetailsResponse struct {
	Data struct {
		Results struct {
			ID        string `json:"id"`
			Name      string `json:"name"`
			Variables []struct {
				Name string `json:"name"`
			} `json:"variables"`
			DefaultFont string `json:"defaultFont"`
		} `json:"results"`
	} `json:"data"`
}

type PDFPreviewResponse struct {
	Results string `json:"results"`
}

type DeliverableResponse struct {
	Data struct {
		Results struct {
			Deliverable struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				CreatedBy string `json:"createdBy"`
				CreatedOn string `json:"createdOn"`
			} `json:"deliverable"`
		} `json:"results"`
	} `json:"data"`
}

/**
 * Complete Template Generation Workflows
 * Demonstrates both Path A (Upload) and Path B (Browse/Select) followed by generation
 */
type TemplateWorkflowManager struct {
	client *http.Client
}

func NewTemplateWorkflowManager() *TemplateWorkflowManager {
	return &TemplateWorkflowManager{
		client: &http.Client{},
	}
}

func main() {
	workflow := NewTemplateWorkflowManager()

	// Demo Path B (Browse existing templates)
	err := workflow.DemoPathB()
	if err != nil {
		fmt.Printf("Workflow demo failed: %v\n", err)
		return
	}

	// Uncomment to demo Path A (requires template file):
	// err = workflow.DemoPathA("./path/to/your/template.docx")

	// Uncomment to run full comparison:
	// err = workflow.DemoComparison()
}

// ===============================
// PATH A: Upload New Template
// ===============================

/**
 * Complete Path A workflow: Upload → Generate
 */
func (tm *TemplateWorkflowManager) PathA_UploadAndGenerate(templateFilePath, deliverableName string) error {
	fmt.Println("🔄 PATH A: Upload New Template → Generate Deliverable")
	fmt.Println(fmt.Sprintf("%s", fmt.Sprintf("%48s", "").ReplaceAll(" ", "=")))

	// Step 1: Upload and create template
	fmt.Println("\n📤 Step 1: Uploading template...")
	template, err := tm.uploadTemplate(templateFilePath)
	if err != nil {
		fmt.Printf("❌ Path A failed: %v\n", err)
		return err
	}

	// Step 2: Generate deliverable using uploaded template
	fmt.Println("\n📝 Step 2: Generating deliverable...")
	deliverable, err := tm.generateDeliverable(template.Data.Results.Template.ID, deliverableName,
		fmt.Sprintf("Generated from uploaded template: %s", template.Data.Results.Template.Name))
	if err != nil {
		fmt.Printf("❌ Path A failed: %v\n", err)
		return err
	}

	fmt.Println("\n✅ PATH A COMPLETE!")
	fmt.Printf("Template ID: %s\n", template.Data.Results.Template.ID)
	fmt.Printf("Deliverable ID: %s\n", deliverable.Data.Results.Deliverable.ID)

	// Download the generated file
	return tm.downloadDeliverable(deliverable.Data.Results.Deliverable.ID,
		deliverable.Data.Results.Deliverable.Name+".docx")
}

func (tm *TemplateWorkflowManager) uploadTemplate(templateFilePath string) (*UploadResponse, error) {
	if _, err := os.Stat(templateFilePath); os.IsNotExist(err) {
		return nil, fmt.Errorf("template file not found: %s", templateFilePath)
	}

	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

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

	writer.WriteField("name", "API Upload Template")
	writer.WriteField("description", "Template uploaded via API for testing")
	writer.WriteField("variables", "[]")
	writer.WriteField("tags", `["api", "test", "upload"]`)

	writer.Close()

	req, err := http.NewRequest("POST", BASE_URL+"/template/upload-and-create", &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := tm.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("upload failed: %d - %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var result UploadResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	template := result.Data.Results.Template
	fmt.Printf("✅ Template uploaded: %s (%s)\n", template.Name, template.ID)

	variableCount := 0
	if template.Variables != nil {
		variableCount = len(template.Variables)
	}
	fmt.Printf("📊 Variables extracted: %d\n", variableCount)

	fmt.Printf("🔤 Default font: %s\n", template.DefaultFont)

	fontCount := 0
	if template.Fonts != nil {
		fontCount = len(template.Fonts)
	}
	fmt.Printf("📝 Fonts used: %d\n", fontCount)

	return &result, nil
}

// ===============================
// PATH B: Browse and Select
// ===============================

/**
 * Complete Path B workflow: Browse → Select → Generate
 */
func (tm *TemplateWorkflowManager) PathB_BrowseAndGenerate(searchQuery, deliverableName string) error {
	fmt.Println("🔍 PATH B: Browse Existing Templates → Generate Deliverable")
	fmt.Println(fmt.Sprintf("%56s", "").ReplaceAll(" ", "="))

	// Step 1: Browse templates
	fmt.Println("\n🔍 Step 1: Browsing templates...")
	browseResult, err := tm.browseTemplates(searchQuery)
	if err != nil {
		fmt.Printf("❌ Path B failed: %v\n", err)
		return err
	}

	// Step 2: Select first available template
	var selectedTemplate *struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Type string `json:"type"`
	}

	for _, item := range browseResult.Data.Results {
		if item.Type == "template" {
			selectedTemplate = &item
			break
		}
	}

	if selectedTemplate == nil {
		err := fmt.Errorf("no templates found in browse results")
		fmt.Printf("❌ Path B failed: %v\n", err)
		return err
	}

	fmt.Printf("📋 Selected: %s (%s)\n", selectedTemplate.Name, selectedTemplate.ID)

	// Step 3: Get template details
	fmt.Println("\n📖 Step 2: Getting template details...")
	templateDetails, err := tm.getTemplateDetails(selectedTemplate.ID)
	if err != nil {
		fmt.Printf("❌ Path B failed: %v\n", err)
		return err
	}

	// Step 4: Get PDF preview (optional)
	fmt.Println("\n🖼️  Step 3: Getting PDF preview...")
	pdfPreview, err := tm.getTemplatePDFPreview(selectedTemplate.ID)
	if err != nil {
		fmt.Printf("❌ Path B failed: %v\n", err)
		return err
	}

	// Step 5: Generate deliverable
	fmt.Println("\n📝 Step 4: Generating deliverable...")
	deliverable, err := tm.generateDeliverable(templateDetails.Data.Results.ID, deliverableName,
		fmt.Sprintf("Generated from existing template: %s", templateDetails.Data.Results.Name))
	if err != nil {
		fmt.Printf("❌ Path B failed: %v\n", err)
		return err
	}

	fmt.Println("\n✅ PATH B COMPLETE!")
	fmt.Printf("Template ID: %s\n", templateDetails.Data.Results.ID)
	fmt.Printf("Deliverable ID: %s\n", deliverable.Data.Results.Deliverable.ID)
	fmt.Printf("PDF Preview: %s\n", pdfPreview)

	// Download the generated file
	fmt.Println("\n📥 Step 5: Downloading file...")
	return tm.downloadDeliverable(deliverable.Data.Results.Deliverable.ID,
		deliverable.Data.Results.Deliverable.Name+".docx")
}

func (tm *TemplateWorkflowManager) browseTemplates(query string) (*BrowseResponse, error) {
	params := url.Values{}
	params.Set("limit", "25")
	params.Set("offset", "0")
	params.Set("showTags", "true")

	if query != "" {
		params.Set("query", query)
	}

	requestURL := fmt.Sprintf("%s/template-item?%s", BASE_URL, params.Encode())

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	resp, err := tm.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("browse failed: %d - %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var result BrowseResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	fmt.Printf("🔍 Found %d templates/folders\n", result.Data.TotalRecords)

	return &result, nil
}

func (tm *TemplateWorkflowManager) getTemplateDetails(templateID string) (*TemplateDetailsResponse, error) {
	req, err := http.NewRequest("GET", BASE_URL+"/template/"+templateID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	resp, err := tm.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("template details failed: %d - %s", resp.StatusCode, string(body))
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
	variableCount := 0
	if template.Variables != nil {
		variableCount = len(template.Variables)
	}
	fmt.Printf("📊 Variables: %d\n", variableCount)

	defaultFont := template.DefaultFont
	if defaultFont == "" {
		defaultFont = "N/A"
	}
	fmt.Printf("🔤 Default font: %s\n", defaultFont)

	return &result, nil
}

func (tm *TemplateWorkflowManager) getTemplatePDFPreview(templateID string) (string, error) {
	req, err := http.NewRequest("GET", BASE_URL+"/template/"+templateID+"/previewpdflink", nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	resp, err := tm.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("PDF preview failed: %d - %s", resp.StatusCode, string(body))
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

	fmt.Printf("🖼️  PDF Preview available: %s\n", result.Results)

	return result.Results, nil
}

// ===============================
// COMMON: Generate Deliverable
// ===============================

func (tm *TemplateWorkflowManager) generateDeliverable(templateID, name, description string) (*DeliverableResponse, error) {
	now := time.Now().UTC().Format(time.RFC3339)

	payload := map[string]interface{}{
		"templateId":  templateID,
		"name":        name,
		"description": description,
		"variables": []map[string]interface{}{
			{
				"mimeType":               "text",
				"name":                   "Sample Variable",
				"placeholder":            "{SampleVariable}",
				"text":                   "Sample Content from Go Workflow",
				"allowRichTextInjection": 0,
				"autogenerated":          false,
				"count":                  1,
				"order":                  1,
				"subvariables":           []interface{}{},
				"metadata": map[string]interface{}{
					"generatedBy": "Go Workflow",
				},
				"aiPrompt": "",
			},
		},
		"tags":         []string{"api-generated"},
		"fonts":        "[]",
		"defaultFont":  "Arial",
		"replaceFonts": true,
		"metadata": map[string]interface{}{
			"sessions": []map[string]interface{}{
				{
					"id":        fmt.Sprintf("go-session-%d", time.Now().Unix()),
					"starttime": now,
					"endtime":   now,
				},
			},
			"workflow":  "Go Complete Workflow",
			"generated": now,
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal JSON: %v", err)
	}

	req, err := http.NewRequest("POST", BASE_URL+"/deliverable", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", "application/json")

	resp, err := tm.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("deliverable generation failed: %d - %s", resp.StatusCode, string(body))
	}

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
	fmt.Printf("✅ Generated: %s\n", deliverable.Name)
	fmt.Printf("📄 Created by: %s\n", deliverable.CreatedBy)
	fmt.Printf("📅 Created on: %s\n", deliverable.CreatedOn)

	return &result, nil
}

func (tm *TemplateWorkflowManager) downloadDeliverable(deliverableID, filename string) error {
	fmt.Printf("📥 Downloading file: %s\n", filename)

	req, err := http.NewRequest("GET", BASE_URL+"/deliverable/file/"+deliverableID, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx API Client")

	resp, err := tm.client.Do(req)
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

	return nil
}

// ===============================
// DEMO FUNCTIONS
// ===============================

func (tm *TemplateWorkflowManager) DemoPathA(templateFilePath string) error {
	fmt.Println("🚀 DEMO: Path A - Upload New Template Workflow")
	fmt.Println(fmt.Sprintf("%45s", "").ReplaceAll(" ", "="))
	fmt.Println()

	return tm.PathA_UploadAndGenerate(templateFilePath, "Contract Generated via Path A - API Upload")
}

func (tm *TemplateWorkflowManager) DemoPathB() error {
	fmt.Println("🚀 DEMO: Path B - Browse Existing Template Workflow")
	fmt.Println(fmt.Sprintf("%51s", "").ReplaceAll(" ", "="))
	fmt.Println()

	return tm.PathB_BrowseAndGenerate("contract", "Contract Generated via Path B - Browse & Select")
}

func (tm *TemplateWorkflowManager) DemoComparison() error {
	fmt.Println("🚀 DEMO: Complete Workflow Comparison")
	fmt.Println(fmt.Sprintf("%36s", "").ReplaceAll(" ", "="))
	fmt.Println()

	fmt.Println("Testing both paths with the same template type...\n")

	// Run Path B first (browse existing)
	err := tm.DemoPathB()
	if err != nil {
		return fmt.Errorf("demo comparison failed: %v", err)
	}

	fmt.Println("\n" + fmt.Sprintf("%60s", "").ReplaceAll(" ", "=") + "\n")

	// For Path A, we'd need a template file
	fmt.Println("📝 Path A requires a template file to upload.")
	fmt.Println("   Example: workflow.DemoPathA(\"./contract-template.docx\")")

	return nil
}