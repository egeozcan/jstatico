---
layout: _layouts._doc.html
title: Pipeline
description: How jstatico processes files
currentPath: /concepts/pipeline/
---

jstatico processes your source directory through three phases.

## Phase 1: Preprocessing

Preprocessors transform input files before rendering.

| Processor | Input | Output |
|-----------|-------|--------|
| Markdown | `.md` files | HTML with extracted frontmatter |
| JSON | `_*.json` files | Data loaded into tree context |

During preprocessing:
- Markdown is converted to HTML using [marked](https://marked.js.org/)
- YAML frontmatter is extracted and stored in `meta`
- Code blocks get syntax highlighting via [highlight.js](https://highlightjs.org/)

## Phase 2: Rendering

After preprocessing, HTML files are rendered through Nunjucks templates.

The template receives:
- `body` - The rendered content
- `meta` - Frontmatter from the file
- `_site` - All data from `_site/*.json` files
- The entire tree for navigation

## Phase 3: Writing

Finally, files are written to the destination directory.

Writers handle:
- HTML files (optionally minified)
- CSS, JS, images (copied as-is)
- Clean URLs (`page.html` → `page/index.html`)

## Customization

Each phase can be extended with custom processors. See [Custom Processors](/jstatico/processors/custom-processors/).
