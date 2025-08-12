---
title: Brand Identity
sidebar_position: 14
description: Configure your organization's brand identity including colors, typography, and styling for consistent document generation.
keywords: [brand identity, colors, typography, fonts, logo, styling, templates, organization branding]
---

# Brand Identity

TurboDocx's Brand Identity feature allows you to configure organization-wide branding settings that apply consistently across all your document templates. Unlike template-specific font embedding, Brand Identity creates tenant-wide standards for colors, typography, and styling that ensure brand consistency across all generated documents.

## Overview

Brand Identity configuration includes:
- **Logo Upload**: Upload your organization's logo for automatic color extraction
- **Brand Colors**: Use extracted colors or customize manually
- **Typography**: Configure heading and body text sizes and colors
- **Table Styling**: Customize table backgrounds, headers, and borders
- **Real-time Preview**: See changes instantly as you configure

:::info Key Difference
**Brand Identity** sets organization-wide styling standards, while **[Working with Fonts](./Working%20with%20Fonts.md)** covers embedding specific desktop fonts in individual templates.
:::

## Getting Started

### Accessing Brand Identity Settings

1. Navigate to your organization settings
2. Select **Formatting Settings** from the configuration menu
3. You'll see the Brand Identity configuration interface with three main areas:
   - Logo upload section (top)
   - Configuration controls (left side)
   - Live preview panel (right side)

### Logo Upload & Save

![Logo Upload Interface](/img/brandidentity/LogoUpload.png)

1. **Upload Your Logo**
   - Click the **Upload Logo** button at the top of the page
   - Select your logo file (recommended formats: PNG, JPG)
   - Optimal size: 200x200px or larger for best results

2. **Save Changes**
   - After uploading, click **Save Changes** to apply the logo
   - TurboDocx will automatically analyze your logo to extract brand colors
   - The extraction process may take a few moments

:::tip Logo Tips
- Use high-resolution logos for better color extraction
- PNG files with transparent backgrounds work best
- Square or horizontal logos typically work better than vertical ones
:::

## Brand Colors

![Brand Colors and Preview Panel](/img/brandidentity/BrandColorsandPreview.png)

### Automatic Color Extraction

Once you upload your logo, TurboDocx automatically extracts your brand's primary colors:

- **Primary Color**: The dominant color from your logo
- **Secondary Color**: The most prominent accent color
- **Additional Colors**: Supporting colors found in your logo

The extracted colors appear in the **Brand Colors** section on the left-hand side of the interface.

### Manual Color Override


You can customize any extracted color:

1. **Override Extracted Colors**
   - Click on any color swatch in the Brand Colors section
   - Use the color picker to select a new color
   - Enter specific hex codes for precise color matching
   - Colors update in real-time in the preview panel

2. **Color Guidelines**
   - Ensure sufficient contrast between text and background colors
   - Test colors across different document types in the preview

### Using the Preview Panel


The **Preview Panel** on the right-hand side shows:
- **Real-time Updates**: Changes appear instantly as you modify colors
- **Document Samples**: See how colors look in actual document layouts
- **Different Elements**: Preview headings, body text, tables, and other components

## Typography & Font Configuration

### Quick Setup Options

For rapid configuration, use the **Quick Setup** presets:

1. **Preset Sizes** for Headings 1–3:
   - **Small**: Conservative sizing for formal documents
   - **Normal**: Balanced sizing for most use cases
   - **Large**: Bold sizing for impactful presentations

2. **Apply Presets**:
   - Select your preferred preset
   - Changes apply immediately to H1, H2, and H3 headings
   - You can still make granular adjustments afterward

### Granular Typography Adjustments

For precise control, expand the typography accordions:

#### Headings (H1, H2, H3)

![Heading Configuration Controls](/img/brandidentity/HeadingConfig.png)

**For each heading level, configure:**
- **Font Size**: Adjust size in points or pixels
- **Font Color**: Choose from brand colors or custom colors

