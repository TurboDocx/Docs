using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        // Step 3: Prepare for Signing
        var documentId = "4a20eca5-7944-430c-97d5-fcce4be24296";
        
        using var client = new HttpClient();
        
        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_TOKEN");
        client.DefaultRequestHeaders.Add("x-rapiddocx-org-id", "YOUR_ORGANIZATION_ID");
        client.DefaultRequestHeaders.Add("User-Agent", "TurboDocx API Client");
        
        var payload = @"[
          {
            ""recipientId"": ""5f673f37-9912-4e72-85aa-8f3649760f6b"",
            ""type"": ""signature"",
            ""template"": {
              ""anchor"": ""{Signature1}"",
              ""placement"": ""replace"",
              ""size"": { ""width"": 200, ""height"": 80 },
              ""offset"": { ""x"": 0, ""y"": 0 },
              ""caseSensitive"": true,
              ""useRegex"": false
            },
            ""defaultValue"": """",
            ""required"": true
          },
          {
            ""recipientId"": ""5f673f37-9912-4e72-85aa-8f3649760f6b"",
            ""type"": ""date"",
            ""template"": {
              ""anchor"": ""{Date1}"",
              ""placement"": ""replace"",
              ""size"": { ""width"": 150, ""height"": 30 },
              ""offset"": { ""x"": 0, ""y"": 0 },
              ""caseSensitive"": true,
              ""useRegex"": false
            },
            ""defaultValue"": """",
            ""required"": true
          },
          {
            ""recipientId"": ""a8b9c1d2-3456-7890-abcd-ef1234567890"",
            ""type"": ""signature"",
            ""template"": {
              ""anchor"": ""{Signature2}"",
              ""placement"": ""replace"",
              ""size"": { ""width"": 200, ""height"": 80 },
              ""offset"": { ""x"": 0, ""y"": 0 },
              ""caseSensitive"": true,
              ""useRegex"": false
            },
            ""defaultValue"": """",
            ""required"": true
          },
          {
            ""recipientId"": ""a8b9c1d2-3456-7890-abcd-ef1234567890"",
            ""type"": ""text"",
            ""template"": {
              ""anchor"": ""{Title2}"",
              ""placement"": ""replace"",
              ""size"": { ""width"": 200, ""height"": 30 },
              ""offset"": { ""x"": 0, ""y"": 0 },
              ""caseSensitive"": true,
              ""useRegex"": false
            },
            ""defaultValue"": ""Business Partner"",
            ""required"": false
          }
        ]";
        
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"https://www.turbodocx.com/turbosign/documents/{documentId}/prepare-for-signing", content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
    }
}