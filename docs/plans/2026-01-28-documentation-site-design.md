# Documentation Site Design

**Date:** 2026-01-28
**Status:** Approved

## Overview

Create a comprehensive documentation site for jstatico, built with jstatico itself (dogfooding). Deploy automatically to GitHub Pages on push to master.

## Key Decisions

| Decision | Choice |
|----------|--------|
| Audience | All: evaluators, users, contributors |
| Scope | Full docs (~25 pages) |
| Build tool | jstatico itself |
| Design | Minimal and clean |
| Interactivity | Static only (no JS) |
| Deployment | GitHub Actions → GitHub Pages |
| Pages source | Artifact-based deployment |

## Project Structure

```
docs-src/
├── index.md                    # Homepage/landing
├── _layouts/
│   ├── _base.html              # Base template (head, body structure)
│   ├── _doc.html               # Doc page layout (extends base, adds nav)
│   └── _home.html              # Homepage layout (extends base)
├── _site/
│   └── _navigation.json        # Site navigation structure
├── css/
│   └── style.css               # Single stylesheet, minimal CSS
├── getting-started/
│   ├── index.md                # Installation & requirements
│   ├── quick-start.md          # 5-minute first site
│   └── tutorial.md             # Full tutorial building a blog
├── concepts/
│   ├── index.md                # Overview of core concepts
│   ├── pipeline.md             # Three-phase pipeline explained
│   ├── tree-structure.md       # How the tree works
│   ├── frontmatter.md          # YAML frontmatter options
│   └── naming-conventions.md   # Special files and directories
├── guides/
│   ├── index.md
│   ├── layouts-templates.md    # Nunjucks templating
│   ├── working-with-data.md    # JSON data files
│   ├── building-a-blog.md      # Blog with pagination
│   └── clean-urls.md           # URL structure options
├── processors/
│   ├── index.md                # Processor overview
│   ├── built-in.md             # Markdown, JSON, HTML processors
│   ├── custom-processors.md    # Writing your own
│   ├── auto-discovery.md       # _processors/ directory
│   └── builder-api.md          # Programmatic API
├── api/
│   ├── index.md                # API overview
│   ├── cli.md                  # CLI reference
│   └── programmatic.md         # Node/Bun API
├── examples/
│   ├── index.md                # Examples overview
│   └── recipes.md              # Common patterns
└── contributing/
    ├── index.md                # How to contribute
    └── architecture.md         # Deep-dive for contributors
```

## Layout Templates

### `_layouts/_base.html`
- HTML5 doctype, meta viewport, charset
- `<title>` from page frontmatter with site suffix
- Single CSS link to `/css/style.css`
- No JavaScript - pure HTML/CSS
- Block for `content` that child templates fill

### `_layouts/_doc.html`
- Extends `_base.html`
- Two-column layout: sidebar navigation + main content
- Sidebar renders from `_navigation.json` data file
- Current page highlighted in nav
- Previous/next page links at bottom

### `_layouts/_home.html`
- Extends `_base.html`
- Single-column centered layout
- Hero section with tagline and quick install command
- Feature highlights (3-4 bullet points)
- Link to Getting Started

### `_site/_navigation.json`

```json
{
  "sections": [
    {
      "title": "Getting Started",
      "path": "/getting-started/",
      "pages": [
        { "title": "Installation", "path": "/getting-started/" },
        { "title": "Quick Start", "path": "/getting-started/quick-start/" },
        { "title": "Tutorial", "path": "/getting-started/tutorial/" }
      ]
    },
    {
      "title": "Core Concepts",
      "path": "/concepts/",
      "pages": [
        { "title": "Overview", "path": "/concepts/" },
        { "title": "Pipeline", "path": "/concepts/pipeline/" },
        { "title": "Tree Structure", "path": "/concepts/tree-structure/" },
        { "title": "Frontmatter", "path": "/concepts/frontmatter/" },
        { "title": "Naming Conventions", "path": "/concepts/naming-conventions/" }
      ]
    },
    {
      "title": "Guides",
      "path": "/guides/",
      "pages": [
        { "title": "Overview", "path": "/guides/" },
        { "title": "Layouts & Templates", "path": "/guides/layouts-templates/" },
        { "title": "Working with Data", "path": "/guides/working-with-data/" },
        { "title": "Building a Blog", "path": "/guides/building-a-blog/" },
        { "title": "Clean URLs", "path": "/guides/clean-urls/" }
      ]
    },
    {
      "title": "Processors",
      "path": "/processors/",
      "pages": [
        { "title": "Overview", "path": "/processors/" },
        { "title": "Built-in Processors", "path": "/processors/built-in/" },
        { "title": "Custom Processors", "path": "/processors/custom-processors/" },
        { "title": "Auto-Discovery", "path": "/processors/auto-discovery/" },
        { "title": "Builder API", "path": "/processors/builder-api/" }
      ]
    },
    {
      "title": "API Reference",
      "path": "/api/",
      "pages": [
        { "title": "Overview", "path": "/api/" },
        { "title": "CLI", "path": "/api/cli/" },
        { "title": "Programmatic API", "path": "/api/programmatic/" }
      ]
    },
    {
      "title": "Examples",
      "path": "/examples/",
      "pages": [
        { "title": "Overview", "path": "/examples/" },
        { "title": "Recipes", "path": "/examples/recipes/" }
      ]
    },
    {
      "title": "Contributing",
      "path": "/contributing/",
      "pages": [
        { "title": "How to Contribute", "path": "/contributing/" },
        { "title": "Architecture", "path": "/contributing/architecture/" }
      ]
    }
  ]
}
```