**Best Practices:**
- Maintain clear hierarchy: H1 > H2 > H3 in size
- Use consistent color schemes across heading levels
- Ensure sufficient contrast for accessibility

#### Body Text Configuration

**Configure body text settings:**
- **Font Size**: Optimal reading size (typically 11-12pt for documents)
- **Font Color**: Usually darker colors for readability

## Table Styling Configuration

![Table Styling Configuration](/img/brandidentity/TableSetup.png)

Customize how tables appear in your documents:

### Table Background Colors

- **Main Table Background**: Overall table background color
- **Alternating Rows**: Optional striped pattern for better readability
- **Color Intensity**: Adjust opacity for subtle backgrounds

### Header & Subheader Styling

**Table Headers:**
- **Header Background Color**: Primary header row styling
- **Header Text Color**: Ensure contrast with background
- **Subheader Background Color**: Secondary header styling for complex tables

**Styling Tips:**
- Use brand colors for headers to maintain consistency
- Ensure text remains readable on colored backgrounds
- Consider print-friendly colors for documents that may be printed

### Border & Text Styling

**Border Configuration:**
- **Table Border Color**: Outline color for the entire table
- **Cell Border Color**: Internal grid line colors
- **Border Width**: Thin, medium, or thick border options

**Text Colors (Optional):**
- **Data Text Color**: Color for table cell content
- **Override Body Text**: Use different colors in tables vs. regular text
- **Emphasis Colors**: Highlight important data points

### Table Preview

The preview panel shows your table styling applied to sample data, allowing you to:
- Verify color combinations work well together
- Check readability across different cell types
- Ensure consistent branding appearance

## Advanced Configuration Tips

### Color Consistency

- **Use Brand Color Palette**: Stick to extracted or manually set brand colors
- **Create Color Hierarchy**: Primary colors for headers, secondary for accents

### Typography Hierarchy

- **Establish Clear Levels**: Make H1-H3 distinctly different sizes
- **Maintain Proportions**: Use mathematical ratios (1.25x, 1.5x, 2x) between levels
- **Consider Context**: Adjust sizes based on document types (reports vs. presentations)

### Template Integration

Your Brand Identity settings automatically apply to:
- **New Templates**: All newly created templates inherit brand settings
- **Existing Templates**: Update existing templates to use brand settings
- **Generated Documents**: All output maintains brand consistency

## Troubleshooting

### Common Issues

**Logo Upload Problems:**
- **File Size**: Ensure logo files are under 5MB
- **Format Support**: Use PNG or JPG formats. 
- **Resolution**: Higher resolution images provide better color extraction

**Color Extraction Issues:**
- **Low Contrast Logos**: May not extract distinct colors - use manual override
- **Monochrome Logos**: Will extract limited color palette - add colors manually
- **Complex Logos**: May extract too many colors - simplify by manual selection

**Preview Discrepancies:**
- **Browser Caching**: Refresh the page if changes don't appear
- **Color Profile**: Ensure your monitor displays colors accurately
- **Print vs. Screen**: Colors may appear differently in printed documents

### Template Application Issues

**Brand Settings Not Applying:**
- Verify templates are set to use organization brand settings
- Check template-specific overrides that may conflict
- Ensure templates are saved after brand updates

**Font Conflicts:**
- TurboDocx by default uses the font found in the template
- For custom fonts, use [Working with Fonts](./Working%20with%20Fonts.md) embedding

## Getting Help

If you encounter issues with Brand Identity configuration:

1. **Check Template Compatibility**: Ensure templates support brand identity features
2. **Verify Permissions**: Confirm you have organization admin privileges
3. **Test with Sample Documents**: Generate test documents to verify settings
4. **Contact Support**: Provide specific details about configuration issues and document types

For technical font embedding questions, refer to [Working with Fonts](./Working%20with%20Fonts.md).

:::info Next Steps
After configuring your Brand Identity, create new templates or update existing ones to see your branding applied consistently across all generated documents.
:::