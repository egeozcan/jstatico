# Documentation Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive documentation site for jstatico using jstatico itself, with GitHub Actions deployment.

**Architecture:** The docs live in `docs-src/`, use Nunjucks templates with inheritance, data-driven navigation from JSON, and deploy via GitHub Actions to GitHub Pages.

**Tech Stack:** jstatico (Nunjucks, Markdown, highlight.js), CSS Grid, GitHub Actions

---

## Task 1: Create Base Layout Template

**Files:**
- Create: `docs-src/_layouts/_base.html`

**Step 1: Create the directories**

```bash
mkdir -p docs-src/_layouts
```

**Step 2: Create the base template**

Create `docs-src/_layouts/_base.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{% if meta.description %}{{ meta.description }}{% else %}jstatico - Simple static site generator{% endif %}">
    <title>{% if meta.title %}{{ meta.title }} - jstatico{% else %}jstatico{% endif %}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
{% block content %}{% endblock %}
</body>
</html>
```

**Step 3: Commit**

```bash
git add docs-src/_layouts/_base.html
git commit -m "feat(docs): add base layout template"
```

---

## Task 2: Create Documentation Page Layout

**Files:**
- Create: `docs-src/_layouts/_doc.html`

**Step 1: Create the doc layout extending base**

Create `docs-src/_layouts/_doc.html`:

```html
{% extends "_layouts._base.html" %}

{% block content %}
<div class="doc-layout">
    <nav class="sidebar">
        <a href="/" class="logo">jstatico</a>
        {% for section in _site.navigation.sections %}
        <div class="nav-section">
            <h3>{{ section.title }}</h3>
            <ul>
                {% for page in section.pages %}
                <li{% if page.path == meta.currentPath %} class="active"{% endif %}>
                    <a href="{{ page.path }}">{{ page.title }}</a>
                </li>
                {% endfor %}
            </ul>
        </div>
        {% endfor %}
    </nav>
    <main class="content">
        <article>
            <h1>{{ meta.title }}</h1>
            {{ body }}
        </article>
    </main>
</div>
{% endblock %}
```

**Step 2: Commit**

```bash
git add docs-src/_layouts/_doc.html
git commit -m "feat(docs): add documentation page layout with sidebar navigation"
```

---

## Task 3: Create Homepage Layout

**Files:**
- Create: `docs-src/_layouts/_home.html`

**Step 1: Create the home layout extending base**

Create `docs-src/_layouts/_home.html`:

```html
{% extends "_layouts._base.html" %}

{% block content %}
<div class="home-layout">
    <header class="hero">
        <h1>jstatico</h1>
        <p class="tagline">Simple static site generation</p>
        <pre class="install-command"><code>bun add jstatico</code></pre>
        <a href="/getting-started/" class="cta">Get Started</a>
    </header>
    <main class="features">
        {{ body }}
    </main>
    <footer class="home-footer">
        <p>MIT License &middot; <a href="https://github.com/egeozcan/jstatico">GitHub</a></p>
    </footer>
</div>
{% endblock %}
```

**Step 2: Commit**

```bash
git add docs-src/_layouts/_home.html
git commit -m "feat(docs): add homepage layout with hero section"
```

---

## Task 4: Create Navigation Data

**Files:**
- Create: `docs-src/_site/_navigation.json`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/_site
```

**Step 2: Create the navigation JSON**

Create `docs-src/_site/_navigation.json`:

```json
{
  "sections": [
    {
      "title": "Getting Started",
      "pages": [
        { "title": "Installation", "path": "/getting-started/" },
        { "title": "Quick Start", "path": "/getting-started/quick-start/" },
        { "title": "Tutorial", "path": "/getting-started/tutorial/" }
      ]
    },
    {
      "title": "Core Concepts",
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
      "pages": [
        { "title": "Overview", "path": "/api/" },
        { "title": "CLI", "path": "/api/cli/" },
        { "title": "Programmatic API", "path": "/api/programmatic/" }
      ]
    },
    {
      "title": "Examples",
      "pages": [
        { "title": "Overview", "path": "/examples/" },
        { "title": "Recipes", "path": "/examples/recipes/" }
      ]
    },
    {
      "title": "Contributing",
      "pages": [
        { "title": "How to Contribute", "path": "/contributing/" },
        { "title": "Architecture", "path": "/contributing/architecture/" }
      ]
    }
  ]
}
```

**Step 3: Commit**

```bash
git add docs-src/_site/_navigation.json
git commit -m "feat(docs): add navigation data structure"
```

---

## Task 5: Create CSS Stylesheet

**Files:**
- Create: `docs-src/css/style.css`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/css
```

**Step 2: Create the stylesheet**

Create `docs-src/css/style.css`:

