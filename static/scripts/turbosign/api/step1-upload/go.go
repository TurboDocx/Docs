package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

// Configuration - Update these values
const (
	API_TOKEN = "YOUR_API_TOKEN"
	ORG_ID = "YOUR_ORGANIZATION_ID"
	BASE_URL = "https://api.turbodocx.com"
	DOCUMENT_NAME = "Contract Agreement"
)

func main() {
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
	
	body, _ := io.ReadAll(resp.Body)
	println(string(body))
}