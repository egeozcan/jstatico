---
layout: _layouts._doc.html
cleanurl: true
title: Custom Processors
description: Writing your own processors
currentPath: /processors/custom-processors/
---

Create custom processors to extend jstatico's functionality.

## Preprocessor Interface

```typescript
interface Preprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult) => ProcessResult;
}

type ProcessResult = void | {
  extension?: string;
  content?: string;
  meta?: Record<string, unknown>;
};
```

## Example: Custom File Type

Process `.upper` files by converting content to uppercase:

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

## Postprocessor Interface

```typescript
interface Postprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult, tree: TreeMap, context: TreeContext) => ProcessResult;
}
```

## Example: Add Timestamp

Add build timestamp to HTML files:

```typescript
import type { Postprocessor, ProcessResult } from 'jstatico';

export const processor: Postprocessor = {
  name: 'timestamp',
  match: /\.html$/,
  process: function(): ProcessResult {
    const content = this.getContent();
    const timestamp = new Date().toISOString();
    return {
      content: content.replace('</body>', `<!-- Built: ${timestamp} --></body>`)
    };
  }
};
```

## Writer Interface

```typescript
interface Writer {
  name?: string;
  match: RegExp;
  write: (file: FileResult, destPath: string) => Promise<void> | void;
}
```

## Registration

See [Auto-Discovery](/jstatico/processors/auto-discovery/) or [Builder API](/jstatico/processors/builder-api/) for how to register processors.