```css
/* Variables */
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

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

/* Typography */
h1, h2, h3, h4 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.3;
}

h1 { font-size: 2rem; margin-top: 0; }
h2 { font-size: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
h3 { font-size: 1.25rem; }

p { margin: 0 0 1em; }

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Code */
code {
  font-family: "SF Mono", Monaco, "Cascadia Code", "Consolas", monospace;
  font-size: 0.9em;
  background: var(--bg-code);
  padding: 0.15em 0.3em;
  border-radius: 3px;
}

pre {
  background: var(--bg-code);
  padding: 1em;
  overflow-x: auto;
  border-radius: 4px;
  margin: 1em 0;
}

pre code {
  background: none;
  padding: 0;
}

/* Doc Layout */
.doc-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--bg);
  border-right: 1px solid var(--border);
  padding: 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar .logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  display: block;
  margin-bottom: 1.5rem;
}

.nav-section h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 1.5em 0 0.5em;
}

.nav-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-section li {
  margin: 0.25em 0;
}

.nav-section a {
  color: var(--text);
  display: block;
  padding: 0.25em 0;
}

.nav-section li.active a {
  color: var(--accent);
  font-weight: 500;
}

.content {
  padding: 2rem 3rem;
  max-width: calc(var(--content-width) + 6rem);
}

.content article {
  max-width: var(--content-width);
}

/* Home Layout */
.home-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, var(--bg-code) 0%, var(--bg) 100%);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 0.25em;
}

.tagline {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.install-command {
  display: inline-block;
  background: var(--text);
  color: var(--bg);
  padding: 0.75em 1.5em;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.install-command code {
  background: none;
  color: inherit;
}

.cta {
  display: inline-block;
  background: var(--accent);
  color: var(--bg);
  padding: 0.75em 2em;
  border-radius: 4px;
  font-weight: 500;
}

.cta:hover {
  text-decoration: none;
  opacity: 0.9;
}

.features {
  flex: 1;
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.home-footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

th, td {
  text-align: left;
  padding: 0.5em;
  border-bottom: 1px solid var(--border);
}

th {
  font-weight: 600;
}

/* Lists */
ul, ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

li {
  margin: 0.25em 0;
}

/* Responsive */
@media (max-width: 768px) {
  .doc-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .content {
    padding: 1.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }
}
```

**Step 3: Commit**

```bash
git add docs-src/css/style.css
git commit -m "feat(docs): add minimal CSS stylesheet"
```

---

## Task 6: Create Homepage

**Files:**
- Create: `docs-src/index.md`

**Step 1: Create the homepage**

Create `docs-src/index.md`:

```markdown
---
layout: _layouts._home.html
title: jstatico - Simple Static Site Generator
description: A lightweight static site generator built with TypeScript and Bun
---

## Why jstatico?

- **Simple** - Three-phase pipeline: preprocess, render, write
- **Fast** - Built on Bun for quick builds
- **Flexible** - Nunjucks templates, Markdown, custom processors
- **Extensible** - Add your own preprocessors, postprocessors, and writers

## Quick Example

Create a markdown file with frontmatter:

```markdown
---
layout: _layouts._main.html
title: Hello World
---

# Welcome

This is my first jstatico page.
```

Run jstatico:

```bash
bun run jstatico src dist
```

Your static site is ready in `dist/`.
```

**Step 2: Commit**

```bash
git add docs-src/index.md
git commit -m "feat(docs): add homepage content"
```

---

## Task 7: Build and Test Docs Site

**Step 1: Build the docs**

```bash
bun run src/cli.ts docs-src docs-build
```

Expected: Build completes without errors.

**Step 2: Verify output files exist**

```bash
ls -la docs-build/
ls -la docs-build/css/
```

Expected: `index.html` and `css/style.css` exist.

**Step 3: Commit build verification**

No commit needed - this was a verification step.

---

## Task 8: Create Getting Started Section

**Files:**
- Create: `docs-src/getting-started/index.md`
- Create: `docs-src/getting-started/quick-start.md`
- Create: `docs-src/getting-started/tutorial.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/getting-started
```

**Step 2: Create installation page**

Create `docs-src/getting-started/index.md`:

```markdown
---
layout: _layouts._doc.html
title: Installation
description: How to install jstatico
currentPath: /getting-started/
---

jstatico requires [Bun](https://bun.sh) as its runtime.

## Install Bun

If you don't have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Install jstatico

### As a project dependency

```bash
bun add jstatico
```

### Globally

```bash
bun add -g jstatico
```

## Verify Installation

```bash
bun run jstatico --help
```

You should see the usage information.

## Next Steps

Continue to [Quick Start](/getting-started/quick-start/) to create your first site.
```

**Step 3: Create quick start page**

Create `docs-src/getting-started/quick-start.md`:

```markdown
---
layout: _layouts._doc.html
title: Quick Start
description: Create your first jstatico site in 5 minutes
currentPath: /getting-started/quick-start/
---

Create a working static site in under 5 minutes.

## 1. Create Project Structure

```bash
mkdir my-site
cd my-site
bun init -y
bun add jstatico
```

## 2. Create Source Directory

```bash
mkdir -p src/_layouts
```

## 3. Create a Layout

Create `src/_layouts/_main.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ meta.title }}</title>
</head>
<body>
    <main>{{ body }}</main>
</body>
</html>
```

## 4. Create Your First Page

Create `src/index.md`:

```markdown
---
layout: _layouts._main.html
title: My Site
---

# Welcome

This is my first jstatico site!
```

## 5. Build

```bash
bun run jstatico src dist
```

## 6. View Result

Open `dist/index.html` in your browser. You should see your rendered page.

## Next Steps

Follow the [Tutorial](/getting-started/tutorial/) to build a complete blog.
```

