---
title: Template Troubleshooting
sidebar_position: 7
---

# Template Troubleshooting

Before you throw your computer, watch this video! Your variables aren't broken, but your template might need a little bit of tender loving care. Here are the most common issues and how to fix them.

<br />

## Video Tutorial

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
  <iframe 
    src="https://www.youtube.com/embed/oTN2c3Y9X-Y?si=GdDa2PSFfFMvEQPu" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
  ></iframe>
</div>

<br />

## Common Variable Issues

### 1. Variable Naming Rules

All variables must be **one word only** - no spaces allowed inside the {brackets}.

<div style={{display: 'grid', gap: '20px', marginBottom: '32px'}}>

<div style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '20px'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
    <span style={{fontSize: '20px'}}>✅</span>
    <strong style={{color: '#16a34a', fontSize: '18px'}}>Correct - One word only</strong>
  </div>
  <div style={{backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '16px', lineHeight: '1.6'}}>
    <code style={{backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '4px', marginRight: '12px', color: '#166534'}}>{'{CustomerName}'}</code>
    <code style={{backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '4px', marginRight: '12px', color: '#166534'}}>{'{ProjectDate}'}</code>
    <code style={{backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '4px', color: '#166534'}}>{'{ScopeSection}'}</code>
  </div>
  <div style={{marginTop: '12px', fontSize: '14px', color: '#14532d', fontStyle: 'italic'}}>
    ✨ These variable names will work perfectly in your templates
  </div>
</div>

