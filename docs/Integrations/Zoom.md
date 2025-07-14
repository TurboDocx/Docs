---
title: Zoom Integration
sidebar_position: 4
description: Automatically convert Zoom meeting transcripts into professional documents, presentations, and reports. Perfect for post-meeting summaries, action items, and client deliverables.
keywords: 
  - zoom meeting documents
  - zoom call transcripts
  - zoom to powerpoint
  - zoom to google slides
  - zoom meeting notes
  - zoom presentation maker
  - zoom meeting summary
  - zoom transcript to document
  - meeting follow-up documents
  - zoom recording to presentation
  - automated meeting documentation
  - zoom integration document generation
  - zoom ai presentation generation
  - zoom ai powerpoint generation
  - zoom to proposal
  - zoom to contract
  - zoom to quote
  - zoom meeting proposals
  - zoom call documentation
  - zoom transcript automation
  - meeting to document automation
---

# Turn Your Zoom Meetings into Professional Documents & Presentations

Transform your meeting recordings into professional documents automatically. TurboDocx's integration eliminates manual note-taking by converting meeting transcripts into polished deliverables, streamlining your post-meeting workflow.

## What You Can Create

- **📄 Meeting Summaries**: Convert discussions into formatted meeting minutes and action items
- **📊 Client Presentations**: Turn discovery calls into compelling presentation decks
- **📋 Project Proposals**: Use requirement gathering sessions to create detailed proposals
- **📝 Follow-up Reports**: Generate comprehensive meeting reports with key takeaways
- **💼 Sales Materials**: Transform prospect calls into customized sales presentations
- **🔄 Automated Workflows**: Connect meeting transcripts directly to your document templates

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

<br/>

2. Click **"Sign In"** in the top right corner

![Zoom Marketplace Sign In](/img/zoom_integration/step1.png)

<br/>

3. Sign in with your Zoom account credentials
<br/>

5. You'll be taken to [https://marketplace.zoom.us/user/build](https://marketplace.zoom.us/user/build)

<br/>

### Create a New App

1. In the top right corner, click the dropdown that says **"Develop"**

2. Select **"Build App"** from the dropdown

![Step 2: Build App selection](/img/zoom_integration/step2.png)

<br/>

3. In the dialog that appears, select **"General App"**

![Step 3: General App selection](/img/zoom_integration/step3.png)

<br/>

4. Click **"Create"**
5. **Rename your app to "TurboDocx"**

![Step 4: Rename app to TurboDocx](/img/zoom_integration/Step4RenameTurboDocx.png)

<br/>

:::info Why General App?
We use a "General App" because it provides the specific permissions needed to access your cloud recordings safely and securely.
:::

<br/>

### Configure Basic Information

After creating your app, you'll be taken to the app configuration page. Let's set up the basic information first.

<br/>

#### Basic Information Tab

1. Make sure you're on the **"Basic Information"** tab
2. **Leave app as User Managed** - Ensure the app type remains set as "User Managed"

![Basic Information User Managed](/img/zoom_integration/Step5UserManaged.png)

<br/>

3. Scroll down to **"App Credentials"** section
4. **Note down the Client ID and Client Secret** - You'll need these values when configuring TurboDocx

![App Credentials Section](/img/zoom_integration/Step6ClientIdAndSecret.png)

:::tip Keep Your Credentials Safe
Your Client Secret is like a password - never share it publicly or include it in emails. TurboDocx will store it securely once you enter it.
:::

<br/>

#### OAuth Information

1. Still on the Basic Information tab, scroll down to **"OAuth Information"**
2. For **"Redirect URL for OAuth"**, enter:
```
https://api.turbodocx.com/oauth/zoom/callback
```
3. Under **"OAuth Allow List"**, add the following URLs (click "Add" for each one):

```
https://app.turbodocx.com
```

![OAuth Allow List Configuration](/img/zoom_integration/oauth_allowlist.png)

<br/>

### Configure Scopes

