---
title: Working with Fonts
sidebar_position: 4
description: Learn about TurboDocx font support and how to embed custom fonts in your document templates.
keywords: [fonts, typography, embedding fonts, docx, pptx, templates]
---

# Working with Fonts

TurboDocx supports a wide variety of fonts for document generation. This guide covers the fonts available in TurboDocx, how to use them effectively, and how to embed custom fonts in your templates.

## Embedding Fonts in Templates

For documents that require specific fonts not included in TurboDocx's standard collection, you can embed fonts directly in your DOCX or PPTX templates.

### For Microsoft Word (DOCX Templates)

#### Windows
1. Open your template in Microsoft Word
2. Go to **File → Options 
![This is the image for clicking file -> options in Microsoft Word.](/img/embedding_fonts/FileOptions.png)

3. Go to the **Save** tab
4. Under "Preserve fidelity when sharing this document," check:
   - ✅ **Embed fonts in the file**
   - ✅ **Embed only the characters used in the document** (recommended for smaller file sizes)
   - ✅ **Do not embed common system fonts** (optional but recommended)

![This is the image for clicking file -> options in microsoft Word.](/img/embedding_fonts/SaveandEmbedFontsInFile.png)

5. Click **OK**
6. Save your document
7. Upload the updated template to TurboDocx

#### macOS  
1. Open your template in Microsoft Word
2. Go to **Word → Preferences → Save**
3. Under "Preserve fidelity when sharing this document," check:
   - ✅ **Embed fonts in the file**
   - ✅ **Embed only the characters used in the document** (recommended)

4. Click **OK** 
5. Save your document
6. Upload the updated template to TurboDocx

### For Microsoft PowerPoint (PPTX Templates)

#### Windows
1. Open your template in Microsoft PowerPoint
2. Go to **File → Options**
![This is the image for clicking file -> options in Microsoft PowerPoint.](/img/embedding_fonts/pptxFileOptions.png)

3. Go to the **Save** Tab
4. Under "Preserve fidelity when sharing this presentation," check:
   - ✅ **Embed fonts in the file**
   - ✅ **Embed only the characters used in the presentation**

![This is the image for clicking file -> options in Microsoft PowerPoint.](/img/embedding_fonts/pptxSaveandEmbed.png)

5. Click **OK**
6. Save your presentation
7. Upload the updated template to TurboDocx

#### macOS
1. Open your template in Microsoft PowerPoint  
2. Go to **PowerPoint → Preferences → Save**
3. Under "Preserve fidelity when sharing this presentation," check:
   - ✅ **Embed fonts in the file**
   - ✅ **Embed only the characters used in the presentation**

<!-- insert screenshot -->

4. Click **OK**
5. Save your presentation
6. Upload the updated template to TurboDocx

:::tip Pro Tip
Embedding only characters used in the document significantly reduces file size while ensuring your custom fonts display correctly.
:::

## Font Support in TurboDocx

### PDF Generation (TurboSign)

TurboDocx's PDF generator includes many common fonts for high-quality document rendering:

#### Sans-Serif Fonts
- **Poppins** - Modern geometric font, ideal for headings and contemporary designs
- **Lato** - Professional and neutral, excellent for body text and business documents  
- **Inter** - Screen-optimized font, perfect for digital documents and small text
- **Roboto** - Clean and readable, Google's system font
- **Open Sans** - Friendly and approachable, widely used in web and print

#### Serif Fonts
- **Merriweather** - Elegant and readable, designed for long-form reading
- **Roboto Slab** - Modern slab serif that pairs well with sans-serif fonts
- **Playfair Display** - Stylish display font for headers and decorative text
- **Tinos** - Times New Roman alternative, perfect for traditional documents

#### Monospace Fonts
- **Courier Prime** - Clean monospace font for code snippets and technical content

### System Fonts

TurboDocx also supports standard system fonts including:
- Arial, Helvetica (substituted with Roboto)
- Times New Roman (substituted with Tinos)
- Georgia (substituted with Merriweather)
- Calibri (substituted with Carlito)
- Cambria (substituted with Caladea)

:::info Font Substitution
TurboDocx automatically substitutes proprietary fonts with high-quality open-source alternatives to ensure consistent rendering across all platforms if font's are not embedded within your Document Template. 
:::
 
## Troubleshooting Font Issues

### Common Problems and Solutions

**Font not displaying correctly:**
1. Ensure the font is properly embedded in your template
2. Check that you've uploaded the updated template with embedded fonts
3. Verify the font name matches exactly (including spaces and capitalization)

**File size too large:**
- Enable "Embed only characters used in document" option
- Consider using TurboDocx's built-in fonts instead
- Remove unnecessary font variants (bold, italic) if not used

**Font substitution occurring:**
- Check that the font is properly embedded
- Ensure the font license allows embedding
- Verify template was saved after enabling font embedding

### Getting Help

If you encounter font-related issues:
1. Check that your template uses supported fonts
2. Verify font embedding settings are correctly configured
3. Test with TurboDocx's built-in fonts as alternatives
4. Contact support with specific details about the font and document type

:::info Microsoft Support
For detailed instructions on font embedding in Microsoft Office, refer to [Microsoft's official documentation](https://support.microsoft.com/en-us/office/benefits-of-embedding-custom-fonts-cb3982aa-ea76-4323-b008-86670f222dbc).
:::