---
title: Scripted setup for TurboSign for Salesforce
slug: /Integrations/turbosign-for-salesforce/scripted-setup
sidebar_position: 4
description: Set up TurboSign for Salesforce from the Salesforce CLI. Store the API key and Organization ID, assign permission sets, verify the connection, and deploy document setups as metadata.
keywords:
  - turbosign salesforce cli
  - sf cli external credential
  - salesforce connect api credential
  - salesforce named credential script
  - custom metadata deploy
  - salesforce devops e-signature
---

# Scripted setup for TurboSign for Salesforce

This page is for admins and developers who prefer scripts over clicking through Setup, or who need to set up several orgs (sandboxes, staging, production) the same way. Each section does the same thing as a step in [Set up TurboSign for Salesforce](/docs/Integrations/turbosign-for-salesforce/setup).

## Before you begin

- Install the [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli) (`sf`).
- Make sure `node` is on your PATH (check with `node --version`). The credential step below uses [Node.js](https://nodejs.org) to build its request body.
- Install the TurboSign for Salesforce package in the target org.
- Log in to the org and give it an alias. These examples use `myorg`:

```bash
sf org login web --alias myorg
```

## Store the API key and Organization ID

Salesforce stores principal parameters through the Connect REST API (`/named-credentials/credential`). They can't be deployed as metadata, which is by design: secrets never live in source control.

Type the key at a silent prompt so it never appears on screen or in your shell history:

```bash
# Prompt for the values (the key is not echoed). Works in bash and zsh.
printf 'TurboDocx API key: '; stty -echo; read -r TDX_KEY; stty echo; echo
printf 'TurboDocx Organization ID: '; read -r TDX_ORG

# Write the request body to a file only you can read. Node.js builds the
# JSON, so quotes and backslashes in the values are escaped correctly.
( umask 077
  TDX_KEY="$TDX_KEY" TDX_ORG="$TDX_ORG" node -e '
    const { TDX_KEY, TDX_ORG } = process.env;
    console.log(JSON.stringify({
      externalCredential: "TurboDocx_API",
      principalName: "TurboDocxPrincipal",
      principalType: "NamedPrincipal",
      authenticationProtocol: "Custom",
      credentials: {
        ApiKey: { value: TDX_KEY, encrypted: true },
        OrgId: { value: TDX_ORG, encrypted: true }
      }
    }, null, 2));' > ./credential.json )

# First time: POST creates the parameters. To rotate the key later, run the same command with --method PUT.
sf api request rest "/services/data/v62.0/named-credentials/credential" \
  --method POST --body @credential.json --target-org myorg

# Clean up
rm -f ./credential.json; unset TDX_KEY TDX_ORG
```

Check that both parameters exist. Salesforce returns the names but never the values:

```bash
sf api request rest \
  "/services/data/v62.0/named-credentials/credential?externalCredential=TurboDocx_API&principalName=TurboDocxPrincipal&principalType=NamedPrincipal" \
  --target-org myorg
```

You should see `ApiKey` and `OrgId` under `credentials`, each with `"encrypted": true`.

## Point the Named Credential at TurboDocx

The package installs the **TurboDocx_API** Named Credential with the production URL. To use a different address, retrieve it, edit the URL, and deploy it back:

```bash
sf project retrieve start --metadata NamedCredential:TurboDocx_API --target-org myorg
# Edit force-app/main/default/namedCredentials/TurboDocx_API.namedCredential-meta.xml:
#   change the <parameterValue> of the Url parameter
sf project deploy start --metadata NamedCredential:TurboDocx_API --target-org myorg
```

Deploying the Named Credential does not touch the parameters you stored above.

## Assign permission sets

```bash
# Reps (and any integration or automation user that sends, reminds, or voids)
sf org assign permset --name TurboSign_User \
  --on-behalf-of rep1@yourcompany.com --on-behalf-of rep2@yourcompany.com --target-org myorg

# Admins who build document setups
sf org assign permset --name TurboSign_Admin --on-behalf-of admin@yourcompany.com --target-org myorg
```

## Verify the connection

This anonymous Apex makes one read-only call to TurboDocx with the stored credentials and prints the HTTP status. It changes nothing in either system.

```bash
cat > ./check_turbodocx.apex <<'EOF'
HttpRequest req = new HttpRequest();
req.setEndpoint('callout:TurboDocx_API/template-item?page=1&limit=1');
req.setMethod('GET');
req.setTimeout(60000);
req.setHeader('Authorization', 'Bearer {!$Credential.TurboDocx_API.ApiKey}');
req.setHeader('x-rapiddocx-org-id', '{!$Credential.TurboDocx_API.OrgId}');
try {
    HttpResponse res = new Http().send(req);
    System.debug(LoggingLevel.ERROR, 'TURBODOCX STATUS=' + res.getStatusCode());
} catch (Exception e) {
    System.debug(LoggingLevel.ERROR, 'TURBODOCX ERROR=' + e.getMessage());
}
EOF
sf apex run --file ./check_turbodocx.apex --target-org myorg | grep -E 'USER_DEBUG|Error'
```

The command prints one log line. It starts with a timestamp and `USER_DEBUG`, and ends with the result:

| Line ends with | Meaning |
|---|---|
| `TURBODOCX STATUS=200` | Connected. |
| `TURBODOCX STATUS=401` | The key or Organization ID is wrong, or the key was revoked. |
| `TURBODOCX ERROR=` followed by `Field TurboDocx_API.ApiKey does not exist` (or `OrgId`) | The `ApiKey` or `OrgId` parameter is missing or misspelled. |
| `TURBODOCX ERROR=` followed by `We couldn't access the credential(s)` | Your user doesn't have the **TurboSign User** or **TurboSign Admin** permission set. |

If you see an `Error` line from `sf` instead, the script didn't run. Check that you are logged in to the org (`sf org list`).

## Deploy document setups as metadata

The **TurboSign Setup** builder saves each document setup as custom metadata records. You can write the same records by hand, keep them in source control, and deploy them to every org.

One setup is made of four record types:

| Record type | One record per… | Key fields |
|---|---|---|
| `TurboSign_Config__mdt` | document setup | `Source_SObject__c`, `Deliverable_Template_Id__c`, `Document_Name_Template__c`, `Date_Format__c`, `Completion_Field__c`, `Completion_Value__c`, `Active__c` |
| `TurboSign_Variable_Mapping__mdt` | data token | `Config__c`, `Placeholder__c`, `Source_Field_Path__c`, `Default_Value__c`, `Mime_Type__c`, `Required__c`, `Active__c` |
| `TurboSign_Recipient_Rule__mdt` | signer | `Config__c`, `Role_Label__c`, `Name_Field_Path__c`, `Email_Field_Path__c` (or `Static_Name__c`, `Static_Email__c`), `Signing_Order__c`, `Required__c`, `Active__c` |
| `TurboSign_Field_Rule__mdt` | signing spot | `Config__c`, `Anchor__c`, `Field_Type__c`, `Recipient_Role_Label__c`, `Placement__c`, `Required__c`, `Active__c` |

`Config__c` holds the setup's API name (its DeveloperName) on its own, for example `Service_Agreement`, not `TurboSign_Config.Service_Agreement`. `Recipient_Role_Label__c` on a signing spot must match a signer's `Role_Label__c`.

The sample below is a complete setup for a Service Agreement sent from an Opportunity. It has two data tokens, one signer, and two signing spots for that signer. The template holds `{sig}` and `{date}` as plain text, and the send fills them in, the same as a setup built in **TurboSign Setup**. Put the files under `force-app/main/default/customMetadata/` and replace `YOUR_TEMPLATE_ID` with your TurboDocx template's ID.

The sample sends to the Opportunity's owner, so you can test the full flow on yourself. For real sends, point the signer's name and email paths at a field that leads to the customer, for example a custom Contact lookup on Opportunity, as `Contact__r.Name` and `Contact__r.Email`.

```xml title="TurboSign_Config.Service_Agreement.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Service Agreement</label>
    <protected>false</protected>
    <values><field>Source_SObject__c</field><value xsi:type="xsd:string">Opportunity</value></values>
    <values><field>Active__c</field><value xsi:type="xsd:boolean">true</value></values>
    <values><field>Deliverable_Template_Id__c</field><value xsi:type="xsd:string">YOUR_TEMPLATE_ID</value></values>
    <values><field>Document_Name_Template__c</field><value xsi:type="xsd:string">Service Agreement</value></values>
</CustomMetadata>
```

```xml title="TurboSign_Variable_Mapping.Service_Agreement_ClientName.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Client Name</label>
    <protected>false</protected>
    <values><field>Config__c</field><value xsi:type="xsd:string">Service_Agreement</value></values>
    <values><field>Placeholder__c</field><value xsi:type="xsd:string">{ClientName}</value></values>
    <values><field>Source_Field_Path__c</field><value xsi:type="xsd:string">Account.Name</value></values>
    <values><field>Mime_Type__c</field><value xsi:type="xsd:string">text</value></values>
</CustomMetadata>
```

```xml title="TurboSign_Variable_Mapping.Service_Agreement_EffectiveDate.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Effective Date</label>
    <protected>false</protected>
    <values><field>Config__c</field><value xsi:type="xsd:string">Service_Agreement</value></values>
    <values><field>Placeholder__c</field><value xsi:type="xsd:string">{EffectiveDate}</value></values>
    <values><field>Default_Value__c</field><value xsi:type="xsd:string">January 1, 2027</value></values>
    <values><field>Mime_Type__c</field><value xsi:type="xsd:string">text</value></values>
</CustomMetadata>
```

```xml title="TurboSign_Recipient_Rule.Service_Agreement_Signer.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Signer</label>
    <protected>false</protected>
    <values><field>Config__c</field><value xsi:type="xsd:string">Service_Agreement</value></values>
    <values><field>Role_Label__c</field><value xsi:type="xsd:string">Signer</value></values>
    <values><field>Name_Field_Path__c</field><value xsi:type="xsd:string">Owner.Name</value></values>
    <values><field>Email_Field_Path__c</field><value xsi:type="xsd:string">Owner.Email</value></values>
    <values><field>Signing_Order__c</field><value xsi:type="xsd:double">1</value></values>
    <values><field>Required__c</field><value xsi:type="xsd:boolean">true</value></values>
</CustomMetadata>
```

```xml title="TurboSign_Field_Rule.Service_Agreement_SignerSig.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Signer Signature</label>
    <protected>false</protected>
    <values><field>Config__c</field><value xsi:type="xsd:string">Service_Agreement</value></values>
    <values><field>Anchor__c</field><value xsi:type="xsd:string">{sig}</value></values>
    <values><field>Field_Type__c</field><value xsi:type="xsd:string">signature</value></values>
    <values><field>Recipient_Role_Label__c</field><value xsi:type="xsd:string">Signer</value></values>
    <values><field>Placement__c</field><value xsi:type="xsd:string">replace</value></values>
    <values><field>Required__c</field><value xsi:type="xsd:boolean">true</value></values>
</CustomMetadata>
```

```xml title="TurboSign_Field_Rule.Service_Agreement_SignerDate.md-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Signer Date</label>
    <protected>false</protected>
    <values><field>Config__c</field><value xsi:type="xsd:string">Service_Agreement</value></values>
    <values><field>Anchor__c</field><value xsi:type="xsd:string">{date}</value></values>
    <values><field>Field_Type__c</field><value xsi:type="xsd:string">date</value></values>
    <values><field>Recipient_Role_Label__c</field><value xsi:type="xsd:string">Signer</value></values>
    <values><field>Placement__c</field><value xsi:type="xsd:string">replace</value></values>
    <values><field>Required__c</field><value xsi:type="xsd:boolean">false</value></values>
</CustomMetadata>
```

Deploy them:

```bash
sf project deploy start --source-dir force-app/main/default/customMetadata --target-org myorg
```

:::tip Start from the builder
The fastest way to get correct records is to build a setup once in **TurboSign Setup**, then retrieve it:
`sf project retrieve start --metadata "CustomMetadata:TurboSign_Config.Service_Agreement" --target-org myorg`
(repeat for the mapping, recipient, and field records, or retrieve `CustomMetadata` by name pattern from your IDE).
:::

## Send from a Flow

For automatic sends, for example when an Opportunity reaches a stage, add the **TurboSign: Send for Signature** action to a record-triggered Flow. Pass the record Id and the setup's API name. Flow sends run in the background, and failures are saved as **TurboSign Log** records (`TurboSign_Log__c`) instead of being shown to a user. Query them, or build a report on them, to monitor automated sends. Assign **TurboSign User** to the user the Flow runs as.