**Step 4: Create tutorial page**

Create `docs-src/getting-started/tutorial.md`:

```markdown
---
layout: _layouts._doc.html
title: Tutorial
description: Build a complete blog with jstatico
currentPath: /getting-started/tutorial/
---

This tutorial walks through building a blog with jstatico.

## What You'll Build

A blog with:
- Homepage listing recent posts
- Individual post pages
- Shared layout with navigation
- Syntax-highlighted code blocks

## Project Structure

```
my-blog/
├── src/
│   ├── _layouts/
│   │   ├── _base.html
│   │   └── _post.html
│   ├── _site/
│   │   └── _config.json
│   ├── blog/
│   │   ├── 2024-01-15-hello-world.md
│   │   └── 2024-01-20-second-post.md
│   └── index.md
└── package.json
```

## Step 1: Base Layout

Create `src/_layouts/_base.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ meta.title }} - {{ _site.config.siteName }}</title>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/blog/">Blog</a>
    </nav>
    <main>
        {% block content %}{% endblock %}
    </main>
</body>
</html>
```

## Step 2: Post Layout

Create `src/_layouts/_post.html`:

```html
{% extends "_layouts._base.html" %}

{% block content %}
<article>
    <h1>{{ meta.title }}</h1>
    <time>{{ meta.date }}</time>
    {{ body }}
</article>
{% endblock %}
```

## Step 3: Site Config

Create `src/_site/_config.json`:

```json
{
    "siteName": "My Blog"
}
```

## Step 4: Blog Posts

Create `src/blog/2024-01-15-hello-world.md`:

```markdown
---
layout: _layouts._post.html
title: Hello World
date: 2024-01-15
---

Welcome to my blog! This is my first post.

## Code Example

```javascript
console.log("Hello from jstatico!");
```
```

## Step 5: Homepage

Create `src/index.md`:

```markdown
---
layout: _layouts._base.html
title: Home
---

# Welcome to My Blog

Check out my [latest posts](/blog/).
```

## Step 6: Build and Test

```bash
bun run jstatico src dist
```

Open `dist/index.html` to see your blog.

## Next Steps

- Learn about [Core Concepts](/concepts/)
- Explore [Custom Processors](/processors/custom-processors/)
```

**Step 5: Commit**

```bash
git add docs-src/getting-started/
git commit -m "feat(docs): add Getting Started section (installation, quick-start, tutorial)"
```

---

## Task 9: Create Core Concepts Section

**Files:**
- Create: `docs-src/concepts/index.md`
- Create: `docs-src/concepts/pipeline.md`
- Create: `docs-src/concepts/tree-structure.md`
- Create: `docs-src/concepts/frontmatter.md`
- Create: `docs-src/concepts/naming-conventions.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/concepts
```

**Step 2: Create concepts index**

Create `docs-src/concepts/index.md`:

```markdown
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
```

**Step 3: Create pipeline page**

Create `docs-src/concepts/pipeline.md`:

```markdown
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

Each phase can be extended with custom processors. See [Custom Processors](/processors/custom-processors/).
```

**Step 4: Create tree structure page**

Create `docs-src/concepts/tree-structure.md`:

```markdown
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
```

**Step 5: Create frontmatter page**

Create `docs-src/concepts/frontmatter.md`:

```markdown
---
layout: _layouts._doc.html
title: Frontmatter
description: Adding metadata to pages with YAML frontmatter
currentPath: /concepts/frontmatter/
---

Frontmatter is YAML at the top of a file that defines page metadata.

## Basic Syntax

```markdown
---
layout: _layouts._main.html
title: Page Title
description: Page description for SEO
---

Your content starts here.
```

## Built-in Properties

| Property | Description |
|----------|-------------|
| `layout` | Template to wrap the content |
| `title` | Page title (used in templates) |
| `description` | Meta description |
| `cleanurl` | If `true`, `page.html` → `page/index.html` |

## Custom Properties

Add any properties you need:

```yaml
---
layout: _layouts._post.html
title: My Post
date: 2024-01-15
author: Jane Doe
tags:
  - javascript
  - tutorial
---
```

Access them in templates:

```html
<time>{{ meta.date }}</time>
<span>By {{ meta.author }}</span>
{% for tag in meta.tags %}
  <span class="tag">{{ tag }}</span>
{% endfor %}
```

## Accessing in Templates

All frontmatter is available under `meta`:

```html
<title>{{ meta.title }}</title>
<meta name="description" content="{{ meta.description }}">
```
```

**Step 6: Create naming conventions page**

Create `docs-src/concepts/naming-conventions.md`:

```markdown
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
```

**Step 7: Commit**

```bash
git add docs-src/concepts/
git commit -m "feat(docs): add Core Concepts section (pipeline, tree, frontmatter, naming)"
```

---

## Task 10: Create Guides Section

**Files:**
- Create: `docs-src/guides/index.md`
- Create: `docs-src/guides/layouts-templates.md`
- Create: `docs-src/guides/working-with-data.md`
- Create: `docs-src/guides/building-a-blog.md`
- Create: `docs-src/guides/clean-urls.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/guides
```

**Step 2: Create guides index**

Create `docs-src/guides/index.md`:

