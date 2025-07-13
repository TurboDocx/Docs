---
title: Zoom Integration
sidebar_position: 4
---

The Zoom integration in TurboDocx allows you to automatically import meeting transcripts from your Zoom cloud recordings and use them to generate personalized documents. This powerful integration streamlines your workflow by eliminating the need to manually copy and paste meeting content, enabling you to create professional documents, summaries, and reports directly from your Zoom meetings.


## Overview

With the Zoom integration, you can:

- **Import Meeting Transcripts**: Automatically access transcripts from your Zoom cloud recordings
- **Generate Documents**: Use meeting content to populate templates and create deliverables  
- **Streamline Workflows**: Reduce manual work by directly connecting meeting data to document generation
- **Maintain Security**: All integrations use secure authentication and respect your Zoom privacy settings

<br/>

## Before You Begin

To use the Zoom integration, you'll need:

- A Zoom account with **cloud recording** enabled
- Administrative access to create a Zoom app (or assistance from your IT team)
- Meeting recordings stored in Zoom's cloud (local recordings are not accessible)

:::tip
If you're not sure whether you have cloud recording enabled, check with your Zoom administrator or look for the "Cloud" option when you start recording a meeting.
:::

<br/>

## Step 1: Creating Your Zoom App

The first step is to create a Zoom app that will allow TurboDocx to access your meeting transcripts. Don't worry - this is a one-time setup process that we'll walk you through step by step. <br/>

### Navigate to the Zoom Marketplace

