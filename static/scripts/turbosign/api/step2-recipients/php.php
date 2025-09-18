<?php
// Step 2: Add Recipients
$document_id = "4a20eca5-7944-430c-97d5-fcce4be24296";

$url = "https://www.turbodocx.com/turbosign/documents/$document_id/update-with-recipients";

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id: YOUR_ORGANIZATION_ID',
    'User-Agent: TurboDocx API Client'
];

$payload = [
    'document' => [
        'name' => 'Contract Agreement - Updated',
        'description' => 'This document requires electronic signatures from both parties. Please review all content carefully before signing.'
    ],
    'recipients' => [
        [
            'name' => 'John Smith',
            'email' => 'john.smith@company.com',
            'signingOrder' => 1,
            'metadata' => [
                'color' => 'hsl(200, 75%, 50%)',
                'lightColor' => 'hsl(200, 75%, 93%)'
            ],
            'documentId' => $document_id
        ],
        [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@partner.com',
            'signingOrder' => 2,
            'metadata' => [
                'color' => 'hsl(270, 75%, 50%)',
                'lightColor' => 'hsl(270, 75%, 93%)'
            ],
            'documentId' => $document_id
        ]
    ]
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>