Now we need to set up the permissions (scopes) that allow TurboDocx to access your cloud recordings.

<br/>

#### Scopes Tab

1. In the left bar, click on the **"Scopes"** button and navigate to the add scopes page

![Navigate to Scopes Section](/img/zoom_integration/NavigateToScopesSection.png)
<br/>

2. Click **"Add Scopes"** button

![Click Add Scopes Button](/img/zoom_integration/clickaddscopesbutton.png)

<br/>

3. In the search dialog that appears, search for:
```
List all cloud recordings for a user
```
Or look for the scope with this value:
```
cloud_recording:read:list_user_recordings
```

![Type List Cloud Recordings For User](/img/zoom_integration/TypeListCloudRecordingsForUser.png)

<br/>

4. **Add the scope** labeled "View your recordings" (with value `cloud_recording:read:list_user_recordings`)

![Select Scope and Press Done](/img/zoom_integration/SelectScopeandPressDone.png)

<br/>

5. Click **"Done"** to save the configuration

<br/>

![App Credentials Configuration Complete](/img/zoom_integration/app_credentials.png)

<br/>


## Step 2: Configuring TurboDocx

### 🔧 How to Configure Zoom in Organization Settings

1. Go to **Settings**

![Go to Settings](/img/zoom_integration/GoToSettings.png)

<br/>

2. Click on **Organization Settings**

![Go to Organization Settings](/img/zoom_integration/GoToOrganizationSettings.png)

<br/>

3. Scroll down to the **Zoom** section
4. Click **Configure Zoom**

![Click Configure Zoom](/img/zoom_integration/ClickConfigureZoom.png)

<br/>

5. A Zoom Configuration pop-up will appear
6. Take the **Client ID** and **Client Secret** you obtained earlier, paste them into the appropriate fields, and click **Save Configuration** in the bottom right-hand corner

![Enter Client ID Secret and Press Save Configuration](/img/zoom_integration/enterclientidsecretandpresssaveconfiguration.png)

<br/>

### Alternative: Inline Configuration

Alternatively, you can configure Zoom integration directly when you first access transcript providers. When you navigate to the transcript providers section and select Zoom, you'll be prompted to enter your credentials if the integration hasn't been configured yet. Simply enter your Client ID and Client Secret in the configuration dialog that appears and save your settings.

<br/>

## Step 3: Using Your Zoom Integration

Congratulations! Your Zoom integration is now ready to use. Here's how to access your meeting transcripts and use them in your documents.

<br/>

### Accessing Meeting Transcripts

1. Click the source dropdown and click **"Change Source"**

<img src="/img/zoom_integration/ChangeResource.png" alt="Change Resource" style={{width: '50%', display: 'block', margin: '0 auto'}} />

<br/>

2. Go to the **App Library** tab
3. Click **"Transcript Providers"** 

![Meeting Providers](/img/zoom_integration/MeetingProviders.png)

<br/>

4. Click **"Zoom"** and then you should be able to click the transcript
5. You'll see a list of your recent cloud recordings with transcripts

![Transcripts Shown](/img/zoom_integration/TranscriptsShown.png)

<br/>

## Troubleshooting

If you're having trouble with your Zoom integration, here are some common issues and their solutions.

<br/>

### "No Meetings Found"
- **Cause**: No cloud recordings with transcripts available
- **Solution**: Ensure your meetings are recorded to the cloud and have transcription enabled

### "Authentication Failed"
- **Cause**: Incorrect credentials or expired authentication
- **Solution**: 
  - Double-check your Client ID and Client Secret
  - Try re-authenticating by clicking "Authenticate with Zoom" again


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

Your data security and privacy are important to us. Here's how your information is protected when using the Zoom integration.

<br/>

### How Your Data is Protected

- **Secure Authentication**: TurboDocx uses OAuth 2.0, the industry standard for secure API access
- **Limited Permissions**: The integration only requests access to read your cloud recordings
- **Encrypted Transmission**: All data transfers are encrypted using industry-standard protocols

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