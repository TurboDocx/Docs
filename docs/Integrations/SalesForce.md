---
title: Salesforce Integration
sidebar_position: 2
description: Transform your Salesforce data into professional documents, proposals, and presentations with TurboDocx. Create personalized deliverables using your real CRM data — powered by AI.
keywords:
  - salesforce integration
  - crm documents
  - salesforce to document
  - salesforce proposal generator
  - salesforce report maker
  - crm document automation
  - salesforce data export
  - customer data documents
  - salesforce contact documents
  - salesforce opportunity proposals
  - automated crm reporting
  - salesforce document generation
  - crm to powerpoint
  - salesforce ai documents
  - salesforce custom fields
  - salesforce connected app
  - salesforce api integration
  - crm data visualization
  - salesforce workflow automation
  - salesforce business documents
---

# Turn Your Salesforce Data into Professional Documents & Presentations

Say goodbye to copy-pasting customer information! TurboDocx's Salesforce integration automatically pulls your real CRM data to create personalized documents, proposals, and presentations. No more "John Doe" placeholder text — use actual account names, opportunities, and details.

## What You Can Create

- **📊 Sales Proposals**: Use real opportunity data to create compelling, personalized proposals
- **📄 Account Reports**: Generate comprehensive reports with actual customer information
- **📋 Meeting Summaries**: Create professional meeting notes using your Salesforce data
- **💼 Sales Presentations**: Build custom presentations with live customer data
- **📝 Follow-up Documents**: Generate personalized follow-ups using contact details
- **🔄 Automated Reports**: Create recurring reports with fresh data from Salesforce

<br/>

## Before You Begin

:::tip For Our Technology-Shy Friends
Don't worry! We've made this guide so detailed that any team member can follow it. Think of it as cooking instructions, but for software — and just as tasty! 😄
:::

To use the Salesforce integration, you'll need:

- A Salesforce account with Connected App creation permissions (any edition works!)
- System Administrator access to create a Salesforce connected app
- About 15 minutes and a cup of coffee ☕
- This guide (which you're already reading — you're ahead of the game!)

:::tip Quick note
This process involves creating something called a "connected app" in Salesforce. Think of it as giving TurboDocx secure access to your Salesforce data — and only the data you want to share.
:::

<br/>

## Step 1: Create a Private Salesforce External Client App

This step guides you through creating a new external client app in Salesforce, which will serve as the secure bridge for your TurboDocx application.

### Log in to Salesforce

1. **Open your web browser** and go to [salesforce.com](https://salesforce.com)

   - Use Chrome, Firefox, Safari, or Edge

2. **Log into your Salesforce account**
   - Use your normal email and password with appropriate administrative privileges
   - If you forgot your password, there's a "Forgot Password?" link (we've all been there!)

![Salesforce Login Screen](/img/salesforce-integration/Login_Window.png)

<br/>

### Navigate to Setup Home

3. **Find the Setup gear** in the top right corner
   - It looks like a little wheel with teeth ⚙️
   - It's located next to your profile picture icon on the home page

![Setup Icon and Menu](/img/salesforce-integration/Setup_Icon_and_Menu.png)

<br/>

4. **Click on "Setup"**
   - Select "Setup" from the dropdown menu
   - You will be navigated to the Setup Home page

![Salesforce Setup Home Page](/img/salesforce-integration/Setup_Home_Page.png)

<br/>

### Go to App Manager

5. **Navigate through the left sidebar menu**
   - From the Setup Home page, scroll down in the left sidebar
   - Navigate to: **Platform Tools > Apps > App Manager**

![Navigation to App Manager in Sidebar](/img/salesforce-integration/Navigation_to_App_Manager.png)

<br/>

### Create a New External Client App

6. **Click "New External Client App"**
   - On the App Manager screen, look for the "New External Client App" button
   - Click this button (not "New Lightning App")

![App Manager Screen with New External Client App Button](/img/salesforce-integration/New_External_Client_App_Button.png)

<br/>

### Configure Basic Information

7. **Fill in the Basic Information section**:
   - **External Client App Name**: Type "TurboDocx Integration App" or "TurboDocx Document Generator"
   - **API Name**: This will auto-populate based on the App Name, but you can adjust if needed
   - **Contact Email**: Enter a relevant contact email address
   - **Distribution State**: Set this to "Local"

![Basic Information Section Fields](/img/salesforce-integration/Basic_Information.png)

<br/>

:::tip Pro Tip
Choose an app name you'll remember six months from now. "App123" might seem clever today, but future you will not be amused! 😏
:::

### Configure API Settings

8. **Set up OAuth Settings**
   - Proceed to the "API Settings" section
   - **Enable OAuth Settings**: Check this box
   - **Callback URL**: Enter `https://api.turbodocx.com/oauth/salesforce/callback` as the callback URL

