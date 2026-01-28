---
layout: _layouts._doc.html
title: Naming Conventions
description: Special files and directories in jstatico
currentPath: /concepts/naming-conventions/
---

jstatico uses naming conventions to determine how files are processed.

## Underscore Prefix: Not Written

Files and directories starting with `_` are processed but not written to output.

| Pattern | Purpose |
|---------|---------|
| `_layouts/` | Template files |
| `_site/` | Site-wide data |
| `_processors/` | Custom processors |
| `_*.html` | Partial templates |
| `_*.json` | Data files |

## Special File Types

### Data Files: `_*.json`

JSON files with underscore prefix are loaded into the tree as data:

```
_site/_navigation.json → accessible as _site.navigation
```

### Layouts: `_layouts/`

Nunjucks templates that wrap content:

```
_layouts/_main.html → layout: _layouts._main.html
```

Note: Use dots instead of slashes in frontmatter.

### Custom Processors: `_processors/`

Auto-discovered from:

```
_processors/preprocessors/*.ts
_processors/postprocessors/*.ts
_processors/writers/*.ts
```

### Page Generators: `*.processor.js`

JavaScript files that generate multiple pages dynamically.

### Bundles: `*.bundle`

Files excluded from output (for bundled assets).

## Clean URLs

With `cleanurl: true` in frontmatter:

```
about.md → about/index.html (accessed as /about/)
```
