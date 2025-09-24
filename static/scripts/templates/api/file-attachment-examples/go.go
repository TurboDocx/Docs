package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID    = "YOUR_ORGANIZATION_ID"
	BASE_URL  = "https://api.turbodocx.com"
)

// FileMetadata represents the metadata for attached files
type FileMetadata struct {
	SelectedSheet      string   `json:"selectedSheet"`
	HasMultipleSheets  bool     `json:"hasMultipleSheets"`
	DataRange          string   `json:"dataRange,omitempty"`
	AlternativeSheets  []string `json:"alternativeSheets,omitempty"`
	Description        string   `json:"description"`
}

// Variable represents an AI variable configuration
type Variable struct {
	Name           string `json:"name"`
	Placeholder    string `json:"placeholder"`
	AIHint         string `json:"aiHint"`
	DataSourceID   string `json:"dataSourceId,omitempty"`
	SheetReference string `json:"sheetReference,omitempty"`
}

// uploadTemplateWithDataFile uploads a template with Excel data file attachment and sheet selection
func uploadTemplateWithDataFile() error {
	fmt.Println("🚀 Go: Upload template with Excel data file attachment")
	fmt.Println("==================================================")

	templateFile := "./financial-report-template.docx"
	dataFile := "./q4-financial-data.xlsx"

	// Check if files exist
	if _, err := os.Stat(templateFile); os.IsNotExist(err) {
		return fmt.Errorf("template file not found: %s", templateFile)
	}
	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		return fmt.Errorf("data file not found: %s", dataFile)
	}

	// Generate unique data file ID
	dataFileID := "go-data-123"

	// Create multipart form
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	// Add template file
	templateFileObj, err := os.Open(templateFile)
	if err != nil {
		return fmt.Errorf("failed to open template file: %v", err)
	}
	defer templateFileObj.Close()

	templatePart, err := writer.CreateFormFile("templateFile", filepath.Base(templateFile))
	if err != nil {
		return fmt.Errorf("failed to create template form file: %v", err)
	}
	if _, err := io.Copy(templatePart, templateFileObj); err != nil {
		return fmt.Errorf("failed to copy template file: %v", err)
	}

	// Add data file
	dataFileObj, err := os.Open(dataFile)
	if err != nil {
		return fmt.Errorf("failed to open data file: %v", err)
	}
	defer dataFileObj.Close()

	dataPart, err := writer.CreateFormFile(fmt.Sprintf("FileResource-%s", dataFileID), filepath.Base(dataFile))
	if err != nil {
		return fmt.Errorf("failed to create data form file: %v", err)
	}
	if _, err := io.Copy(dataPart, dataFileObj); err != nil {
		return fmt.Errorf("failed to copy data file: %v", err)
	}

	// Add form fields
	writer.WriteField("name", "Q4 Financial Report Template (Go)")
	writer.WriteField("description", "Financial report template with Excel data integration uploaded via Go")

	// File metadata
	fileMetadata := map[string]FileMetadata{
		dataFileID: {
			SelectedSheet:     "Income Statement",
			HasMultipleSheets: true,
			DataRange:         "A1:F50",
			Description:       "Q4 financial data for AI variable generation",
		},
	}
	metadataJSON, _ := json.Marshal(fileMetadata)
	writer.WriteField("fileResourceMetadata", string(metadataJSON))

	// Variables
	variables := []Variable{
		{
			Name:         "Revenue Summary",
			Placeholder:  "{RevenueSummary}",
			AIHint:       "Generate revenue summary from attached financial data",
			DataSourceID: dataFileID,
		},
		{
			Name:         "Expense Analysis",
			Placeholder:  "{ExpenseAnalysis}",
			AIHint:       "Analyze expense trends from Q4 data",
			DataSourceID: dataFileID,
		},
	}
	variablesJSON, _ := json.Marshal(variables)
	writer.WriteField("variables", string(variablesJSON))

	// Tags
	tags := []string{"go-upload", "financial", "q4", "ai-enhanced", "data-driven"}
	tagsJSON, _ := json.Marshal(tags)
	writer.WriteField("tags", string(tagsJSON))

	writer.Close()

	fmt.Printf("Template: %s\n", templateFile)
	fmt.Printf("Data Source: %s (Sheet: Income Statement)\n", dataFile)
	fmt.Printf("Data Range: A1:F50\n\n")

	// Create HTTP request
	req, err := http.NewRequest("POST", BASE_URL+"/template/upload-and-create", &body)
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx Go Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API error: %d - %s", resp.StatusCode, string(respBody))
	}

	// Parse response
	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return fmt.Errorf("failed to parse response: %v", err)
	}

	// Extract template information
	data := result["data"].(map[string]interface{})
	results := data["results"].(map[string]interface{})
	template := results["template"].(map[string]interface{})

	fmt.Println("✅ Template with data file uploaded successfully!")
	fmt.Printf("Template ID: %s\n", template["id"])
	fmt.Printf("Template Name: %s\n", template["name"])

	if variables, ok := template["variables"].([]interface{}); ok {
		fmt.Printf("Variables Extracted: %d\n", len(variables))
	}

	if defaultFont, ok := template["defaultFont"].(string); ok {
		fmt.Printf("Default Font: %s\n", defaultFont)
	}

	if redirectURL, ok := results["redirectUrl"].(string); ok {
		fmt.Printf("🔗 Redirect URL: %s\n", redirectURL)
	}

	return nil
}

