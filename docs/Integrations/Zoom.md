# Zoom Integration

The Zoom integration in TurboDocx allows you to automatically import meeting transcripts from your Zoom cloud recordings and use them to generate personalized documents. This powerful integration streamlines your workflow by eliminating the need to manually copy and paste meeting content, enabling you to create professional documents, summaries, and reports directly from your Zoom meetings.

## Overview

With the Zoom integration, you can:
- **Import Meeting Transcripts**: Automatically access transcripts from your Zoom cloud recordings
- **Generate Documents**: Use meeting content to populate templates and create deliverables
- **Streamline Workflows**: Reduce manual work by directly connecting meeting data to document generation
- **Maintain Security**: All integrations use secure authentication and respect your Zoom privacy settings

## Before You Begin

To use the Zoom integration, you'll need:
- A Zoom account with **cloud recording** enabled
- Administrative access to create a Zoom app (or assistance from your IT team)
- Meeting recordings stored in Zoom's cloud (local recordings are not accessible)

:::tip
If you're not sure whether you have cloud recording enabled, check with your Zoom administrator or look for the "Cloud" option when you start recording a meeting.
:::

## Setting Up Your Zoom Integration

The setup process involves two main steps:
1. **Creating a Zoom App** (one-time setup)
2. **Configuring TurboDocx** (connecting your app to TurboDocx)

### Step 1: Creating Your Zoom App

#### Navigate to the Zoom Developer Portal