```markdown
---
layout: _layouts._doc.html
title: Guides Overview
description: Task-oriented guides for common jstatico tasks
currentPath: /guides/
---

These guides walk through specific tasks with jstatico.

## Available Guides

- [Layouts & Templates](/guides/layouts-templates/) - Create reusable page layouts with Nunjucks
- [Working with Data](/guides/working-with-data/) - Use JSON files for site-wide data
- [Building a Blog](/guides/building-a-blog/) - Create a blog with pagination
- [Clean URLs](/guides/clean-urls/) - Configure pretty URLs
```

**Step 3: Create layouts guide**

Create `docs-src/guides/layouts-templates.md`:

```markdown
---
layout: _layouts._doc.html
title: Layouts & Templates
description: Creating reusable layouts with Nunjucks
currentPath: /guides/layouts-templates/
---

jstatico uses [Nunjucks](https://mozilla.github.io/nunjucks/) for templating.

## Creating a Base Layout

Create `_layouts/_base.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ meta.title }}</title>
    {% block head %}{% endblock %}
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

## Extending Layouts

Create a child layout that extends the base:

```html
{% extends "_layouts._base.html" %}

{% block content %}
<article>
    <h1>{{ meta.title }}</h1>
    {{ body }}
</article>
{% endblock %}
```

## Using Layouts

Reference layouts in frontmatter with dots (not slashes):

```yaml
---
layout: _layouts._post.html
title: My Post
---
```

## Template Variables

| Variable | Description |
|----------|-------------|
| `body` | Rendered page content |
| `meta` | Page frontmatter |
| `meta.title` | Page title |
| `_site` | Data from `_site/` directory |

## Includes

Include partial templates:

```html
{% include "_partials/_header.html" %}
```

## Loops and Conditionals

```html
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}

{% if meta.draft %}
  <span class="draft">Draft</span>
{% endif %}
```
```

**Step 4: Create working with data guide**

Create `docs-src/guides/working-with-data.md`:

```markdown
---
layout: _layouts._doc.html
title: Working with Data
description: Using JSON files for site-wide data
currentPath: /guides/working-with-data/
---

Store site-wide data in JSON files for use across all pages.

## Creating Data Files

Create JSON files with underscore prefix in `_site/`:

```
src/
└── _site/
    ├── _config.json
    └── _navigation.json
```

## Example: Site Config

Create `_site/_config.json`:

```json
{
    "siteName": "My Site",
    "author": "Jane Doe",
    "social": {
        "twitter": "@janedoe",
        "github": "janedoe"
    }
}
```

Access in templates:

```html
<title>{{ meta.title }} - {{ _site.config.siteName }}</title>
<a href="https://twitter.com/{{ _site.config.social.twitter }}">Twitter</a>
```

## Example: Navigation

Create `_site/_navigation.json`:

```json
[
    { "title": "Home", "url": "/" },
    { "title": "About", "url": "/about/" },
    { "title": "Blog", "url": "/blog/" }
]
```

Render in templates:

```html
<nav>
    {% for item in _site.navigation %}
        <a href="{{ item.url }}">{{ item.title }}</a>
    {% endfor %}
</nav>
```

## Nested Data

JSON files can have any structure:

```json
{
    "categories": [
        {
            "name": "Tech",
            "posts": ["post-1", "post-2"]
        }
    ]
}
```
```

**Step 5: Create building a blog guide**

Create `docs-src/guides/building-a-blog.md`:

```markdown
---
layout: _layouts._doc.html
title: Building a Blog
description: Create a blog with posts and pagination
currentPath: /guides/building-a-blog/
---

Build a blog with post listing and individual post pages.

## Directory Structure

```
src/
├── _layouts/
│   ├── _base.html
│   └── _post.html
├── blog/
│   ├── 2024-01-15-first-post.md
│   ├── 2024-01-20-second-post.md
│   └── blogPages.processor.js
└── index.md
```

## Post Layout

Create `_layouts/_post.html`:

```html
{% extends "_layouts._base.html" %}

{% block content %}
<article class="post">
    <header>
        <h1>{{ meta.title }}</h1>
        <time datetime="{{ meta.date }}">{{ meta.date }}</time>
    </header>
    <div class="content">
        {{ body }}
    </div>
</article>
{% endblock %}
```

## Writing Posts

Create posts with date-prefixed filenames:

`blog/2024-01-15-first-post.md`:

```markdown
---
layout: _layouts._post.html
title: My First Post
date: 2024-01-15
---

Content of your post here.
```

## Listing Posts

Access the blog tree in templates:

```html
<ul class="posts">
{% for key, post in blog %}
    {% if post.meta %}
    <li>
        <a href="/blog/{{ key }}/">{{ post.meta.title }}</a>
        <time>{{ post.meta.date }}</time>
    </li>
    {% endif %}
{% endfor %}
</ul>
```

## Dynamic Pagination

For pagination, create a `*.processor.js` file. See [Custom Processors](/processors/custom-processors/) for details.
```

**Step 6: Create clean URLs guide**

Create `docs-src/guides/clean-urls.md`:

```markdown
---
layout: _layouts._doc.html
title: Clean URLs
description: Configure pretty URLs without .html extension
currentPath: /guides/clean-urls/
---

