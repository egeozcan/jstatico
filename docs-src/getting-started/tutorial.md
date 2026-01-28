---
layout: _layouts._doc.html
cleanurl: true
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

The file should have YAML frontmatter at the top, followed by content:

```yaml
layout: _layouts._post.html
title: Hello World
date: 2024-01-15
```

Then add your post content below the frontmatter delimiters.

Example post content with a code block:

```javascript
console.log("Hello from jstatico!");
```

## Step 5: Homepage

Create `src/index.md`:

```yaml
layout: _layouts._base.html
title: Home
```

Content:

```markdown
# Welcome to My Blog

Check out my [latest posts](/jstatico/blog/).
```

## Step 6: Build and Test

```bash
bun run jstatico src dist
```

Open `dist/index.html` to see your blog.

## Next Steps

- Learn about [Core Concepts](/jstatico/concepts/)
- Explore [Custom Processors](/jstatico/processors/custom-processors/)
