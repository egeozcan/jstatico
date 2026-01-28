---
layout: _layouts._doc.html
cleanurl: true
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
layout: _layouts._post.html
title: My Post
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