Clean URLs make your site URLs look better and more professional.

## How It Works

With clean URLs enabled:

| Source | Output | URL |
|--------|--------|-----|
| `about.md` | `about/index.html` | `/about/` |
| `blog/post.md` | `blog/post/index.html` | `/blog/post/` |

## Enabling Clean URLs

Add `cleanurl: true` to your frontmatter:

```yaml
---
layout: _layouts._main.html
title: About
cleanurl: true
---
```

## Global Clean URLs

To enable clean URLs for all pages, you can create a custom postprocessor or set it in each file's frontmatter.

## Linking Between Pages

When using clean URLs, link to the directory path:

```html
<a href="/about/">About</a>
<a href="/blog/my-post/">My Post</a>
```

## Index Files

`index.md` files are already at the root of their directory, so `cleanurl` has no effect on them.
```

**Step 7: Commit**

```bash
git add docs-src/guides/
git commit -m "feat(docs): add Guides section (layouts, data, blog, clean-urls)"
```

---

## Task 11: Create Processors Section

**Files:**
- Create: `docs-src/processors/index.md`
- Create: `docs-src/processors/built-in.md`
- Create: `docs-src/processors/custom-processors.md`
- Create: `docs-src/processors/auto-discovery.md`
- Create: `docs-src/processors/builder-api.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/processors
```

**Step 2: Create processors index**

Create `docs-src/processors/index.md`:

```markdown
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

- [Built-in Processors](/processors/built-in/) - What's included
- [Custom Processors](/processors/custom-processors/) - Write your own
- [Auto-Discovery](/processors/auto-discovery/) - `_processors/` directory
- [Builder API](/processors/builder-api/) - Programmatic configuration
```

**Step 3: Create built-in processors page**

Create `docs-src/processors/built-in.md`:

```markdown
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
```

**Step 4: Create custom processors page**

Create `docs-src/processors/custom-processors.md`:

```markdown
---
layout: _layouts._doc.html
title: Custom Processors
description: Writing your own processors
currentPath: /processors/custom-processors/
---

Create custom processors to extend jstatico's functionality.

## Preprocessor Interface

```typescript
interface Preprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult) => ProcessResult;
}

type ProcessResult = void | {
  extension?: string;
  content?: string;
  meta?: Record<string, unknown>;
};
```

## Example: Custom File Type

Process `.upper` files by converting content to uppercase:

```typescript
import type { Preprocessor, ProcessResult } from 'jstatico';

export const processor: Preprocessor = {
  name: 'uppercase',
  match: /\.upper$/,
  process: function(): ProcessResult {
    return {
      extension: '.txt',
      content: this.getContent().toUpperCase()
    };
  }
};
```

## Postprocessor Interface

```typescript
interface Postprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult, tree: TreeMap, context: TreeContext) => ProcessResult;
}
```

## Example: Add Timestamp

Add build timestamp to HTML files:

```typescript
import type { Postprocessor, ProcessResult } from 'jstatico';

export const processor: Postprocessor = {
  name: 'timestamp',
  match: /\.html$/,
  process: function(): ProcessResult {
    const content = this.getContent();
    const timestamp = new Date().toISOString();
    return {
      content: content.replace('</body>', `<!-- Built: ${timestamp} --></body>`)
    };
  }
};
```

## Writer Interface

```typescript
interface Writer {
  name?: string;
  match: RegExp;
  write: (file: FileResult, destPath: string) => Promise<void> | void;
}
```

## Registration

See [Auto-Discovery](/processors/auto-discovery/) or [Builder API](/processors/builder-api/) for how to register processors.
```

**Step 5: Create auto-discovery page**

Create `docs-src/processors/auto-discovery.md`:

```markdown
---
layout: _layouts._doc.html
title: Auto-Discovery
description: Automatically load processors from _processors directory
currentPath: /processors/auto-discovery/
---

jstatico automatically discovers processors in the `_processors/` directory.

## Directory Structure

```
src/
├── _processors/
│   ├── preprocessors/
│   │   └── myPreprocessor.ts
│   ├── postprocessors/
│   │   └── myPostprocessor.ts
│   └── writers/
│       └── myWriter.ts
└── ...
```

## How It Works

1. jstatico scans `_processors/` subdirectories
2. Loads `.ts` and `.js` files alphabetically
3. Expects `processor` or `writer` export
4. Registers discovered processors

## Example

Create `_processors/preprocessors/uppercase.ts`:

```typescript
import type { Preprocessor, ProcessResult } from 'jstatico';

export const processor: Preprocessor = {
  name: 'uppercase',
  match: /\.upper$/,
  process: function(): ProcessResult {
    return {
      extension: '.txt',
      content: this.getContent().toUpperCase()
    };
  }
};
```

Now any `.upper` file will be converted to uppercase `.txt`.

## Precedence

Processors are applied in this order:

1. Programmatic (via Builder API)
2. Auto-discovered (from `_processors/`)
3. Built-in

Later processors can override earlier ones with the same match pattern.

## Disabling Auto-Discovery

Use the Builder API to skip auto-discovery:

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist')
  .skipAutoDiscovery()
  .generate();
```
```

**Step 6: Create builder API page**

Create `docs-src/processors/builder-api.md`:

