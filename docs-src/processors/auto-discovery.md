---
layout: _layouts._doc.html
cleanurl: true
title: Auto-Discovery
description: Automatically load processors from _processors directory
currentPath: /processors/auto-discovery/
---

jstatico automatically discovers processors in the `_processors/` directory.

## Directory Structure

```
src/
├── _processors/
│   ├── preprocessors/
│   │   └── myPreprocessor.ts
│   ├── postprocessors/
│   │   └── myPostprocessor.ts
│   └── writers/
│       └── myWriter.ts
└── ...
```

## How It Works

1. jstatico scans `_processors/` subdirectories
2. Loads `.ts` and `.js` files alphabetically
3. Expects `processor` or `writer` export
4. Registers discovered processors

## Example

Create `_processors/preprocessors/uppercase.ts`:

```typescript
import type { Preprocessor, ProcessResult } from 'jstatico';

export const processor: Preprocessor = {
  name: 'uppercase',
  match: /\.upper$/,
  process: function(): ProcessResult {
    return {
      extension: '.txt',
      content: this.getContent().toUpperCase()
    };
  }
};
```

Now any `.upper` file will be converted to uppercase `.txt`.

## Precedence

Processors are applied in this order:

1. Programmatic (via Builder API)
2. Auto-discovered (from `_processors/`)
3. Built-in

Later processors can override earlier ones with the same match pattern.

## Disabling Auto-Discovery

Use the Builder API to skip auto-discovery:

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist')
  .skipAutoDiscovery()
  .generate();
```