1. Open your web browser and go to [https://marketplace.zoom.us](https://marketplace.zoom.us)
<br/><br/>
2. Click **"Sign In"** in the top right corner

![Zoom Marketplace Sign In](/img/zoom_integration/marketplace_signin.png)

<br/><br/>
3. Sign in with your Zoom account credentials
<br/><br/>
4. After signing in, click **"Manage"** in the top right corner

![Zoom User Dashboard Manage Button](/img/zoom_integration/user_dashboard_manage.png)

<br/><br/>
5. You'll be taken to [https://marketplace.zoom.us/user/build](https://marketplace.zoom.us/user/build)

<br/>

### Create a New App

1. In the top right corner, click the dropdown that says **"Develop"**

![Step 1: Develop dropdown](/img/zoom_integration/step_1_develop_dropdown.png)

<br/><br/>
2. Select **"Build App"** from the dropdown

![Step 2: Build App selection](/img/zoom_integration/step_2_build_app.png)

<br/><br/>
3. In the dialog that appears, select **"General App"**

![Step 3: General App selection](/img/zoom_integration/step_3_general_app.png)

<br/><br/>
4. Click **"Create"**

![Step 4: Create button](/img/zoom_integration/step_4_create_button.png)

:::info Why General App?
We use a "General App" because it provides the specific permissions needed to access your cloud recordings safely and securely.
:::

<br/>

### Configure Basic Information

After creating your app, you'll be taken to the app configuration page. Let's set up the basic information first. <br/>

#### Basic Information Tab

1. Make sure you're on the **"Basic Information"** tab
<br/><br/>
2. **Leave app as User Managed** - Ensure the app type remains set as "User Managed"

![Basic Information User Managed](/img/zoom_integration/basic_info_user_managed.png)

<br/><br/>
3. Scroll down to **"App Credentials"** section
<br/><br/>
4. **Note down the Client ID and Client Secret** - You'll need these values when configuring TurboDocx

![App Credentials Section](/img/zoom_integration/app_credentials.png)

:::tip Keep Your Credentials Safe
Your Client Secret is like a password - never share it publicly or include it in emails. TurboDocx will store it securely once you enter it.
:::

<br/>

#### OAuth Information

1. Still on the Basic Information tab, scroll down to **"OAuth Information"**
<br/><br/>
2. For **"Redirect URL for OAuth"**, enter:
```
https://api.turbodx.com/oauth/zoom/callback
```
<br/><br/>
3. Under **"OAuth Allow List"**, add the following URLs (click "Add" for each one):

```
https://app.turbodx.com
```

```
https://app.turbodx.com/templates-beta/transcripts-provider
```

![OAuth Information Configuration](/img/zoom_integration/oauth_information.png)

<br/>

### Configure Scopes

Now we need to set up the permissions (scopes) that allow TurboDocx to access your cloud recordings. <br/>

#### Scopes Tab

1. Click on the **"Scopes"** tab at the top of the page

![Scopes Tab](/img/zoom_integration/scopes_tab.png)

<br/><br/>
2. Click **"Add Scopes"** button
<br/><br/>
3. In the search dialog that appears, search for:
```
List all cloud recordings for a user
```
Or look for the scope with this value:
```
cloud_recording:read:list_user_recordings
```

![Scope Search Dialog](/img/zoom_integration/scope_search_dialog.png)

<br/><br/>
4. **Add the scope** labeled "View your recordings" (with value `cloud_recording:read:list_user_recordings`)

![Selected Scope](/img/zoom_integration/selected_scope.png)

<br/><br/>
5. Click **"Continue"** to save the configuration
<br/><br/>

<br/>

### Activate Your App

Once you've completed the basic information and scopes configuration, you need to activate your app. <br/>

1. Navigate to the **"Activation"** section or tab
<br/><br/>
2. Click **"Activate your app"**
<br/><br/>
3. Your app is now ready to use!

![App Activation Confirmation](/img/zoom_integration/app_activation.png)

<br/>

## Step 2: Configuring TurboDocx

Now that your Zoom app is created, let's connect it to TurboDocx. You can do this either through your settings or when you first try to use the integration. <br/>

### Option A: Configure in Settings (Recommended)

1. In TurboDocx, navigate to **Settings** → **Integrations**
<br/><br/>
2. Find the **Zoom** integration card
<br/><br/>
3. Click **"Configure Zoom"**

![TurboDocx Integrations Page](/img/zoom_integration/turbodocx_integrations.png)

<br/>

### Option B: Configure During First Use

1. When accessing transcript providers for the first time
<br/><br/>
2. Click **"Configure Settings"** on the Zoom integration card
<br/><br/>
3. The same configuration dialog will appear

![Transcript Providers Unconfigured](/img/zoom_integration/transcript_providers_unconfigured.png)

<br/>

### Enter Your Zoom App Credentials

1. **Client ID**: Copy and paste your Client ID from the Zoom Developer Portal
<br/><br/>
2. **Client Secret**: Copy and paste your Client Secret from the Zoom Developer Portal
<br/><br/>
3. **Verification Token** (Optional): Leave blank unless you need additional webhook security
<br/><br/>
4. Click **"Save Configuration"**

![TurboDocx Zoom Configuration](/img/zoom_integration/turbodocx_zoom_config.png)

<br/>

### Authenticate with Zoom

1. After saving your configuration, click **"Authenticate with Zoom"**
<br/><br/>
2. A popup window will open asking you to sign in to Zoom
<br/><br/>
3. Sign in with your Zoom account
<br/><br/>
4. Click **"Allow"** to grant TurboDocx permission to access your cloud recordings

![Zoom OAuth Permission Screen](/img/zoom_integration/zoom_oauth_permission.png)

<br/><br/>
5. The popup will close automatically, and you'll see a success message

![TurboDocx Success Message](/img/zoom_integration/turbodocx_success_message.png)

<br/>

## Step 3: Using Your Zoom Integration

Congratulations! Your Zoom integration is now ready to use. Here's how to access your meeting transcripts and use them in your documents. <br/>

### Accessing Meeting Transcripts

1. Navigate to the document creation area in TurboDocx
<br/><br/>
2. Select **"Transcript Providers"** 
<br/><br/>
3. Choose **"Zoom"** from the available providers
<br/><br/>
4. You'll see a list of your recent cloud recordings with transcripts

![Zoom Meeting Recordings List](/img/zoom_integration/zoom_meeting_recordings.png)

<br/>

### Selecting Meeting Content

1. Browse through your available recordings
<br/><br/>
2. Click on a meeting to view its transcript
<br/><br/>
3. Select the transcript content you want to use
<br/><br/>
4. Use the selected content to populate your document templates

![Meeting Transcript Viewer](/img/zoom_integration/transcript_viewer.png)

<br/>

## Troubleshooting

If you're having trouble with your Zoom integration, here are some common issues and their solutions. <br/>

### "No Meetings Found"
- **Cause**: No cloud recordings with transcripts available
- **Solution**: Ensure your meetings are recorded to the cloud and have transcription enabled

### "Authentication Failed"
- **Cause**: Incorrect credentials or expired authentication
- **Solution**: 
  - Double-check your Client ID and Client Secret
  - Try re-authenticating by clicking "Authenticate with Zoom" again

### "App Not Activated"
- **Cause**: Zoom app was not properly activated
- **Solution**: Return to the Zoom Developer Portal and ensure your app is activated

### "Permission Denied"
- **Cause**: Required scope not properly configured
- **Solution**: Verify that `cloud_recording:read:list_user_recordings` scope is added to your Zoom app

:::tip Getting Help
If you continue to experience issues:
- Verify all steps in this guide have been completed
- Check that your Zoom account has cloud recording enabled
- Ensure you have meeting recordings stored in Zoom's cloud
- Contact your TurboDocx support team for assistance
:::

<br/>

## Security and Privacy

Your data security and privacy are important to us. Here's how your information is protected when using the Zoom integration. <br/>

### How Your Data is Protected

- **Secure Authentication**: TurboDocx uses OAuth 2.0, the industry standard for secure API access
- **Limited Permissions**: The integration only requests access to read your cloud recordings
- **Encrypted Transmission**: All data transfers are encrypted using industry-standard protocols

<br/>

## Managing Your Integration

### Updating Configuration

To update your Zoom integration settings:
1. Go to **Settings** → **Integrations** → **Zoom**
<br/><br/>
2. Click **"Configure Zoom"**
<br/><br/>
3. Update your credentials as needed
<br/><br/>
4. Save your changes

### Removing the Integration

To disconnect Zoom from TurboDocx:
1. Go to **Settings** → **Integrations** → **Zoom**
<br/><br/>
2. Click the **"Delete"** or **"Remove"** option
<br/><br/>
3. Confirm the removal

:::tip
Removing the integration will disconnect TurboDocx from your Zoom account and require you to set up the integration again if you want to use it in the future.
:::

<br/>

## Best Practices

### For Optimal Results

- **Enable Transcription**: Always enable transcription when recording meetings to the cloud
- **Use Clear Audio**: Ensure good audio quality for more accurate transcripts
- **Descriptive Meeting Names**: Use clear, descriptive names for your meetings to easily identify them later
- **Regular Cleanup**: Periodically review and organize your cloud recordings

### Meeting Recording Tips

- Start recording at the beginning of important meetings
- Speak clearly and avoid overlapping conversations
- Use a good quality microphone when possible
- Consider recording in a quiet environment

<br/>

## Finished

Congratulations on setting up your Zoom integration! You can now seamlessly import meeting transcripts and use them to create professional documents with TurboDocx.