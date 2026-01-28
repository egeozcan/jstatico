---
layout: _layouts._doc.html
title: Processors Overview
description: Extending jstatico with custom processors
currentPath: /processors/
---

Processors are the core extension mechanism in jstatico.

## Types of Processors

| Type | Phase | Purpose |
|------|-------|---------|
| Preprocessor | Input | Transform source files (parse, extract data) |
| Postprocessor | Render | Transform output (templates, minification) |
| Writer | Output | Control how files are written |

## Built-in Processors

jstatico includes processors for common tasks:

- **Markdown** - Convert `.md` to HTML
- **JSON** - Load `_*.json` as data
- **HTML** - Render Nunjucks templates
- **Page Generator** - Run `*.processor.js` files
- **Simple Writer** - Write files to disk

## Customization

Extend jstatico with your own processors:

- [Built-in Processors](/jstatico/processors/built-in/) - What's included
- [Custom Processors](/jstatico/processors/custom-processors/) - Write your own
- [Auto-Discovery](/jstatico/processors/auto-discovery/) - `_processors/` directory
- [Builder API](/jstatico/processors/builder-api/) - Programmatic configuration