// uploadTemplateWithMultipleSheets processes multiple sheets from the same Excel file
func uploadTemplateWithMultipleSheets() error {
	fmt.Println("\n📈 Go: Upload template with multi-sheet data")
	fmt.Println("============================================")

	templateFile := "./comprehensive-report-template.docx"
	dataFile := "./business-data.xlsx"

	// Check if files exist
	if _, err := os.Stat(templateFile); os.IsNotExist(err) {
		return fmt.Errorf("template file not found: %s", templateFile)
	}
	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		return fmt.Errorf("data file not found: %s", dataFile)
	}

	dataFileID := "go-multisheet-456"

	// Create multipart form
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	// Add template file
	templateFileObj, _ := os.Open(templateFile)
	defer templateFileObj.Close()
	templatePart, _ := writer.CreateFormFile("templateFile", filepath.Base(templateFile))
	io.Copy(templatePart, templateFileObj)

	// Add data file
	dataFileObj, _ := os.Open(dataFile)
	defer dataFileObj.Close()
	dataPart, _ := writer.CreateFormFile(fmt.Sprintf("FileResource-%s", dataFileID), filepath.Base(dataFile))
	io.Copy(dataPart, dataFileObj)

	// Add form fields
	writer.WriteField("name", "Comprehensive Business Report (Go Multi-Sheet)")
	writer.WriteField("description", "Multi-sheet data analysis template uploaded via Go")

	// File metadata for multiple sheets
	fileMetadata := map[string]FileMetadata{
		dataFileID: {
			SelectedSheet:     "Summary",
			HasMultipleSheets: true,
			AlternativeSheets: []string{"Revenue", "Expenses", "Projections"},
			DataRange:         "A1:Z100",
			Description:       "Comprehensive business data across multiple sheets",
		},
	}
	metadataJSON, _ := json.Marshal(fileMetadata)
	writer.WriteField("fileResourceMetadata", string(metadataJSON))

	// Variables that reference different sheets
	variables := []Variable{
		{
			Name:           "Executive Summary",
			Placeholder:    "{ExecutiveSummary}",
			AIHint:         "Create executive summary from Summary sheet data",
			DataSourceID:   dataFileID,
			SheetReference: "Summary",
		},
		{
			Name:           "Revenue Analysis",
			Placeholder:    "{RevenueAnalysis}",
			AIHint:         "Analyze revenue trends from Revenue sheet",
			DataSourceID:   dataFileID,
			SheetReference: "Revenue",
		},
		{
			Name:           "Expense Insights",
			Placeholder:    "{ExpenseInsights}",
			AIHint:         "Generate expense insights from Expenses sheet",
			DataSourceID:   dataFileID,
			SheetReference: "Expenses",
		},
	}
	variablesJSON, _ := json.Marshal(variables)
	writer.WriteField("variables", string(variablesJSON))

	// Tags
	tags := []string{"go-multi-sheet", "comprehensive", "business-analysis"}
	tagsJSON, _ := json.Marshal(tags)
	writer.WriteField("tags", string(tagsJSON))

	writer.Close()

	fmt.Printf("Template: %s\n", templateFile)
	fmt.Printf("Data Source: %s\n", dataFile)
	fmt.Printf("Primary Sheet: Summary\n")
	fmt.Printf("Alternative Sheets: Revenue, Expenses, Projections\n\n")

	// Create and send request
	req, _ := http.NewRequest("POST", BASE_URL+"/template/upload-and-create", &body)
	req.Header.Set("Authorization", "Bearer "+API_TOKEN)
	req.Header.Set("x-rapiddocx-org-id", ORG_ID)
	req.Header.Set("User-Agent", "TurboDocx Go Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API error: %d - %s", resp.StatusCode, string(respBody))
	}

	var result map[string]interface{}
	json.Unmarshal(respBody, &result)

	data := result["data"].(map[string]interface{})
	results := data["results"].(map[string]interface{})
	template := results["template"].(map[string]interface{})

	fmt.Println("✅ Multi-sheet template uploaded successfully!")
	fmt.Printf("Template ID: %s\n", template["id"])
	fmt.Printf("Template Name: %s\n", template["name"])

	if variables, ok := template["variables"].([]interface{}); ok {
		fmt.Printf("Variables with Sheet References: %d\n", len(variables))
	}

	fmt.Println("Sheets Configured: Summary (primary), Revenue, Expenses, Projections")

	return nil
}

func main() {
	fmt.Println("🚀 TurboDocx Go File Attachment Examples")
	fmt.Println("==========================================")

	// Check prerequisites
	if API_TOKEN == "YOUR_API_TOKEN" || ORG_ID == "YOUR_ORGANIZATION_ID" {
		fmt.Println("❌ Please update API_TOKEN and ORG_ID in the source code.")
		os.Exit(1)
	}

	fmt.Println("Note: Ensure the following files exist in the current directory:")
	fmt.Println("  • financial-report-template.docx - Your Word template file")
	fmt.Println("  • q4-financial-data.xlsx - Excel file with financial data")
	fmt.Println("  • comprehensive-report-template.docx - Multi-purpose template")
	fmt.Println("  • business-data.xlsx - Excel file with multiple sheets")
	fmt.Println()

	// Example 1: Single sheet data attachment
	if err := uploadTemplateWithDataFile(); err != nil {
		fmt.Printf("❌ Example 1 failed: %v\n", err)
	} else {
		fmt.Println("✅ Example 1 completed successfully!")
	}

	// Example 2: Multiple sheet data attachment
	if err := uploadTemplateWithMultipleSheets(); err != nil {
		fmt.Printf("❌ Example 2 failed: %v\n", err)
	} else {
		fmt.Println("✅ Example 2 completed successfully!")
	}

	fmt.Println("\n🎉 All Go file attachment examples completed!")
	fmt.Println("Ready to generate documents with data-enhanced templates!")
}