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
