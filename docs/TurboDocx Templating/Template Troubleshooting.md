---
title: Template Troubleshooting
sidebar_position: 4
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

✅ **Correct:** `{CustomerName}`, `{ProjectDate}`, `{ScopeSection}`

❌ **Incorrect:** `{Customer Name}`, `{Project Date}`, `{Scope Section}`

<br />

### 2. Variables Must Be On Their Own Line

**Critical Rule:** When inserting sections, images, or rich text, the variable needs to be on its own line. Don't squeeze it into a sentence.

#### Example: Rich Text/Section Variables

**❌ Incorrect - Variable mixed with other text:**
```
Proposal Section: {ProposalSection}, If you have any questions about the proposal...
```

**✅ Correct - Variable on its own line:**
```
Proposal Section:

{ProposalSection}

If you have any questions about the proposal...
```

#### Example: Image Variables

**❌ Incorrect - Variable mixed with other text:**
```
Photo: {HeadshotImage}, Nicolas Fry, CEO
```

**✅ Correct - Variable on its own line:**
```
Photo:

{HeadshotImage}

Nicolas Fry, CEO
```

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

## Quick Troubleshooting Checklist

When your variables aren't working, check these items in order:

1. **Variable naming:** No spaces inside {brackets} - use `{CustomerName}` not `{Customer Name}`

2. **Line placement:** Variables for images, rich text, or sections must be on their own line

3. **Paragraph markers:** Turn on ¶ symbols to see hidden formatting issues

4. **For slide decks:** Use invisible rectangle shapes, not text boxes

5. **Test first:** Create a simple deliverable to test your template before finalizing

<br />

## Still Having Issues?

If you're still experiencing problems after following these steps:

1. **Double-check variable naming** - ensure no spaces, one word only
2. **Verify line placement** - use paragraph markers to confirm variables are isolated
3. **For slides** - ensure you're using invisible shapes, not text boxes
4. **Test incrementally** - start with simple text variables, then add complex ones

<br />

:::tip Pro Tips

- **Test your template** by creating a deliverable before finalizing
- **Keep variable names descriptive** but concise
- **Use consistent formatting** across all your templates
- **Check paragraph markers** whenever variables aren't appearing
- **For slide decks**, always use invisible shapes rather than text boxes

:::

If you need additional help, don't hesitate to reach out to our support team or check out our full documentation at [docs.turbodocx.com](https://docs.turbodocx.com).

<br />