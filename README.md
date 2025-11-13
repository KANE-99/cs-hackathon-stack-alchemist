## Encoded Data CSLP / Field Source Mapping
### The Problem
When implementing Contentstack's Live Preview with Visual Builder capabilities, developers face a significant manual overhead. To enable the "click-to-edit" functionality that allows jumping directly from webpage elements to CMS entries, developers must:
1. Use the `addEditableTags()` function to get field-path metadata
2. Manually wrap every content field in their components
3. Attach `data-cslp` attributes with the correct path for each field
This process is time-consuming, error-prone, and doesn't scale well. On a site with multiple pages or dozens of components, a developer might spend significant time just mapping fields. Any mismatch in field paths results in broken edit buttons or incorrect entry navigation. The manual nature of this implementation creates friction in the developer experience and increases the risk of mistakes.
### The Solution Discovery
Our team recognized that the core issue wasn't the need for metadata — it was the separation between data and its metadata. We asked ourselves: "What if the data itself could carry everything it needs?"
This led us to explore an unconventional approach: **embedding metadata invisibly within the string values themselves** using zero-width Unicode characters. Instead of requiring developers to manually attach attributes to DOM elements, we could encode the CSLP path directly into the content at the data layer.
### How It Works
Encoded Data CSLP uses a binary encoding system with invisible Unicode characters (Zero Width Joiner, Zero Width Non-Joiner, Word Joiner, etc.) to append metadata to string values. After fetching content from Contentstack, pass your entry data to our `injectCslpData()` function, which encodes the field path into the text—completely invisible to users and search engines.

For example:
```
Original: "Hello World"
With Encoding: "Hello World⁠‌‍‌⁠..." (metadata invisibly appended)
```
The Live Preview SDK automatically detects this encoded metadata and enables all Visual Builder features:
- Hover highlights on editable fields
- Edit buttons for direct CMS navigation
- Field toolbars and inline editing
- Live synchronization with Visual Builder

[Click here to preview the demo of the feature.](https://drive.google.com/file/d/1qK8mO3xhH7a0viUTU_NhY_Evo8Qie5M5/view?usp=sharing)

### Implementation Comparison
**Traditional Approach:**
```javascript
// Developer must manually wrap each field
<h1 {...entry.title.$?.addEditableTags()}>
  {entry.title}
</h1>
<p {...entry.description.$?.addEditableTags()}>
  {entry.description}
</p>
// Repeated for every field across all components
```
**With Encoded Source Mapping:**
```javascript
// One function call, automatic field mapping
const entry = await stack.getEntry({
  encodeSourceMapping: true
});
// Use data normally - editing works automatically
<h1>{entry.title}</h1>
<p>{entry.description}</p>
```
### Key Advantages
**For Developers:**
- **Zero Manual Mapping** - No need to wrap fields or attach attributes
- **Instant Implementation** - One configuration flag enables everything
- **Error Elimination** - No risk of mismatched paths or missing attributes
- **Scales Effortlessly** - Works automatically across any number of pages/components
**For Content:**
- **Clean HTML Output** - No `data-cslp` attributes in the DOM
- **SEO Friendly** - Search engines see pure, natural text
- **Framework Agnostic** - Works with React, Vue, Next.js, or any rendering approach
- **Backward Compatible** - Coexists with traditional attribute-based implementation
### Technical Innovation
The SDK includes:
- Efficient encoding/decoding using binary representation
- Automatic detection of both attribute-based and encoded metadata
- MutationObserver for cleaning image URLs (prevents broken images)
- Comprehensive Visual Builder integration with hover, click, and edit features
### Impact
This enhancement transforms Live Edit Tags from a **multi-step, manual process** into a **plug-and-play experience**. What previously took developers minutes of careful field mapping per component now happens automatically in seconds. The result is faster development, fewer errors, and the same powerful Visual Builder capabilities — with zero setup friction.