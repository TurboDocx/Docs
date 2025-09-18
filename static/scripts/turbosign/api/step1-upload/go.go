package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	// Step 1: Upload Document
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	
	writer.WriteField("name", "Contract Agreement")
	
	file, _ := os.Open("./document.pdf")
	defer file.Close()
	part, _ := writer.CreateFormFile("file", "document.pdf")
	io.Copy(part, file)
	writer.Close()
	
	req, _ := http.NewRequest("POST", "https://www.turbodocx.com/turbosign/documents/upload", &buf)
	req.Header.Set("Authorization", "Bearer YOUR_API_TOKEN")
	req.Header.Set("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID")
	req.Header.Set("User-Agent", "TurboDocx API Client")
	req.Header.Set("Content-Type", writer.FormDataContentType())
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	
	body, _ := io.ReadAll(resp.Body)
	println(string(body))
}