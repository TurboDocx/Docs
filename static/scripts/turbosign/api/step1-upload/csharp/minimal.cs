using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    // Configuration - Update these values
    private const string API_TOKEN = "YOUR_API_TOKEN";
    private const string ORG_ID = "YOUR_ORGANIZATION_ID";
    private const string BASE_URL = "https://www.turbodocx.com/turbosign";
    private const string DOCUMENT_NAME = "Contract Agreement";
    static async Task Main(string[] args)
    {
        // Step 1: Upload Document
        using var client = new HttpClient();
        
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + API_TOKEN);
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", ORG_ID);
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
        
        using var content = new MultipartFormDataContent();
        content.Add(new StringContent(DOCUMENT_NAME), "name");
        
        var fileContent = new ByteArrayContent(File.ReadAllBytes("./document.pdf"));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
        content.Add(fileContent, "file", "document.pdf");
        
        var response = await client.PostAsync(BASE_URL + "/documents/upload", content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
    }
}