<div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '20px'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
    <span style={{fontSize: '20px'}}>❌</span>
    <strong style={{color: '#dc2626', fontSize: '18px'}}>Incorrect - Contains spaces</strong>
  </div>
  <div style={{backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '16px', lineHeight: '1.6'}}>
    <code style={{backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', marginRight: '12px', color: '#991b1b', textDecoration: 'line-through'}}>{'{Customer Name}'}</code>
    <code style={{backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', marginRight: '12px', color: '#991b1b', textDecoration: 'line-through'}}>{'{Project Date}'}</code>
    <code style={{backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', color: '#991b1b', textDecoration: 'line-through'}}>{'{Scope Section}'}</code>
  </div>
  <div style={{marginTop: '12px', fontSize: '14px', color: '#7f1d1d', fontStyle: 'italic'}}>
    ⚠️ Spaces inside brackets will prevent variables from being recognized
  </div>
</div>

</div>

:::tip Naming Best Practices
- Use **CamelCase** for multi-word variables: `{CustomerName}` instead of `{Customer Name}`
- Keep names **descriptive but concise**: `{ProjectStartDate}` instead of `{Date}`
- Be **consistent** across your templates: always use the same format
:::

<br />

### 2. Variables Must Be On Their Own Line

**Critical Rule:** When inserting sections, images, or rich text, the variable needs to be on its own line. Don't squeeze it into a sentence.

#### Examples: How to Format Variables Correctly

<div style={{display: 'grid', gap: '24px', marginBottom: '32px'}}>

<div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '20px'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
    <span style={{fontSize: '20px'}}>❌</span>
    <strong style={{color: '#dc2626', fontSize: '18px'}}>Incorrect - Variable mixed with other text</strong>
  </div>
  <div style={{backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5'}}>
    <div style={{marginBottom: '12px'}}>
      <strong>Rich Text/Section Variables:</strong><br/>
      <code style={{backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px'}}>Proposal Section: {'{ProposalSection}'}, If you have any questions about the proposal...</code>
    </div>
    <div>
      <strong>Image Variables:</strong><br/>
      <code style={{backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px'}}>Photo: {'{HeadshotImage}'}, Nicolas Fry, CEO</code>
    </div>
  </div>
  <div style={{marginTop: '12px', fontSize: '14px', color: '#7f1d1d', fontStyle: 'italic'}}>
    ⚠️ This format will prevent variables from working properly
  </div>
</div>

<div style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '20px'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
    <span style={{fontSize: '20px'}}>✅</span>
    <strong style={{color: '#16a34a', fontSize: '18px'}}>Correct - Variable on its own line</strong>
  </div>
  <div style={{backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5'}}>
    <div style={{marginBottom: '20px'}}>
      <strong>Rich Text/Section Variables:</strong><br/>
      <code style={{backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px', display: 'block', marginTop: '8px'}}>
        Proposal Section:<br/><br/>
        {'{ProposalSection}'}<br/><br/>
        If you have any questions about the proposal...
      </code>
    </div>
    <div>
      <strong>Image Variables:</strong><br/>
      <code style={{backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px', display: 'block', marginTop: '8px'}}>
        Photo:<br/><br/>
        {'{HeadshotImage}'}<br/><br/>
        Nicolas Fry, CEO
      </code>
    </div>
  </div>
  <div style={{marginTop: '12px', fontSize: '14px', color: '#14532d', fontStyle: 'italic'}}>
    ✨ This format ensures variables work correctly and content flows properly
  </div>
</div>

</div>

:::tip Key Takeaway
Notice how in the correct examples, each variable is **completely isolated** on its own line with blank lines above and below. This separation is crucial for rich text, images, and section variables to function properly.
:::

<br />

### 3. Use Paragraph Markers to Debug

One of the most common mistakes is thinking a variable is on its own line when it's not. To be sure, turn on the paragraph marker tool:

**In Microsoft Word:**
- Click the paragraph icon (¶) to reveal hidden spaces and line breaks
- It's the fastest way to catch formatting issues before they break your template

**In Google Docs:**
- Go to **View → Show non-printing characters**
- You'll get the same results as Word

![](/img/how_to_create_a_template/paragraphtool.png)

When you activate the tool, it will resemble the image below. Since {CustomerName} is plain text, it can be incorporated into a paragraph. However, we will be utilizing a chart in Rich Text for {Scope}, so it needs to be on its own line. Paragraph symbols will indicate this distinction clearly.

![](/img/additional_information/ptoolexample.png)

<br />

## Quick Troubleshooting Steps

When your variables aren't working, follow these steps in order:

### 1. Check Variable Naming
No spaces inside brackets - use `{CustomerName}` not `{Customer Name}`

### 2. Verify Line Placement  
Variables for images, rich text, or sections must be on their own line

### 3. Use Paragraph Markers
Turn on ¶ symbols to see hidden formatting issues

### 4. For Presentation Templates
Use invisible rectangle shapes, not text boxes → [See presentation setup guide](./How%20to%20Create%20a%20Presentation%20Template)

### 5. Test Your Template
Create a simple deliverable to verify everything works → [Learn how to create deliverables](./How%20to%20Create%20a%20Deliverable)
<br/>

:::tip Advanced Troubleshooting & Best Practices

**If variables still aren't working:**
- **Start simple:** Test with basic text variables first, then add complex ones
- **Double-check spacing:** Use paragraph markers to confirm variables are completely isolated
- **For presentations:** Ensure shapes are truly invisible (no fill, no outline)

**Best practices for success:**
- **Test your template** by creating a deliverable before finalizing → [See how](./How%20to%20Create%20a%20Deliverable)
- **Keep variable names descriptive** but concise
- **Use consistent formatting** across all templates → [Document templates](./How%20to%20Create%20a%20Document%20Template) | [Presentation templates](./How%20to%20Create%20a%20Presentation%20Template)

:::

## Need More Help?

Still stuck? We're here to help! Check out our comprehensive guides:

- [📄 Document Templates](./How%20to%20Create%20a%20Document%20Template) - Learn to create Word/Google Doc templates
- [📊 Presentation Templates](./How%20to%20Create%20a%20Presentation%20Template) - Learn to create PowerPoint templates  
- [🎯 Create Deliverables](./How%20to%20Create%20a%20Deliverable) - Learn to generate documents from templates
- [📚 Full Documentation](https://docs.turbodocx.com) - Complete TurboDocx documentation

If you need additional help, don't hesitate to reach out to our support team.

<br />