---
layout: _layouts._doc.html
cleanurl: true
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

```yaml
layout: _layouts._main.html
title: My Site
```

Then add your content below the frontmatter:

```markdown
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

Follow the [Tutorial](/jstatico/getting-started/tutorial/) to build a complete blog.
