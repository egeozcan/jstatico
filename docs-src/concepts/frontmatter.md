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
