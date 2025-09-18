<?php
// Complete Workflow: Upload → Recipients → Prepare

// Step 1: Upload Document
$upload_url = 'https://www.turbodocx.com/turbosign/documents/upload';

$file_path = 'document.pdf';
$upload_data = [
    'name' => 'Contract Agreement',
    'file' => new CURLFile($file_path, 'application/pdf', 'document.pdf')
];

$upload_headers = [
    'Authorization: Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id: YOUR_ORGANIZATION_ID',
    'User-Agent: TurboDocx API Client'
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $upload_url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $upload_data,
    CURLOPT_HTTPHEADER => $upload_headers,
    CURLOPT_RETURNTRANSFER => true
]);

$upload_response = curl_exec($ch);
curl_close($ch);

$upload_result = json_decode($upload_response, true);
$document_id = $upload_result['data']['id'];

// Step 2: Add Recipients
$recipient_payload = [
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

$recipient_headers = [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id: YOUR_ORGANIZATION_ID',
    'User-Agent: TurboDocx API Client'
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://www.turbodocx.com/turbosign/documents/$document_id/update-with-recipients",
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($recipient_payload),
    CURLOPT_HTTPHEADER => $recipient_headers,
    CURLOPT_RETURNTRANSFER => true
]);

$recipient_response = curl_exec($ch);
curl_close($ch);

$recipient_result = json_decode($recipient_response, true);
$recipients = $recipient_result['data']['recipients'];

// Step 3: Prepare for Signing
$signature_fields = [
    [
        'recipientId' => $recipients[0]['id'],
        'type' => 'signature',
        'template' => [
            'anchor' => '{Signature1}',
            'placement' => 'replace',
            'size' => ['width' => 200, 'height' => 80],
            'offset' => ['x' => 0, 'y' => 0],
            'caseSensitive' => true,
            'useRegex' => false
        ],
        'defaultValue' => '',
        'required' => true
    ],
    [
        'recipientId' => $recipients[0]['id'],
        'type' => 'date',
        'template' => [
            'anchor' => '{Date1}',
            'placement' => 'replace',
            'size' => ['width' => 150, 'height' => 30],
            'offset' => ['x' => 0, 'y' => 0],
            'caseSensitive' => true,
            'useRegex' => false
        ],
        'defaultValue' => '',
        'required' => true
    ],
    [
        'recipientId' => $recipients[1]['id'],
        'type' => 'signature',
        'template' => [
            'anchor' => '{Signature2}',
            'placement' => 'replace',
            'size' => ['width' => 200, 'height' => 80],
            'offset' => ['x' => 0, 'y' => 0],
            'caseSensitive' => true,
            'useRegex' => false
        ],
        'defaultValue' => '',
        'required' => true
    ],
    [
        'recipientId' => $recipients[1]['id'],
        'type' => 'text',
        'template' => [
            'anchor' => '{Title2}',
            'placement' => 'replace',
            'size' => ['width' => 200, 'height' => 30],
            'offset' => ['x' => 0, 'y' => 0],
            'caseSensitive' => true,
            'useRegex' => false
        ],
        'defaultValue' => 'Business Partner',
        'required' => false
    ]
];

$prepare_headers = [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_API_TOKEN',
    'x-rapiddocx-org-id: YOUR_ORGANIZATION_ID',
    'User-Agent: TurboDocx API Client'
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://www.turbodocx.com/turbosign/documents/$document_id/prepare-for-signing",
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($signature_fields),
    CURLOPT_HTTPHEADER => $prepare_headers,
    CURLOPT_RETURNTRANSFER => true
]);

$prepare_response = curl_exec($ch);
curl_close($ch);

$final_result = json_decode($prepare_response, true);
print_r($final_result);
?>