1. Open your web browser and go to [https://marketplace.zoom.us/develop/create](https://marketplace.zoom.us/develop/create)
2. Sign in with your Zoom account credentials

*[Screenshot placeholder: Zoom Developer Portal homepage]*

#### Create a New App

1. Click the **"Build App"** button
2. Select **"General App"** from the app type options
3. Click **"Create"**

*[Screenshot placeholder: App type selection showing General App highlighted]*

:::info Why General App?
We use a "General App" because it provides the specific permissions needed to access your cloud recordings safely and securely.
:::

#### Configure Your App Details

1. **App Name**: Enter a name for your app (e.g., "TurboDocx Integration")
2. **Short Description**: Add a brief description (e.g., "Integration for accessing meeting transcripts")
3. **Company Name**: Enter your company name
4. **Developer Contact Information**: Fill in your contact details

*[Screenshot placeholder: App information form]*

#### Set Up App Credentials

1. Navigate to the **"App Credentials"** section
2. You'll see your **Client ID** and **Client Secret** - keep this page open as you'll need these values shortly

*[Screenshot placeholder: App credentials page showing Client ID and masked Client Secret]*

:::warning Keep Your Credentials Safe
Your Client Secret is like a password - never share it publicly or include it in emails. TurboDocx will store it securely once you enter it.
:::

#### Configure Permissions (Scopes)

1. Go to the **"Scopes"** section
2. Click **"Add Scopes"**
3. Find and select: `cloud_recording:read:list_user_recordings`
4. Click **"Done"** to save the scope

*[Screenshot placeholder: Scopes selection showing the cloud_recording scope selected]*

#### Set Up Redirect URL

1. Navigate to the **"Redirect URL for OAuth"** section
2. Click **"Add Redirect URL"**
3. Enter: `https://app.turbodocx.com/transcript-providers/validate/zoom`
4. Click **"Save"**

*[Screenshot placeholder: Redirect URL configuration]*

:::note What's a Redirect URL?
This URL tells Zoom where to send you back after you grant permissions. It's like giving Zoom your return address.
:::

#### Activate Your App

1. Navigate to the **"Activation"** section
2. Click **"Activate your app"**
3. Your app is now ready to use!

*[Screenshot placeholder: App activation confirmation]*

### Step 2: Configuring TurboDocx

Now that your Zoom app is created, you'll connect it to TurboDocx.

#### Option A: Configure in Settings (Recommended)

1. In TurboDocx, navigate to **Settings** → **Integrations**
2. Find the **Zoom** integration card
3. Click **"Configure Zoom"**

*[Screenshot placeholder: TurboDocx integrations page showing Zoom card]*

#### Option B: Configure During First Use

1. When accessing transcript providers for the first time
2. Click **"Configure Settings"** on the Zoom integration card
3. The same configuration dialog will appear

*[Screenshot placeholder: Transcript providers page showing unconfigured Zoom integration]*

#### Enter Your Zoom App Credentials

1. **Client ID**: Copy and paste your Client ID from the Zoom Developer Portal
2. **Client Secret**: Copy and paste your Client Secret from the Zoom Developer Portal
3. **Verification Token** (Optional): Leave blank unless you need additional webhook security
4. Click **"Save Configuration"**

*[Screenshot placeholder: TurboDocx Zoom configuration dialog with fields filled]*

#### Authenticate with Zoom

1. After saving your configuration, click **"Authenticate with Zoom"**
2. A popup window will open asking you to sign in to Zoom
3. Sign in with your Zoom account
4. Click **"Allow"** to grant TurboDocx permission to access your cloud recordings
5. The popup will close automatically, and you'll see a success message

*[Screenshot placeholder: Zoom OAuth permission screen]*

*[Screenshot placeholder: TurboDocx showing successful connection message]*

## Using Your Zoom Integration

### Accessing Meeting Transcripts

1. Navigate to the document creation area in TurboDocx
2. Select **"Transcript Providers"** 
3. Choose **"Zoom"** from the available providers
4. You'll see a list of your recent cloud recordings with transcripts

*[Screenshot placeholder: List of Zoom meeting recordings in TurboDocx]*

### Selecting Meeting Content

1. Browse through your available recordings
2. Click on a meeting to view its transcript
3. Select the transcript content you want to use
4. Use the selected content to populate your document templates

*[Screenshot placeholder: Meeting transcript viewer with selection options]*

## Troubleshooting

### Common Issues and Solutions

#### "No Meetings Found"
- **Cause**: No cloud recordings with transcripts available
- **Solution**: Ensure your meetings are recorded to the cloud and have transcription enabled

#### "Authentication Failed"
- **Cause**: Incorrect credentials or expired authentication
- **Solution**: 
  1. Double-check your Client ID and Client Secret
  2. Try re-authenticating by clicking "Authenticate with Zoom" again

#### "App Not Activated"
- **Cause**: Zoom app was not properly activated
- **Solution**: Return to the Zoom Developer Portal and ensure your app is activated

#### "Permission Denied"
- **Cause**: Required scope not properly configured
- **Solution**: Verify that `cloud_recording:read:list_user_recordings` scope is added to your Zoom app

### Getting Help

If you continue to experience issues:
1. Verify all steps in this guide have been completed
2. Check that your Zoom account has cloud recording enabled
3. Ensure you have meeting recordings stored in Zoom's cloud
4. Contact your TurboDocx support team for assistance

## Security and Privacy

### How Your Data is Protected

- **Secure Authentication**: TurboDocx uses OAuth 2.0, the industry standard for secure API access
- **Limited Permissions**: The integration only requests access to read your cloud recordings
- **No Data Storage**: TurboDocx doesn't permanently store your Zoom data
- **Encrypted Transmission**: All data transfers are encrypted using industry-standard protocols

### What TurboDocx Can Access

The integration can only:
- View a list of your cloud recordings
- Read transcripts from those recordings
- Access basic meeting information (title, date, duration)

The integration **cannot**:
- Access meeting videos or audio files
- View participant information beyond what's in transcripts
- Modify or delete your Zoom data
- Access recordings from other users (unless shared with you)

## Managing Your Integration

### Updating Configuration

To update your Zoom integration settings:
1. Go to **Settings** → **Integrations** → **Zoom**
2. Click **"Configure Zoom"**
3. Update your credentials as needed
4. Save your changes

### Removing the Integration

To disconnect Zoom from TurboDocx:
1. Go to **Settings** → **Integrations** → **Zoom**
2. Click the **"Delete"** or **"Remove"** option
3. Confirm the removal

:::warning
Removing the integration will disconnect TurboDocx from your Zoom account and require you to set up the integration again if you want to use it in the future.
:::

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

By following this guide, you'll have a fully functional Zoom integration that streamlines your document creation process and helps you make the most of your meeting content.