## CSS & Visual Design

### Design Principles
- System font stack (no web font loading)
- Comfortable reading width (~70ch for content)
- High contrast, accessible colors
- Responsive without media query complexity

### CSS Variables

```css
:root {
  --text: #1a1a1a;
  --text-muted: #666;
  --bg: #fff;
  --bg-code: #f5f5f5;
  --border: #e0e0e0;
  --accent: #0066cc;
  --content-width: 70ch;
  --sidebar-width: 240px;
}
```

### Layout
- CSS Grid for two-column doc layout
- Sidebar fixed on left, content scrolls
- On narrow screens, sidebar collapses to top nav (CSS only)

### Code Blocks
- Syntax highlighting via highlight.js (already in jstatico)
- Subtle background, readable monospace font
- Horizontal scroll for long lines

### Typography
- `h1` for page title only
- `h2`, `h3` for sections
- Links underlined, accent color on hover
- ~200-300 lines of CSS total

## GitHub Actions Workflow

`.github/workflows/docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install

      - run: bun run src/cli.ts docs-src docs-build

      - uses: actions/configure-pages@v4

      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs-build

      - uses: actions/deploy-pages@v4
        id: deployment
```

### Repository Settings Required
- Settings → Pages → Source: "GitHub Actions"

## Package.json Scripts

```json
{
  "scripts": {
    "docs:build": "bun run src/cli.ts docs-src docs-build",
    "docs:dev": "bun run src/cli.ts docs-src docs-build && npx serve docs-build"
  }
}
```

## Content Strategy

### Page Structure

```yaml
---
layout: _layouts._doc.html
title: Page Title
description: Brief description for meta tags
---

Brief intro paragraph explaining what this page covers.

## First Major Section

Content with examples...
```

### Writing Guidelines
- Active voice, second person ("you can create...")
- Short paragraphs (3-4 sentences max)
- Code examples for every concept
- Real, working examples (not pseudo-code)

### Content by Section

| Section | Focus |
|---------|-------|
| Getting Started | Get users running fast |
| Concepts | Mental model of how jstatico works |
| Guides | Task-oriented walkthroughs |
| Processors | Extension point documentation |
| API Reference | Complete CLI and programmatic API |
| Examples | Copy-paste solutions and recipes |
| Contributing | Onboard new contributors |

## Repository Documentation Updates

### README.md
- Add "Documentation" section with GitHub Pages URL
- Update project description
- Remove note about "creating a documentation site"
- Keep README focused; point to full docs for details

### CLAUDE.md
- Add `docs-src/` to architecture overview
- Document `docs:build` and `docs:dev` scripts
- Note that `docs-src/` is a real jstatico site
- Add GitHub Actions workflow to build commands

## Implementation Order

1. Templates (`_base.html`, `_doc.html`, `_home.html`)
2. CSS (`style.css`)
3. Homepage (`index.md`)
4. Getting Started section
5. Concepts & Guides sections
6. Processors & API sections
7. Examples & Contributing sections
8. GitHub Actions workflow
9. README.md and CLAUDE.md updates

## Future Enhancements (Not for v1)

- Search (Pagefind or similar)
- Dark mode toggle
- Version selector