```markdown
---
layout: _layouts._doc.html
title: Builder API
description: Programmatic configuration with the builder pattern
currentPath: /processors/builder-api/
---

The Builder API provides programmatic control over jstatico.

## Basic Usage

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist').generate();
```

## Adding Processors

```typescript
import { jstatico } from 'jstatico/builder';
import { processor as myProcessor } from './myProcessor';

await jstatico('src', 'dist')
  .addPreprocessor(myProcessor)
  .addPostprocessor(anotherProcessor)
  .addWriter(customWriter)
  .generate();
```

## Disabling Built-ins

```typescript
await jstatico('src', 'dist')
  .disableBuiltinPreprocessor('markdown')
  .disableBuiltinPostprocessor('html')
  .generate();
```

## Clear All Built-ins

```typescript
await jstatico('src', 'dist')
  .clearBuiltinPreprocessors()
  .clearBuiltinPostprocessors()
  .clearBuiltinWriters()
  .generate();
```

## Skip Auto-Discovery

```typescript
await jstatico('src', 'dist')
  .skipAutoDiscovery()
  .generate();
```

## Method Reference

| Method | Description |
|--------|-------------|
| `addPreprocessor(p)` | Add a preprocessor |
| `addPostprocessor(p)` | Add a postprocessor |
| `addWriter(w)` | Add a writer |
| `disableBuiltinPreprocessor(name)` | Disable built-in by name |
| `disableBuiltinPostprocessor(name)` | Disable built-in by name |
| `disableBuiltinWriter(name)` | Disable built-in by name |
| `clearBuiltinPreprocessors()` | Remove all built-in preprocessors |
| `clearBuiltinPostprocessors()` | Remove all built-in postprocessors |
| `clearBuiltinWriters()` | Remove all built-in writers |
| `skipAutoDiscovery()` | Don't load from `_processors/` |
| `generate()` | Run the build (terminal) |
```

**Step 7: Commit**

```bash
git add docs-src/processors/
git commit -m "feat(docs): add Processors section (built-in, custom, auto-discovery, builder)"
```

---

## Task 12: Create API Reference Section

**Files:**
- Create: `docs-src/api/index.md`
- Create: `docs-src/api/cli.md`
- Create: `docs-src/api/programmatic.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/api
```

**Step 2: Create API index**

Create `docs-src/api/index.md`:

```markdown
---
layout: _layouts._doc.html
title: API Reference Overview
description: Complete API reference for jstatico
currentPath: /api/
---

jstatico can be used via CLI or programmatically.

## CLI

Run jstatico from the command line:

```bash
jstatico <source> <destination>
```

See [CLI Reference](/api/cli/) for details.

## Programmatic

Use jstatico in your Node.js/Bun scripts:

```typescript
import { generate } from 'jstatico';

await generate('src', 'dist');
```

See [Programmatic API](/api/programmatic/) for the full API.
```

**Step 3: Create CLI reference**

Create `docs-src/api/cli.md`:

```markdown
---
layout: _layouts._doc.html
title: CLI Reference
description: Command line interface for jstatico
currentPath: /api/cli/
---

Run jstatico from the command line.

## Usage

```bash
jstatico <source> <destination>
```

| Argument | Description |
|----------|-------------|
| `source` | Source directory containing your site |
| `destination` | Output directory for generated files |

## Examples

Build from `src` to `dist`:

```bash
jstatico src dist
```

Build from `docs-src` to `docs-build`:

```bash
jstatico docs-src docs-build
```

## With Bun

If installed locally:

```bash
bun run jstatico src dist
```

Or using the CLI directly:

```bash
bun run src/cli.ts src dist
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (missing arguments, build failure) |

## npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build": "jstatico src dist"
  }
}
```

Then run:

```bash
bun run build
```
```

**Step 4: Create programmatic API reference**

Create `docs-src/api/programmatic.md`:

```markdown
---
layout: _layouts._doc.html
title: Programmatic API
description: Using jstatico in code
currentPath: /api/programmatic/
---

Use jstatico programmatically in your scripts.

## Simple API

```typescript
import { generate } from 'jstatico';

await generate('src', 'dist');
```

## Builder API

For more control, use the builder pattern:

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist')
  .addPreprocessor(myProcessor)
  .generate();
```

## Types

### Preprocessor

```typescript
interface Preprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult) => ProcessResult;
}
```

### Postprocessor

```typescript
interface Postprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult, tree: TreeMap, context: TreeContext) => ProcessResult;
}
```

### Writer

```typescript
interface Writer {
  name?: string;
  match: RegExp;
  write: (file: FileResult, destPath: string) => Promise<void> | void;
}
```

### ProcessResult

```typescript
type ProcessResult = void | {
  extension?: string;
  content?: string;
  meta?: Record<string, unknown>;
};
```

### FileResult

```typescript
interface FileResult {
  path: string;
  extension: string;
  meta: FileMeta;
  getContent(): string;
  setContent(content: string): void;
}
```

### TreeMap

```typescript
type TreeMap = {
  [key: string]: FileResult | TreeMap;
};
```

## Importing Types

```typescript
import type {
  Preprocessor,
  Postprocessor,
  Writer,
  ProcessResult,
  FileResult,
  TreeMap,
  TreeContext
} from 'jstatico';
```
```

