---
layout: _layouts._doc.html
cleanurl: true
title: Architecture
description: Deep dive into jstatico's architecture
currentPath: /contributing/architecture/
---

Understanding jstatico's internal architecture.

## Core Flow

```
CLI (cli.ts)
    ↓
generate() (index.ts)
    ↓
┌─────────────────────────────────────┐
│ 1. dirTree() - Build file tree      │
│ 2. processTree() - Apply processors │
│ 3. writeTree() - Write output       │
└─────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/cli.ts` | Entry point, argument parsing |
| `src/index.ts` | Orchestrates the pipeline |
| `src/builder.ts` | Builder API for configuration |
| `src/discovery.ts` | Auto-discovers processors |
| `src/models/FileResult.ts` | Core file representation |
| `src/types.ts` | TypeScript interfaces |

## FileResult

The core data model representing each file:

```typescript
class FileResult {
  path: string;          // Original file path
  extension: string;     // Current extension
  meta: FileMeta;        // Frontmatter + computed data

  getContent(): string;  // Lazy content loading
  setContent(s: string); // Update content
}
```

## Processor Execution

Processors run in this order:

1. **Programmatic** - Added via Builder API
2. **Auto-discovered** - From `_processors/`
3. **Built-in** - Default processors

Within each category, processors run in registration order.

## Tree Structure

The directory becomes a nested object:

```typescript
type TreeMap = {
  [key: string]: FileResult | TreeMap;
};
```

Templates receive the full tree, enabling cross-file access.

## Template Context

Templates get:

```typescript
{
  body: string;           // Rendered content
  meta: FileMeta;         // Page frontmatter
  _site: TreeMap;         // Data from _site/
  [key: string]: TreeMap; // Full tree access
}
```

## Extension Points

| Point | Interface | Purpose |
|-------|-----------|---------|
| Preprocessor | `{ match, process }` | Transform input |
| Postprocessor | `{ match, process }` | Transform output |
| Writer | `{ match, write }` | Custom output |
