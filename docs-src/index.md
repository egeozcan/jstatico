---
layout: "_layouts._home.html"
title: "Home"
---

## Why jstatico?

**Simple** - No complex configuration. Your directory structure is your site structure.

**Flexible** - Process any file type with custom processors. Extend with JavaScript.

**Fast** - Built on Bun. Processes only what's needed.

## Quick Example

```
my-site/
├── _layouts/
│   └── _main.html
├── _site/
│   └── _config.json
├── posts/
│   └── hello.md
└── index.md
```

Run `jstatico my-site dist` and get a fully rendered static site.

## Features

- **Markdown processing** with syntax highlighting
- **Nunjucks templates** with full inheritance
- **JSON data files** for dynamic content
- **Clean URLs** (`page.html` becomes `page/index.html`)
- **Custom processors** for any transformation
- **Builder API** for programmatic control
