---
title: HubSpot Integration
sidebar_position: 4
description: Transform your HubSpot data into professional documents, proposals, and presentations with TurboDocx. Create personalized deliverables using your real customer data — powered by AI.
keywords: 
  - hubspot integration
  - crm documents
  - hubspot to document
  - hubspot proposal generator
  - hubspot report maker
  - crm document automation
  - hubspot data export
  - customer data documents
  - hubspot contact documents
  - hubspot deal proposals
  - automated crm reporting
  - hubspot document generation
  - crm to powerpoint
  - hubspot ai documents
  - hubspot custom fields
  - hubspot private app
  - hubspot api integration
  - crm data visualization
  - hubspot workflow automation
  - hubspot business documents
---

# Turn Your HubSpot Data into Professional Documents & Presentations

Say goodbye to copy-pasting customer information! TurboDocx's HubSpot integration automatically pulls your real CRM data to create personalized documents, proposals, and presentations. No more "John Doe" placeholder text — use actual customer names, deals, and details.

## What You Can Create

- **📊 Client Proposals**: Use real deal data to create compelling, personalized proposals
- **📄 Contact Reports**: Generate comprehensive reports with actual customer information
- **📋 Meeting Summaries**: Create professional meeting notes using your HubSpot data
- **💼 Sales Presentations**: Build custom presentations with live customer data
- **📝 Follow-up Documents**: Generate personalized follow-ups using contact details
- **🔄 Automated Reports**: Create recurring reports with fresh data from HubSpot

<br/>

## Before You Begin

:::tip For Our Technology-Shy Friends
Don't worry! We've made this guide so detailed that even your least tech-savvy team member can follow it. Think of it as IKEA instructions, but for software — and way less frustrating! 😄
:::

To use the HubSpot integration, you'll need:

