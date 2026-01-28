# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun test              # Run tests
bun run typecheck     # TypeScript type checking
bun run src/cli.ts <source> <dest>  # Run generator directly
```

## Architecture Overview

jstatico is a static site generator that processes directories through a three-phase pipeline:

```
PREPROCESSING → RENDERING → WRITING
(parse input)   (templates)  (output)
```

### Core Flow

1. **`src/cli.ts`** - Entry point, calls `generate(homePath, destPath)`
2. **`src/index.ts`** - Orchestrates: `dirTree()` → `processTree()` → `writeTree()`
3. **`src/models/FileResult.ts`** - Core data model representing each file

### Processor Pattern

All processors match files by regex and transform them:

```typescript
export const processor: Preprocessor = {
  match: /\.md$/,
  process: function(this: FileResult): ProcessResult { ... }
}
```

**Preprocessors** (`src/preprocessors/`) - Transform input files:
- `markdownProcessor.ts` - `.md` → HTML with YAML frontmatter extraction, syntax highlighting
- `jsonProcessor.ts` - `_*.json` → data objects loaded into tree context

**Postprocessors** (`src/postprocessors/`) - Render and transform output:
- `htmlProcessor.ts` - Nunjucks template rendering, HTML minification, clean URLs
- `pageGeneratorProcessor.ts` - `*.processor.js` files that generate multiple pages
- `bundleProcessor.ts` - `*.bundle` files (skipped from output)

**Writers** (`src/writers/`) - Write to filesystem:
- `simpleFileWriter.ts` - Handles common file types

### Tree Structure

The directory becomes a `TreeMap` where each file is a `FileResult`. Templates receive the entire tree as context:

```nunjucks
{{ body }}                    {# Rendered content #}
{{ meta.title }}              {# YAML frontmatter #}
{{ _site.cardNavigation }}    {# From _site/_cardNavigation.json #}
```

### Naming Conventions

- `_*.json` - Data files (loaded into context, not written)
- `_*.html` - Layout templates (not written directly)
- `*.processor.js` - Custom generators returning `FileResult` or `FileResultArray`
- `*.bundle` - Bundled assets (not written)

### Frontmatter Options

```yaml
---
layout: "_layouts._main.html"  # Template wrapper
title: "Page Title"            # Override auto-generated title
cleanurl: true                 # page.html → page/index.html
---
```

## Test Structure

- `test/jstatico.test.ts` - Integration test comparing output against `test/reference/`
- `test/src/` - Test input site with markdown, layouts, data files, custom processor
- `test/reference/` - Expected output (tests compare byte-by-byte)
