---
layout: _layouts._doc.html
title: Core Concepts Overview
description: Understanding how jstatico works
currentPath: /concepts/
---

jstatico transforms a source directory into a static website through a simple, predictable process.

## Key Ideas

### Everything is a Tree

Your source directory becomes a tree data structure. Each file is a node with content and metadata. Templates can access any part of this tree.

### Three-Phase Pipeline

Every build follows the same steps:

1. **Preprocess** - Parse input files (Markdown → HTML, extract frontmatter)
2. **Render** - Apply templates (Nunjucks)
3. **Write** - Output to destination

### Convention Over Configuration

Special prefixes determine behavior:
- `_` prefix = not written to output (layouts, data, processors)
- `.json` in `_site/` = loaded as data
- `.processor.js` = generates pages dynamically

## Learn More

- [Pipeline](/concepts/pipeline/) - How files flow through the system
- [Tree Structure](/concepts/tree-structure/) - Accessing data in templates
- [Frontmatter](/concepts/frontmatter/) - Page metadata
- [Naming Conventions](/concepts/naming-conventions/) - Special files and directories
