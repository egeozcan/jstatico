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
