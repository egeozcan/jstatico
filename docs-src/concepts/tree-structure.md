---
layout: _layouts._doc.html
title: Tree Structure
description: How files become a navigable tree
currentPath: /concepts/tree-structure/
---

Your source directory becomes a tree that templates can navigate.

## How It Works

Given this structure:

```
src/
├── index.md
├── about.md
├── _site/
│   └── _config.json
└── blog/
    ├── post-1.md
    └── post-2.md
```

jstatico creates this tree:

```javascript
{
  "index": { /* FileResult */ },
  "about": { /* FileResult */ },
  "_site": {
    "config": { /* data from JSON */ }
  },
  "blog": {
    "post-1": { /* FileResult */ },
    "post-2": { /* FileResult */ }
  }
}
```

## Accessing the Tree

In templates, you can access any part of the tree:

```html
<!-- Access site-wide data -->
{{ _site.config.siteName }}

<!-- Access sibling pages -->
{% for key, page in blog %}
  <a href="/blog/{{ key }}/">{{ page.meta.title }}</a>
{% endfor %}
```

## FileResult Properties

Each file in the tree has:

| Property | Description |
|----------|-------------|
| `body` | Rendered content |
| `meta` | Frontmatter data |
| `path` | File path |
| `extension` | File extension |