![API Settings with OAuth Enabled](/img/salesforce-integration/OAuth_Enabled.png)

<br/>

9. **Select OAuth Scopes**
   - In the **Selected OAuth Scopes** section, select the following scopes:
     - `Access unique user identifiers (openid)`
     - `Manage user data via APIs (api)`
     - `Manage user data via Web browsers (web)`
     - `Perform requestes at any time (refresh_token, offline access)`

![OAuth Scopes Selected](/img/salesforce-integration/OAuth_Scopes_Selected.png)

<br/>

:::tip Attention to Detail Required
You'll be adding several different permissions. It's like checking off a grocery list — but necessary for the feast ahead! 🛒
:::

10. **Configure Flow Enablement**
    - In the "Flow Enablement" section under OAuth settings, make sure only the following checkbox is ticked
      - **Enable Authorization Code and Credentials Flow**

![Flow and Enablement Settings](/img/salesforce-integration/Flow_Enablement_settings.png)

<br/>

11. **Configure Security**
    - In the "Security" section under OAuth settings, make sure only the following checkbox is ticked:
      - **Issue JSON Web Token (JWT)-based access tokens for named users**

![Security Settings](/img/salesforce-integration/Security_Section.png)

<br/>

12. **Create the External Client App**
    - Click "Create" to create your external client app
    - Take a moment to admire your handiwork first!

![Save External Client App](/img/salesforce-integration/create_app.png)

<br/>

:::tip Almost Done with Step 1!
Great job! You've successfully created your Salesforce External Client App. Now we need to configure its policies and get those important credentials. ⚡
:::

<br/>

## Step 2: Configure Connected App Policies and Retrieve Credentials

After creating the app, you need to adjust its access policies and retrieve the necessary credentials for TurboDocx.

### Access App Details Page

1. **Navigate to your app's detail page**
   - You should be automatically redirected to the detail page of the app you just created as soon as you hit the create button
   - If not, navigate to External Client App Manager **(Platform Tools > Apps > External Client App > External Client App Manager)** and click on the name of your newly created app

![Connected App Detail Page](/img/salesforce-integration/Connected_app_details_page.png)

<br/>

### Edit Policies

2. **Locate the Policies section**
   - On the app's detail page, find the "Policies" section
   - Click the "Edit" button located below the policies section

![Policies Section with Edit Button](/img/salesforce-integration/policies_section.png)

<br/>

3. **Adjust OAuth Policies**
   - In the "Edit" view, locate the OAuth policies and configure the following settings:
      - **Permitted Users**: Select **"All users may self-authorize"**
      - **Named User JWT-Based Access Token Settings**: Select **30 minutes** for token timeout
      - **Refresh Token Policy**: Select **"Refresh token is valid until revoked"**
      - **IP Relaxation**: Select **"Relax IP restrictions"**

![OAuth Policies Configuration](/img/salesforce-integration/OAuth_policies.png)

<br/>

4. **Save Changes**
   - Click "Save" to apply the policy changes

![Save Button](/img/salesforce-integration/Save_policies.png)

<br/>

### Retrieve Consumer Key and Secret

5. **Find Settings section**
   - On the same app details page, Navigate to the "Settings" section
   - Here you don't need to edit anything as we have already configured it while creating the app

![Settings Section](/img/salesforce-integration/connected_app_settings_section.png)

<br/>

6. **Navigate to the OAuth Settings part under the settings section**
   - You will now see a button of **Consumer Key and Secret**
   - Click on this button

![Consumer Key and Secret Button](/img/salesforce-integration/Consumer_key_and_secret_button.png)

<br/>

6. **Complete identity verification**
   - You will be prompted to verify your identity via an OTP being sent to your registered email
   - Complete this verification step

![Identity Verification Prompt](/img/salesforce-integration/Identity_Verification_page.png)

<br/>

7. **Copy your credentials**
   - After successful verification, your Consumer Key and Consumer Secret will be displayed
   - Copy both the **Consumer Key** and **Consumer Secret** - these credentials are essential for connecting your TurboDocx application to Salesforce

![Consumer Key and Secret Display](/img/salesforce-integration/Consumer_key_and_secret_page.png)

<br/>

:::warning Handle With Care
This consumer key and secret are like temporary library cards — they let TurboDocx read only the data you've approved. But just like a password, you don't want them ending up in the wrong hands.

Keep them private, and if they ever get shared by accident, no worries — you can always generate fresh ones right here.
:::

<br/>

## Step 3: Configuring TurboDocx

Now we'll connect your shiny new Salesforce external client app to TurboDocx. This is like introducing two friends who are perfect for each other!

### Navigate to TurboDocx Settings

1. **Go to your TurboDocx dashboard**
   - Log in if you haven't already

