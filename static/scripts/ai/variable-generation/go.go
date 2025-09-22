package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

// Configuration
const (
    API_TOKEN = "YOUR_API_TOKEN"
    ORG_ID    = "YOUR_ORGANIZATION_ID"
    BASE_URL  = "https://api.turbodocx.com"
)

func generateAIVariable() error {
    payload := map[string]interface{}{
        "name":            "Company Performance Summary",
        "placeholder":     "{Q4Performance}",
        "templateId":      "template-abc123",
        "aiHint":          "Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements",
        "richTextEnabled": true,
    }

    jsonData, err := json.Marshal(payload)
    if err != nil {
        return err
    }

    // Create request
    req, err := http.NewRequest("POST", BASE_URL+"/ai/generate/variable/one", bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }

    req.Header.Set("Authorization", "Bearer "+API_TOKEN)
    req.Header.Set("x-rapiddocx-org-id", ORG_ID)
    req.Header.Set("Content-Type", "application/json")

    // Send request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("AI generation failed: %d", resp.StatusCode)
    }

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)

    fmt.Printf("Generated variable: %+v\n", result["data"])
    return nil
}

func main() {
    if err := generateAIVariable(); err != nil {
        fmt.Printf("Error: %v\n", err)
    }
}