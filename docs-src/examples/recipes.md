---
layout: _layouts._doc.html
cleanurl: true
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
