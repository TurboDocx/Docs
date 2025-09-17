using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

class Program
{
    static async Task Main(string[] args)
    {
        // Complete Workflow: Upload → Recipients → Prepare
        using var client = new HttpClient();
        
        // Step 1: Upload Document
        using var uploadContent = new MultipartFormDataContent();
        uploadContent.Add(new StringContent("Contract Agreement"), "name");
        
        var fileContent = new ByteArrayContent(File.ReadAllBytes("./document.pdf"));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
        uploadContent.Add(fileContent, "file", "document.pdf");
        
        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_TOKEN");
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID");
        client.DefaultRequestHeaders.Add("origin", "https://www.turbodocx.com");
        client.DefaultRequestHeaders.Add("referer", "https://www.turbodocx.com");
        client.DefaultRequestHeaders.Add("accept", "application/json, text/plain, */*");
        
        var uploadResponse = await client.PostAsync("https://www.turbodocx.com/turbosign/documents/upload", uploadContent);
        var uploadResult = await uploadResponse.Content.ReadAsStringAsync();
        
        var uploadDoc = JsonDocument.Parse(uploadResult);
        var documentId = uploadDoc.RootElement.GetProperty("data").GetProperty("id").GetString();
        
        // Step 2: Add Recipients
        var recipientPayload = @"{
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
        
        var recipientContent = new StringContent(recipientPayload, Encoding.UTF8, "application/json");
        var recipientResponse = await client.PostAsync($"https://www.turbodocx.com/turbosign/documents/{documentId}/update-with-recipients", recipientContent);
        var recipientResult = await recipientResponse.Content.ReadAsStringAsync();
        
        var recipientDoc = JsonDocument.Parse(recipientResult);
        var recipients = recipientDoc.RootElement.GetProperty("data").GetProperty("recipients");
        
        // Step 3: Prepare for Signing
        var signaturePayload = $@"[
          {{
            ""recipientId"": ""{recipients[0].GetProperty("id").GetString()}"",
            ""type"": ""signature"",
            ""template"": {{
              ""anchor"": ""{{Signature1}}"",
              ""placement"": ""replace"",
              ""size"": {{ ""width"": 200, ""height"": 80 }},
              ""offset"": {{ ""x"": 0, ""y"": 0 }},
              ""caseSensitive"": true,
              ""useRegex"": false
            }},
            ""defaultValue"": """",
            ""required"": true
          }},
          {{
            ""recipientId"": ""{recipients[0].GetProperty("id").GetString()}"",
            ""type"": ""date"",
            ""template"": {{
              ""anchor"": ""{{Date1}}"",
              ""placement"": ""replace"",
              ""size"": {{ ""width"": 150, ""height"": 30 }},
              ""offset"": {{ ""x"": 0, ""y"": 0 }},
              ""caseSensitive"": true,
              ""useRegex"": false
            }},
            ""defaultValue"": """",
            ""required"": true
          }},
          {{
            ""recipientId"": ""{recipients[1].GetProperty("id").GetString()}"",
            ""type"": ""signature"",
            ""template"": {{
              ""anchor"": ""{{Signature2}}"",
              ""placement"": ""replace"",
              ""size"": {{ ""width"": 200, ""height"": 80 }},
              ""offset"": {{ ""x"": 0, ""y"": 0 }},
              ""caseSensitive"": true,
              ""useRegex"": false
            }},
            ""defaultValue"": """",
            ""required"": true
          }},
          {{
            ""recipientId"": ""{recipients[1].GetProperty("id").GetString()}"",
            ""type"": ""text"",
            ""template"": {{
              ""anchor"": ""{{Title2}}"",
              ""placement"": ""replace"",
              ""size"": {{ ""width"": 200, ""height"": 30 }},
              ""offset"": {{ ""x"": 0, ""y"": 0 }},
              ""caseSensitive"": true,
              ""useRegex"": false
            }},
            ""defaultValue"": ""Business Partner"",
            ""required"": false
          }}
        ]";
        
        var prepareContent = new StringContent(signaturePayload, Encoding.UTF8, "application/json");
        var prepareResponse = await client.PostAsync($"https://www.turbodocx.com/turbosign/documents/{documentId}/prepare-for-signing", prepareContent);
        var finalResult = await prepareResponse.Content.ReadAsStringAsync();
        
        Console.WriteLine(finalResult);
    }
}