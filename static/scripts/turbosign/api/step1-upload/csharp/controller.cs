using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        // Step 1: Upload Document
        using var client = new HttpClient();
        
        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_TOKEN");
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID");
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
        
        using var content = new MultipartFormDataContent();
        content.Add(new StringContent("Contract Agreement"), "name");
        
        var fileContent = new ByteArrayContent(File.ReadAllBytes("./document.pdf"));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
        content.Add(fileContent, "file", "document.pdf");
        
        var response = await client.PostAsync("https://www.turbodocx.com/turbosign/documents/upload", content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
    }
}