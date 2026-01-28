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