![TurboDocx Main Dashboard](/img/salesforce-integration/Turbodocx_dashboard.png)

<br/>

2. **Click on "Settings"**
   - Look for the gear icon or "Settings" text
   - Usually in the top menu or sidebar

![Settings Menu](/img/salesforce-integration/turbodocx_settings_page.png)

<br/>

3. **Click on "Organization Settings"**
   - This might be in a dropdown or separate tab
   - If you can't find it, try looking for "Integrations" or "Connected Apps"

![Organization Settings Page](/img/salesforce-integration/Turbodocx_org_page.png)

<br/>

### Configure Salesforce Integration

4. **Find the Salesforce section**
   - Look for the Salesforce logo or "Salesforce Integration"
   - It might be in a list with other integrations

![Salesforce Integration Section](/img/salesforce-integration/Salesforce_integration_page.png)

<br/>

5. **Click "Configure Salesforce"**
   - A popup or form will appear
   - This is where the magic happens! ✨

![Configuration Butoon](/img/salesforce-integration/configure_salesforce_button.png)

![Configuration Modal](/img/salesforce-integration/configuration_modal.png)

<br/>

6. **Enter your Consumer Key and Consumer Secret**
   - Copy the Consumer Key from your Salesforce connected app page and paste it here
   - Copy the Consumer Secret from your Salesforce connected app page and paste it in the Consumer Secret field

![Key Entry Form](/img/salesforce-integration/key_and_secret_entered.png)

<br/>

7. **Click "Save Configuration"**
   - Cross your fingers (optional, but recommended!)

![Save Configuration Button](/img/salesforce-integration/Save_config_button.png)

<br/>

### Establish the OAuth Flow for salesforce

8. **Click "Connect to Salesforce"**
   - This button appears after you save your configuration
   - You'll be redirected to Salesforce to authorize the connection

![Connection Button](/img/salesforce-integration/connect_to_salesforce_button.png)

<br/>

9. **Authorize TurboDocx in Salesforce**
   - Salesforce will ask you to log in and confirm the connection
   - Enter you username and password to login

<br/>

### Sync Your Salesforce Data

10. **Click "Refresh Fields"**
    - This button appears after the connection test succeeds
    - It downloads all your custom Salesforce fields and data
    - It also tests if your connection works

![Field Refresh Button](/img/salesforce-integration/refresh_fields.png)

<br/>

11. **Wait for the field sync**
    - This can take 2-5 minutes depending on your Salesforce org size
    - Time to check your email or practice your victory dance! 💃

<br/>

:::tip Success Celebration
If you've made it this far, you deserve a pat on the back! You've successfully connected Salesforce to TurboDocx. That's no small feat — you're basically a tech wizard now! 🧙‍♂️
:::

<br/>

## Step 4: Using Your Salesforce Integration

Time to put your new integration to work! This is where the magic happens — turning your Salesforce data into beautiful documents.

### Creating Your First Document

1. **Go to document generation**
   - Look for "Create Document", "New Document", or similar
   - This is usually on your main dashboard

![Document Creation Page](/img/salesforce-integration/Create_document_button.png)

<br/>

2. **Select Template**
   - Click on the template you want to work with

![Template Selection](/img/salesforce-integration/template_selection_page.png)

<br/>

3. **Change your data source**
   - Click on the "Change Source" dropdown
   - Select "Change Resource" from the menu

![Source Change Dropdown](/img/salesforce-integration/source_change_dropdown.png)

<br/>

4. **Go to the App Library**
   - Click on the "App Library" tab
   - This shows all your connected integrations

![App Library Interface](/img/salesforce-integration/app_library_interface.png)

<br/>

5. **Select CRM category**
   - Look for "CRM" and click on it
   - This filters to show only CRM integrations

![CRM Category Selection](/img/salesforce-integration/CRM_category_selection.png)

<br/>

6. **Choose Salesforce**
   - Click on "Salesforce" (you should see the Salesforce logo)
   - It should show as "Connected"

![Salesforce Selection](/img/salesforce-integration/Salesforce_selection.png)

<br/>

7. **Click "Continue"**
   - This takes you to the Salesforce agent interface

![Continue Button](/img/salesforce-integration/salesforce_continue_button.png)

<br/>

### Using the Salesforce Agent

8. **Select your records** (optional but helpful)
   - Click "Select Records" to choose specific accounts, opportunities, contacts and many other fields
   - This helps the AI focus on the right data

![Record Selection Interface](/img/salesforce-integration/record_selection_interface.png)

<br/>

9. **Choose relevant records**
   - Click on accounts, opportunities, contacts or other fileds relevant to your document
   - Selected items will be highlighted
   - Click "Save" to confirm your record selection

![Record Selection Process](/img/salesforce-integration/record_selection_process.png)