- A HubSpot account (free or paid — we don't judge!)
- Administrative access to create a HubSpot app (or a very patient IT person)
- About 30 minutes and a cup of coffee ☕
- This guide (which you're already reading — you're ahead of the game!)

:::warning Important Disclaimer
This process involves creating something called a "private app" in HubSpot. Don't panic! It's not as scary as it sounds. Think of it as giving TurboDocx a special key to your HubSpot data — but only the data you want to share.
:::

<br/>

## Step 1: Creating Your HubSpot Private App

The first step is creating a HubSpot private app. Think of this as getting a library card — it gives TurboDocx permission to check out (but not steal!) your HubSpot data.

### Navigate to HubSpot Developer Settings

1. **Open your web browser** and go to [hubspot.com](https://hubspot.com)
   - Use Chrome, Firefox, Safari, or Edge (Internet Explorer users: it's time to upgrade! 😉)

<br/>

2. **Log into your HubSpot account**
   - Use your normal email and password
   - If you forgot your password, there's a "Forgot Password?" link (we've all been there!)

![HubSpot Login](/img/hubspot-integration/hubspot-dashboard.png)

<br/>

3. **Find the Settings gear** in the top right corner
   - It looks like a little wheel with teeth ⚙️
   - If you can't find it, it's probably hiding next to your profile picture

![HubSpot Settings Gear](/img/hubspot-integration/hubspot-settings.png)

<br/>

4. **Click on the Settings gear**
   - A menu will appear (like magic, but less impressive)

<br/>

### Navigate to Integrations

1. **Look for "Integrations"** in the left sidebar
   - It's usually about halfway down the list
   - If you don't see it, try scrolling down slowly (no need to rush!)

![Navigate to Integrations](/img/hubspot-integration/create-private-app-steps.png)

<br/>

2. **Click on "Integrations"**
   - The menu will expand to show more options

<br/>

3. **Find and click "Private Apps"**
   - It might be hiding under the Integrations section
   - Think of it as a secret menu item at your favorite restaurant

![Navigate to Integrations](/img/hubspot-integration/create-private-app-steps.png)

<br/>

### Create Your Private App

1. **Click "Create a private app"**
   - Usually a big, friendly blue button
   - If there's no button, you might need admin permissions (time to sweet-talk your IT department!)

![Navigate to Integrations](/img/hubspot-integration/create-private-app-steps.png)

<br/>

2. **Fill in the basic information**:
   - **App name**: Type something memorable like "TurboDocx Integration" or "My Document Generator"
   - **Description**: Add a simple description like "This connects my HubSpot data to TurboDocx for document generation"
   - **Logo**: Skip this — we're not entering a beauty contest!

![App Basic Info](/img/hubspot-integration/app-logo-description.png)

<br/>

:::tip Pro Tip
Choose an app name you'll remember six months from now. "App123" might seem clever today, but future you will not be amused! 😏
:::

### Configure App Permissions (The Important Part!)

3. **Click on the "Scopes" tab**
   - This is where you tell HubSpot what data TurboDocx can access
   - Think of it as setting up a babysitter's permissions for your house

![Scopes Tab](/img/hubspot-integration/add-scope-step.png)

<br/>

4. **Add the required scopes** (permissions)
   - We need to add A LOT of scopes — don't worry, this is normal!
   - Each scope is like giving TurboDocx permission to read a specific type of data

![Scopes Tab](/img/hubspot-integration/scope-adding-step.png)

:::warning Attention to Detail Required
This next part requires some patience. You'll be adding about 50 different permissions. It's like checking off a very long grocery list — tedious, but necessary for the feast ahead! 🛒
:::

**Here's the complete list of scopes to add** (copy each one EXACTLY):

**CRM Lists:**
- `crm.lists.read`

**CRM Objects (the big list):**
- `crm.objects.appointments.read`
- `crm.objects.carts.read`
- `crm.objects.commercepayments.read`
- `crm.objects.companies.read`
- `crm.objects.contacts.read`
- `crm.objects.courses.read`
- `crm.objects.custom.read`
- `crm.objects.deals.read`
- `crm.objects.feedback_submissions.read`
- `crm.objects.goals.read`
- `crm.objects.invoices.read`
- `crm.objects.leads.read`
- `crm.objects.line_items.read`
- `crm.objects.listings.read`
- `crm.objects.marketing_events.read`
- `crm.objects.orders.read`
- `crm.objects.owners.read`
- `crm.objects.partner-clients.read`
- `crm.objects.partner-services.read`
- `crm.objects.products.read`
- `crm.objects.quotes.read`
- `crm.objects.services.read`
- `crm.objects.subscriptions.read`
- `crm.objects.users.read`

**CRM Pipelines:**
- `crm.pipelines.orders.read`

**CRM Schemas:**
- `crm.schemas.appointments.read`
- `crm.schemas.carts.read`
- `crm.schemas.commercepayments.read`
- `crm.schemas.companies.read`
- `crm.schemas.contacts.read`
- `crm.schemas.courses.read`
- `crm.schemas.custom.read`
- `crm.schemas.deals.read`
- `crm.schemas.invoices.read`
- `crm.schemas.line_items.read`
- `crm.schemas.listings.read`
- `crm.schemas.orders.read`
- `crm.schemas.quotes.read`
- `crm.schemas.services.read`
- `crm.schemas.subscriptions.read`

**Sales & Communication:**
- `sales-email-read`

**Scheduler:**
- `scheduler.meetings.meeting-link.read`

**Settings:**
- `settings.currencies.read`
- `settings.security.security_health.read`
- `settings.users.read`
- `settings.users.teams.read`

**Tax:**
- `tax_rates.read`

### How to Add Each Scope

**For each scope in the list above:**

1. **Find the search box** (it might say "Search for scopes")
2. **Click inside the search box**
3. **Type the scope name exactly** (every dot and dash matters!)
4. **Look for the dropdown** that appears below
5. **Click on the matching result**
6. **Repeat for the next scope**

![Adding Scopes Process](/img/hubspot-integration/checked-scopes.png)

<br/>

:::tip Patience, Grasshopper
Yes, this is tedious. Yes, you need to do all of them. Think of it as meditation — or count it as your daily exercise! Each click is one step closer to document automation nirvana. 🧘‍♂️
:::

### Create Your App

5. **Click "Create app"** when you're done adding scopes
   - Take a moment to admire your handiwork first!

![Create App Final](/img/hubspot-integration/scope-added.png)
![Create App Final](/img/hubspot-integration/app-created.png)

<br/>

6. **You'll see the Access Token and Client Secret (needed for later)**
   - This is super important! You'll see a long string of letters and numbers
   - leave this page open to use these two keys later

![Access Token](/img/hubspot-integration/click-on-auth.png)
![Access Token](/img/hubspot-integration/access-token-copiying.png)

<br/>

:::danger Critical Warning
This access token is like the keys to your car — don't lose it, and don't give it to strangers!. you can always find it in this page here again, there is also the option to get fresh access tokens in case the current Access Token or Client Secret gets compromised.
:::

<br/>

## Step 2: Configuring TurboDocx

Now we'll connect your shiny new HubSpot app to TurboDocx. This is like introducing two friends who are perfect for each other!

### Navigate to TurboDocx Settings

1. **Go to your TurboDocx dashboard**
   - Log in if you haven't already

![TurboDocx Dashboard](/img/hubspot-integration/settings-link.png)

<br/>

2. **Click on "Settings"**
   - Look for the gear icon or "Settings" text
   - Usually in the top menu or sidebar

![TurboDocx Dashboard](/img/hubspot-integration/settings-link.png)

<br/>

3. **Click on "Organization Settings"**
   - This might be in a dropdown or separate tab
   - If you can't find it, try looking for "Integrations" or "Connected Apps"

![Organization Settings](/img/hubspot-integration/org-settings.png)

<br/>

### Configure HubSpot Integration

4. **Find the HubSpot section**
   - Look for the HubSpot logo or "HubSpot Integration"
   - It might be in a list with other integrations

![HubSpot Section](/img/hubspot-integration/select-configure-hubspot.png)

<br/>

5. **Click "Configure HubSpot"**
   - A popup or form will appear
   - This is where the magic happens! ✨

![Configure HubSpot Button](/img/hubspot-integration/hubspot-config-modal.png)

<br/>

6. **Enter your Access Token**
   - Copy the Access Token from your HubSpot private app page and paste it here
   - Copy the Client Secret from your HubSpot private app page and paste it in the Client Secret field

![Access Token](/img/hubspot-integration/access-token-copiying.png)
![Enter Access Token](/img/hubspot-integration/copied-access-token.png)

<br/>

7. **Click "Save Configuration"**
   - Cross your fingers (optional, but recommended!)

![Save Configuration](/img/hubspot-integration/save-config.png)

<br/>

### Test Your Connection

8. **Click "Connect to HubSpot"**
   - This button appears after you save your configuration

![Connect to HubSpot](/img/hubspot-integration/connect-hubspot.png)

<br/>

### Sync Your HubSpot Data

9. **Click "Refresh Fields"**
    - This button appears after the connection test succeeds
    - It downloads all your custom HubSpot fields and data
    - It also tests if your access token works

![Refresh Fields Button](/img/hubspot-integration/refresh-fields.png)

<br/>

10. **Wait for the field sync**
    - This can take 1-3 minutes
    - Time to check your email or practice your victory dance! 💃

<br/>

:::tip Success Celebration
If you've made it this far, you deserve a pat on the back! You've successfully connected HubSpot to TurboDocx. That's no small feat — you're basically a tech wizard now! 🧙‍♂️
:::

<br/>

## Step 3: Using Your HubSpot Integration

Time to put your new integration to work! This is where the magic happens — turning your HubSpot data into beautiful documents.

### Creating Your First Document

1. **Go to document generation**
   - Look for "Create Document", "New Document", or similar
   - This is usually on your main dashboard

![Document Generation](/img/hubspot-integration/home-page.png)

<br/>

2. **Select Template**
   - Click on any available template

![Change Source](/img/hubspot-integration/template-page.png)

<br/>

3. **Change your data source**
   - Click on the "Change Source" dropdown
   - Select "Change Source" from the menu

![Change Source](/img/hubspot-integration/change-resource.png)

<br/>

4. **Go to the App Library**
   - Click on the "App Library" tab
   - This shows all your connected integrations

![App Library](/img/hubspot-integration/app-library.png)

<br/>

5. **Select CRM category**
   - Look for "CRM" and click on it
   - This filters to show only CRM integrations

![Select CRM](/img/hubspot-integration/crm-select.png)

<br/>

6. **Choose HubSpot**
   - Click on "HubSpot" (you should see the orange logo)
   - It should show as "Connected"

![Choose HubSpot](/img/hubspot-integration/select-hubspot.png)

<br/>

7. **Click "Continue"**
   - This takes you to the HubSpot agent interface

![Continue Button](/img/hubspot-integration/continue-click.png)

<br/>

### Using the HubSpot Agent

8. **Select your records** (optional but helpful)
   - Click "Select Records" to choose specific contacts, deals, or companies
   - This helps the AI focus on the right data

![Select Records](/img/hubspot-integration/select-resource-btn.png)

<br/>

9. **Choose relevant records**
   - Click on contacts, deals, or companies relevant to your document
   - Selected items will be highlighted
   - Click "Save" to confirm your record selection

![Choose Records](/img/hubspot-integration/select-records.png)

<br/>

11. **Give instructions to the AI**
    - Type what kind of document you want in plain English
    - Be specific about what you want to create
    - Sit back and watch the magic happen!
    - Generation typically takes 30 seconds to 2 minutes

![AI Instructions](/img/hubspot-integration/prompt-continue.png)

<br/>

**Example prompts:**
- "Create a professional proposal for the selected deal using the contact's information"
- "Generate a follow-up email summarizing our recent meeting with this contact"
- "Create a company overview report using the selected company data"
- "Draft a project kickoff document for the selected deal and contacts"

13. **Review your document**
    - Check that all the information looks correct
    - Make any necessary edits
    - Marvel at your personalized, professional document!

<br/>

:::tip Pro Document Tips
- Be specific in your instructions — "Create a proposal" vs. "Create a detailed Q3 marketing proposal for ABC Corp with pricing and timeline"
- Select the right records — more relevant data = better documents
- Don't be afraid to regenerate if the first attempt isn't perfect
- Save successful prompts for future use!
:::

<br/>

## Troubleshooting

Even the best-laid plans sometimes go awry. Here are solutions to common issues:

### "I Can't Find the Settings Gear in HubSpot"
**Solution**: 
- Look in the top right corner of your HubSpot dashboard
- It's usually next to your profile picture
- If you still can't find it, try refreshing the page or logging out and back in

### "Invalid Access Token" Error
**Solution**: 
- Double-check that you copied the entire token (it's usually quite long)
- Make sure there are no extra spaces at the beginning or end
- Verify your HubSpot private app is still active
- If all else fails, create a new private app and get a fresh token

### "Permission Denied" Error
**Solution**: 
- Check that you added all the required scopes to your HubSpot private app
- Make sure you're an admin in your HubSpot account
- Verify the private app is enabled and not deactivated

### "No Records Found" in TurboDocx
**Solution**: 
- Make sure you have actual data in your HubSpot account (contacts, deals, companies)
- Click "Refresh Fields" again in your organization settings
- Check that your HubSpot private app has the right permissions

### "The Agent Doesn't Understand My Instructions"
**Solution**: 
- Be more specific in your prompts
- Use simpler language
- Include the type of document you want (email, proposal, report, etc.)
- Try selecting more specific records

:::tip When All Else Fails
If you're still stuck, don't panic! Take a screenshot of any error messages, note exactly what step you're on, and contact your support team. We're here to help, not judge your tech skills! 🤝
:::

<br/>

## Security and Privacy

Your data security is important to us (and should be to you too!):

### How Your Data is Protected

- **Secure Authentication**: We use OAuth 2.0 (fancy industry-standard security)
- **Limited Permissions**: TurboDocx only gets permission to read your data, not change it
- **Encrypted Transmission**: All data transfers are encrypted (like sending a letter in a locked box)
- **No Data Storage**: We don't store your HubSpot data on our servers

### Best Practices

- **Keep Your Token Secret**: Don't share your access token with anyone
- **Regular Reviews**: Periodically check which integrations have access to your data
- **Deactivate Unused Apps**: If you stop using TurboDocx, deactivate the HubSpot private app
- **Monitor Activity**: Keep an eye on your HubSpot activity logs

<br/>

## Tips for Success

### Getting the Best Results

**Keep Your HubSpot Data Clean**:
- Use consistent naming conventions
- Fill in important fields (contact info, deal values, etc.)
- Keep your data up-to-date

**Write Clear Instructions**:
- Be specific about what you want
- Mention the type of document
- Include any special requirements

**Select the Right Records**:
- Choose records that are relevant to your document
- Don't select too many records at once
- Quality over quantity!

### Advanced Tips

**For Better Proposals**:
- Select the contact, deal, and company records
- Include deal value and timeline information
- Mention specific services or products

**For Better Reports**:
- Select relevant companies and contacts
- Include date ranges if applicable
- Specify the type of analysis you want

**For Better Follow-ups**:
- Select recent meeting attendees
- Include deal or project context
- Mention next steps or action items

<br/>

## What's Next?

Congratulations! You've successfully:
- ✅ Created a HubSpot private app (you're basically a developer now!)
- ✅ Connected it to TurboDocx (networking skills: unlocked!)
- ✅ Generated your first document (content creation: mastered!)

### Now You Can:
- Create personalized proposals in minutes instead of hours
- Generate follow-up emails with accurate customer data
- Build comprehensive reports using your CRM information
- Automate document creation for your entire team

### Next Steps:
1. **Train your team** on this process (share this guide!)
2. **Create document templates** for common use cases
3. **Experiment with different AI prompts** to find what works best
4. **Set up regular data cleanup** in HubSpot for better results

:::tip Final Words of Wisdom
Remember, you're not just creating documents — you're creating more time for yourself by automating repetitive tasks. Every minute saved on copy-pasting customer data is a minute you can spend on more important things (like actually talking to customers!). 🎉
:::

<br/>

## Getting Help

**If you need assistance:**
1. **Check this guide first** (you'd be surprised how often the answer is right here!)
2. **Take screenshots** of any error messages
3. **Note the exact step** where you got stuck
4. **Contact your TurboDocx support team** with the details

**Remember**: There's no such thing as a stupid question. We've all been there, and we're here to help you succeed! 💪

---

*Happy document generating! May your proposals be persuasive, your reports be comprehensive, and your follow-ups be timely! 🚀*