---
layout: _layouts._doc.html
cleanurl: true
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
