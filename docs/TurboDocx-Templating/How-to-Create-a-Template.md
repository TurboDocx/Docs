---
title: How to Create a Template
sidebar_position: 10
description: Create your first TurboDocx template with {variable} placeholders from Word, PowerPoint or Google Docs, or upload a PDF to collect signatures.
keywords:
  - create template
  - template upload
  - variable placeholders
  - turbodocx template
  - document automation
  - word template
---


Congratulations on starting your first template. In this guide, we will show you how to create your first template and how to upload it to your TurboDocx account.

## Video Tutorial

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
  <iframe 
    src="https://www.youtube.com/embed/IVzmBtHGunQ?si=8u94sDfO5zEFOxUE" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
  ></iframe>
</div>

## Step 1: Create New Template

Let's start with creating our first template. <br /><br /><br/>

1. Open up whatever application you will be using to create your document (Word, Google Drive, etc).
<br/><br />
2. Anything you would like to be a variable or an item that will change from document to document will be put between these `{brackets}`. This can be single items such as `{Date}` or `{CustomerName}` or it can be whole sections such as `{Scope}` as seen in the images below.

![Word document template with bracket variables like CustomerName and Date](/img/how_to_create_a_template/CreatingATemplateDoc1Title.PNG)
![Second page of template document showing Scope section variable](/img/how_to_create_a_template/CreatingATemplateDoc2Title.PNG)

3. Once you've finished your document with the variables that you want please save it and move on to the next step.
<br /><br />

:::tip

- If you've previously created a document you want to use as a template, go ahead and use that. Just remember to replace all the variables within the `{brackets}`. Find and replace may be helpful here.

- All variables will need to be one word, so do not put any spaces in the middle of the `{brackets}`.

- Remember your Knowledgebase, if the variable has the same name as something in your Knowledgebase TurboDocx will use the info from the Knowledgebase to fill in the corresponding Variable.

- If you want to include an image or rich text, make sure the variable is on it's own line. Use the show paragraph tool if you need help. The location for that tool in Word and Google Docs are in the image below.  
![Paragraph marker tool location in Word and Google Docs toolbars](/img/how_to_create_a_template/paragraphtool.png)

:::

<br/><br/><br/>

## Step 2: Upload Template Document

Now that we've created our first template, let's upload it to TurboDocx.<br/><br/><br/>

1. Login to your TurboDocx account you should land on the Templates tab if not it can be found on the left side. Then, On the top right of your window, click on the "New Template" button.

![TurboDocx Templates tab with New Template button highlighted](/img/how_to_create_a_template/newtemp.png)

2. Click the **Upload Template** card, then choose the document you saved in the last step (or drag and drop it onto the card).

![Create Template page with the Upload Template card highlighted](/img/how_to_create_a_template/step_1.png)

<br/><br/><br/>

## Step 3: Your template is created

As soon as the upload finishes, TurboDocx creates the template, shows **Template has been created successfully!**, and a few seconds later opens it so you can generate your first document.<br/><br/>

- The variables TurboDocx found in your `{brackets}` are listed on that page as fields to fill in.
- You can add default values for your variables later, from the template's details page.

:::tip

- Tags can be very useful to help find certain templates, and Knowledgebase entries. Don't forget to utilize them! You can also always come back and add them in the future.
- If a variable is missing, go back to step one and check that it's in `{brackets}` with no spaces in the name, then upload the file again.

:::

:::note Uploading a PDF
You can also upload a **PDF**. A PDF becomes a signature-only template: it has no variables and opens on **Prepare & Sign**, where you add signers and place signature fields. See [How to Use a PDF as a Signature Template](/docs/TurboSign/PDF-Signature-Templates).
:::

<br/><br/><br/>

<!--
## PowerPoint/Slide Deck Templates

### Setting Up Variables in Slides

For slide deck templates, follow these specific steps to ensure variables work correctly:

1. **Delete existing content** from the slide where you want dynamic content

2. **Insert a shape:**
   - Go to **Insert → Shape** in the ribbon
   - Choose a rectangle
   - Draw the shape where you want the dynamic content to go

3. **Add your variable:**
   - Click inside the shape
   - Type your variable name (e.g., `{WhatWeHeard}`)
   - Remember: all one word, no spaces

4. **Align text to top:**
   - With the shape selected, go to **Shape Format → Align Text → Top**
   - This keeps everything uniform across slides

5. **Make the shape invisible:**
   - Set **Shape Fill** to "No Fill"
   - Set **Shape Outline** to "No Fill"
   - This removes the colored box, making it invisible

6. **Format the text:**
   - Change the font color to black (or your preferred color)
   - This makes it easy and clear to see in your final deck

<br />

### Example Slide Setup

For a slide with sections like:
- What we heard
- How we can help  
- Follow-up questions

Create separate invisible shapes for each section with variables like:
- `{WhatWeHeard}`
- `{HowWeCanHelp}`
- `{FollowUpQuestions}`

Each variable should be in its own invisible rectangle shape, not mixed with other text.

<br />
-->

## Finished

Congratulations on uploading your first template. It's open and ready to use, and you'll also find it in the **Templates** list.