**Step 5: Commit**

```bash
git add docs-src/api/
git commit -m "feat(docs): add API Reference section (CLI, programmatic)"
```

---

## Task 13: Create Examples Section

**Files:**
- Create: `docs-src/examples/index.md`
- Create: `docs-src/examples/recipes.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/examples
```

**Step 2: Create examples index**

Create `docs-src/examples/index.md`:

```markdown
---
layout: _layouts._doc.html
title: Examples Overview
description: Real-world examples and recipes
currentPath: /examples/
---

Learn from practical examples and copy-paste recipes.

## Example Sites

The jstatico repository includes a complete example site in `test/src/`:

- Blog with pagination
- Multiple layouts with inheritance
- Data-driven navigation
- Custom processor

## Recipes

Common patterns and solutions:

- [Recipes](/examples/recipes/) - Copy-paste solutions for common tasks
```

**Step 3: Create recipes page**

Create `docs-src/examples/recipes.md`:

```markdown
---
layout: _layouts._doc.html
title: Recipes
description: Copy-paste solutions for common tasks
currentPath: /examples/recipes/
---

Quick solutions for common jstatico tasks.

## Recipe: RSS Feed Generator

Create `blog/feed.processor.js`:

```javascript
export default function(tree, context) {
  const posts = Object.entries(tree.blog || {})
    .filter(([key, val]) => val.meta && !key.includes('processor'))
    .map(([key, post]) => ({
      title: post.meta.title,
      date: post.meta.date,
      url: `/blog/${key}/`
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <link>https://example.com</link>
    ${posts.map(p => `
    <item>
      <title>${p.title}</title>
      <link>https://example.com${p.url}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return {
    path: 'blog/feed.xml',
    content: xml,
    meta: {}
  };
}
```

## Recipe: Sitemap Generator

Create `sitemap.processor.js`:

```javascript
export default function(tree, context) {
  const urls = [];

  function walk(node, path = '') {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('_')) continue;
      if (value.meta) {
        urls.push(`https://example.com${path}/${key}/`);
      } else if (typeof value === 'object') {
        walk(value, `${path}/${key}`);
      }
    }
  }

  walk(tree);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

  return {
    path: 'sitemap.xml',
    content: xml,
    meta: {}
  };
}
```

## Recipe: Tag Pages

Create `blog/tags.processor.js`:

```javascript
export default function(tree, context) {
  const tagMap = {};

  for (const [key, post] of Object.entries(tree.blog || {})) {
    if (!post.meta?.tags) continue;
    for (const tag of post.meta.tags) {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push({ key, ...post.meta });
    }
  }

  return Object.entries(tagMap).map(([tag, posts]) => ({
    path: `blog/tags/${tag}/index.html`,
    content: `<h1>Posts tagged "${tag}"</h1>
<ul>
${posts.map(p => `<li><a href="/blog/${p.key}/">${p.title}</a></li>`).join('\n')}
</ul>`,
    meta: { title: `Tag: ${tag}` }
  }));
}
```

## Recipe: Reading Time

Create `_processors/preprocessors/readingTime.ts`:

```typescript
import type { Preprocessor, ProcessResult } from 'jstatico';

export const processor: Preprocessor = {
  name: 'reading-time',
  match: /\.md$/,
  process: function(): ProcessResult {
    const content = this.getContent();
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    return {
      meta: {
        ...this.meta,
        readingTime: `${minutes} min read`
      }
    };
  }
};
```

Use in templates:

```html
<span>{{ meta.readingTime }}</span>
```
```

**Step 4: Commit**

```bash
git add docs-src/examples/
git commit -m "feat(docs): add Examples section with recipes"
```

---

## Task 14: Create Contributing Section

**Files:**
- Create: `docs-src/contributing/index.md`
- Create: `docs-src/contributing/architecture.md`

**Step 1: Create the directory**

```bash
mkdir -p docs-src/contributing
```

**Step 2: Create contributing index**

Create `docs-src/contributing/index.md`:

```markdown
---
layout: _layouts._doc.html
title: How to Contribute
description: Contributing to jstatico
currentPath: /contributing/
---

Thanks for your interest in contributing to jstatico!

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies with Bun

```bash
git clone https://github.com/YOUR_USERNAME/jstatico.git
cd jstatico
bun install
```

## Development

Run tests:

```bash
bun test
```

Type check:

```bash
bun run typecheck
```

Build the test site:

```bash
bun run src/cli.ts test/src test/output
```

## Test Structure

Tests compare output against `test/reference/`:

```
test/
├── src/           # Test input site
├── reference/     # Expected output
└── jstatico.test.ts
```

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Run tests to ensure nothing broke
4. Submit a pull request

## Code Style

- TypeScript with strict mode
- Functional style preferred
- Keep it simple - avoid over-abstraction

## Questions?

Open an issue on [GitHub](https://github.com/egeozcan/jstatico/issues).
```

**Step 3: Create architecture page**

Create `docs-src/contributing/architecture.md`:

```markdown
---
layout: _layouts._doc.html
title: Architecture
description: Deep dive into jstatico's architecture
currentPath: /contributing/architecture/
---

Understanding jstatico's internal architecture.

## Core Flow

```
CLI (cli.ts)
    ↓
generate() (index.ts)
    ↓
┌─────────────────────────────────────┐
│ 1. dirTree() - Build file tree      │
│ 2. processTree() - Apply processors │
│ 3. writeTree() - Write output       │
└─────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/cli.ts` | Entry point, argument parsing |
| `src/index.ts` | Orchestrates the pipeline |
| `src/builder.ts` | Builder API for configuration |
| `src/discovery.ts` | Auto-discovers processors |
| `src/models/FileResult.ts` | Core file representation |
| `src/types.ts` | TypeScript interfaces |

## FileResult

The core data model representing each file:

```typescript
class FileResult {
  path: string;          // Original file path
  extension: string;     // Current extension
  meta: FileMeta;        // Frontmatter + computed data

  getContent(): string;  // Lazy content loading
  setContent(s: string); // Update content
}
```

## Processor Execution

Processors run in this order:

1. **Programmatic** - Added via Builder API
2. **Auto-discovered** - From `_processors/`
3. **Built-in** - Default processors

Within each category, processors run in registration order.

## Tree Structure

The directory becomes a nested object:

```typescript
type TreeMap = {
  [key: string]: FileResult | TreeMap;
};
```

Templates receive the full tree, enabling cross-file access.

## Template Context

Templates get:

```typescript
{
  body: string;           // Rendered content
  meta: FileMeta;         // Page frontmatter
  _site: TreeMap;         // Data from _site/
  [key: string]: TreeMap; // Full tree access
}
```

## Extension Points

| Point | Interface | Purpose |
|-------|-----------|---------|
| Preprocessor | `{ match, process }` | Transform input |
| Postprocessor | `{ match, process }` | Transform output |
| Writer | `{ match, write }` | Custom output |
```

**Step 4: Commit**

```bash
git add docs-src/contributing/
git commit -m "feat(docs): add Contributing section (guide, architecture)"
```

---

## Task 15: Add GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/docs.yml`

**Step 1: Create the directory**

```bash
mkdir -p .github/workflows
```

**Step 2: Create the workflow**

Create `.github/workflows/docs.yml`:

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

**Step 3: Commit**

```bash
git add .github/workflows/docs.yml
git commit -m "ci: add GitHub Actions workflow for docs deployment"
```

---

## Task 16: Add Package Scripts

**Files:**
- Modify: `package.json`

**Step 1: Add docs scripts**

Add to the `scripts` section in `package.json`:

```json
"docs:build": "bun run src/cli.ts docs-src docs-build",
"docs:dev": "bun run src/cli.ts docs-src docs-build && bunx serve docs-build"
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "feat: add docs:build and docs:dev scripts"
```

---

## Task 17: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Read current README**

Review current content.

**Step 2: Add documentation section and update content**

Add near the top after the description:

```markdown
## Documentation

Full documentation is available at **https://egeozcan.github.io/jstatico/**

- [Getting Started](https://egeozcan.github.io/jstatico/getting-started/)
- [Core Concepts](https://egeozcan.github.io/jstatico/concepts/)
- [API Reference](https://egeozcan.github.io/jstatico/api/)
```

Remove any note about "creating a documentation site" if present.

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add documentation site links to README"
```

---

## Task 18: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Read current CLAUDE.md**

Review current content.

**Step 2: Add docs-src section**

Add to the Build & Development Commands section:

```markdown
bun run docs:build   # Build documentation site
bun run docs:dev     # Build and serve docs locally
```

Add new section after Architecture Overview:

```markdown
## Documentation Site

The `docs-src/` directory contains the documentation site source, built with jstatico itself (dogfooding).

- Built automatically via GitHub Actions on push to master
- Deployed to GitHub Pages at https://egeozcan.github.io/jstatico/
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add documentation site info to CLAUDE.md"
```

---

## Task 19: Final Build and Test

**Step 1: Build the complete docs site**

```bash
bun run src/cli.ts docs-src docs-build
```

Expected: Build completes without errors.

**Step 2: Verify all pages exist**

```bash
find docs-build -name "*.html" | wc -l
```

Expected: ~26 HTML files (1 home + 25 doc pages).

**Step 3: Run project tests**

```bash
bun test
```

Expected: All tests pass.

**Step 4: Serve and manually verify**

```bash
bunx serve docs-build
```

Open http://localhost:3000 and verify:
- Homepage loads with hero section
- Navigation works
- Doc pages render correctly
- Code blocks have syntax highlighting

---

## Task 20: Merge to Master

**Step 1: Switch to main worktree**

```bash
cd /Users/egecan/Code/jstatico
```

**Step 2: Merge feature branch**

```bash
git merge feature/docs-site
```

**Step 3: Push to trigger deployment**

```bash
git push origin master
```

**Step 4: Verify GitHub Actions**

Check https://github.com/egeozcan/jstatico/actions to confirm the workflow runs successfully.

---

## Summary

This plan creates:
- 3 layout templates
- 1 navigation data file
- 1 CSS stylesheet
- 25 documentation pages
- 1 GitHub Actions workflow
- Updated package.json, README.md, CLAUDE.md

Total: ~20 tasks, each completable in 2-5 minutes.
