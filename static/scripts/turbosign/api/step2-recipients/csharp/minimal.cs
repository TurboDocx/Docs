using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        // Step 2: Add Recipients
        var documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";
        
        using var client = new HttpClient();
        
        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_TOKEN");
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID");
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
        
        var payload = @"{
          ""document"": {
            ""name"": ""Contract Agreement - Updated"",
            ""description"": ""This document requires electronic signatures from both parties. Please review all content carefully before signing.""
          },
          ""recipients"": [
            {
              ""name"": ""John Smith"",
              ""email"": ""john.smith@company.com"",
              ""signingOrder"": 1,
              ""metadata"": {
                ""color"": ""hsl(200, 75%, 50%)"",
                ""lightColor"": ""hsl(200, 75%, 93%)""
              },
              ""documentId"": """ + documentId + @"""
            },
            {
              ""name"": ""Jane Doe"",
              ""email"": ""jane.doe@partner.com"",
              ""signingOrder"": 2,
              ""metadata"": {
                ""color"": ""hsl(270, 75%, 50%)"",
                ""lightColor"": ""hsl(270, 75%, 93%)""
              },
              ""documentId"": """ + documentId + @"""
            }
          ]
        }";
        
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"https://www.turbodocx.com/turbosign/documents/{documentId}/update-with-recipients", content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
    }
}