<br/>

10. **Give instructions to the AI**
    - Type what kind of document you want in plain English
    - Be specific about what you want to create
    - Sit back and watch the magic happen!
    - Generation typically takes 30 seconds to 2 minutes

![Prompt Input Interface](/img/salesforce-integration/prompt_input_interface.png)

<br/>

**Example prompts:**

- "Create a professional proposal section for the selected opportunity using the account's information"
- "Generate a follow-up slide summarizing our recent meeting with this account"
- "Create a company overview report using the selected account data"
- "Draft a project kickoff overview for the selected opportunity and contacts"

11. **Review your document**
    - Check that all the information looks correct
    - Make any necessary edits
    - Marvel at your personalized, professional document!

<br/>

:::tip Pro Document Tips

- Be specific in your instructions — "Create a proposal" vs. "Create a detailed Q3 marketing proposal section for ABC Corp with pricing and timeline"
- Select the right records — more relevant data = better documents
- Don't be afraid to regenerate if the first attempt isn't perfect
- Save successful prompts for future use!
:::

<br/>

## Troubleshooting

Even the best-laid plans sometimes go awry. Here are solutions to common issues:

### "I Can't Find the Setup Menu in Salesforce"

**Solution**:

- Look in the top right corner of your Salesforce interface
- Click on your profile picture or the gear icon
- Select "Setup" from the dropdown menu
- If you still can't find it, you might need System Administrator permissions

### "I Can't Find 'New External Client App'"

**Solution**:

- Make sure you're in App Manager (Platform Tools > Apps > App Manager)
- Look for "New External Client App" button, not "New Lightning App"
- If you don't see this option, you might need System Administrator permissions
- Some Salesforce orgs might have different permission requirements

### "Invalid Consumer Key/Secret" Error

**Solution**:

- Double-check that you copied the entire key and secret (they're usually quite long)
- Make sure there are no extra spaces at the beginning or end
- Verify your Salesforce external client app is still active
- Complete the identity verification step when accessing "Manage Consumer Details"
- If all else fails, create a new external client app and get fresh keys

### "Permission Denied" Error

**Solution**:

- Check that you added all the required OAuth scopes to your Salesforce external client app
- Verify you selected: OpenID, API, Web, and Refresh token scopes
- Make sure you're a System Administrator in your Salesforce org
- Verify the external client app is enabled and policies are configured correctly

### "No Records Found" in TurboDocx

**Solution**:

- Make sure you have actual data in your Salesforce org (accounts, opportunities, contacts)
- Click "Refresh Fields" again in your organization settings
- Check that your Salesforce external client app has the right permissions and policies configured

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

### Best Practices

- **Keep Your Keys Secret**: Don't share your consumer key and secret with anyone
- **Regular Reviews**: Periodically check which integrations have access to your data
- **Monitor Connected Apps**: Regularly review connected apps in your Salesforce org

<br/>

## Tips for Success

### Getting the Best Results

**Keep Your Salesforce Data Clean**:

- Use consistent naming conventions
- Fill in important fields (account info, opportunity values, etc.)
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

- Select the account, opportunity, and contact records
- Include opportunity value and close date information
- Mention specific products or services

**For Better Reports**:

- Select relevant accounts and opportunities
- Include date ranges if applicable
- Specify the type of analysis you want

**For Better Follow-ups**:

- Select recent meeting attendees
- Include opportunity or project context
- Mention next steps or action items

<br/>

## What's Next?

Congratulations! You've successfully:

- ✅ Created a Salesforce external client app (you're basically a developer now!)
- ✅ Configured its policies and retrieved credentials (security expert: unlocked!)
- ✅ Connected it to TurboDocx (networking skills: mastered!)
- ✅ Generated your first document (content creation: achieved!)

### Now You Can:

- Create personalized proposals in minutes instead of hours
- Build comprehensive reports using your CRM information
- Automate document creation for your entire team

### Next Steps:

1. **Train your team** on being a prompting pro
2. **Create document and presentation templates** for common use cases
3. **Experiment with different AI prompts** to find what works best

:::tip Final Words of Wisdom
Remember, you're not just creating documents or presentations— you're creating more time for yourself by automating repetitive tasks. Every minute saved on copy-pasting customer data is a minute you can spend on more important things (like actually talking to customers!). 🎉
:::

<br/>

## Getting Help

**If you need assistance:**

1. **Check this guide first** (you'd be surprised how often the answer is right here!)
2. **Take screenshots** of any error messages
3. **Note the exact step** where you got stuck
4. **Contact your TurboDocx support team** with the details

**Remember**: There's no such thing as a bad question. We've all been there, and we're here to help you succeed! 💪

---

_Happy document generating! May your proposals be persuasive, your reports be comprehensive, and your follow-ups be timely! 🚀_
