---
layout: _layouts._doc.html
title: Built-in Processors
description: Processors included with jstatico
currentPath: /processors/built-in/
---

jstatico includes several processors out of the box.

## Preprocessors

### Markdown Processor

**Matches:** `*.md` files

**Features:**
- Converts Markdown to HTML using [marked](https://marked.js.org/)
- Extracts YAML frontmatter to `meta`
- Adds syntax highlighting with [highlight.js](https://highlightjs.org/)
- Supports GitHub Flavored Markdown

### JSON Processor

**Matches:** `_*.json` files

**Features:**
- Parses JSON content
- Loads data into tree context
- Files are not written to output

## Postprocessors

### HTML Processor

**Matches:** `*.html` files

**Features:**
- Renders Nunjucks templates
- Supports template inheritance
- Minifies HTML output
- Handles clean URLs

### Page Generator Processor

**Matches:** `*.processor.js` files

**Features:**
- Executes JavaScript to generate pages
- Can create multiple output files
- Useful for pagination, tag pages

### Bundle Processor

**Matches:** `*.bundle` files

**Features:**
- Marks files to skip writing
- Useful for source files included elsewhere

## Writers

### Simple File Writer

**Matches:** Common web files (`.html`, `.css`, `.js`, `.png`, `.jpg`, etc.)

**Features:**
- Writes files to destination directory
- Preserves directory structure
