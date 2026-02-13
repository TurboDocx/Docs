const fetch = require('node-fetch');

// Configuration
const API_TOKEN = "YOUR_API_TOKEN";
const ORG_ID = "YOUR_ORGANIZATION_ID";
const BASE_URL = "https://api.turbodocx.com";

async function generateAIVariable() {
  const payload = {
    name: 'Company Performance Summary',
    placeholder: '{Q4Performance}',
    aiHint: 'Generate a professional executive summary of Q4 financial performance highlighting revenue growth, profit margins, and key achievements',
    richTextEnabled: true
  };

  const response = await fetch(`${BASE_URL}/ai/generate/variable/one`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'x-rapiddocx-org-id': ORG_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`AI generation failed: ${response.status}`);
  }

  const result = await response.json();
  console.log('Generated variable:', result.data);
  return result;
}

// Run the example
generateAIVariable().catch(console.error);