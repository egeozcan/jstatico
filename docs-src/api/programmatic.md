---
layout: _layouts._doc.html
title: Programmatic API
description: Using jstatico in code
currentPath: /api/programmatic/
---

Use jstatico programmatically in your scripts.

## Simple API

```typescript
import { generate } from 'jstatico';

await generate('src', 'dist');
```

## Builder API

For more control, use the builder pattern:

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist')
  .addPreprocessor(myProcessor)
  .generate();
```

## Types

### Preprocessor

```typescript
interface Preprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult) => ProcessResult;
}
```

### Postprocessor

```typescript
interface Postprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult, tree: TreeMap, context: TreeContext) => ProcessResult;
}
```

### Writer

```typescript
interface Writer {
  name?: string;
  match: RegExp;
  write: (file: FileResult, destPath: string) => Promise<void> | void;
}
```

### ProcessResult

```typescript
type ProcessResult = void | {
  extension?: string;
  content?: string;
  meta?: Record<string, unknown>;
};
```

### FileResult

```typescript
interface FileResult {
  path: string;
  extension: string;
  meta: FileMeta;
  getContent(): string;
  setContent(content: string): void;
}
```

### TreeMap

```typescript
type TreeMap = {
  [key: string]: FileResult | TreeMap;
};
```

## Importing Types

```typescript
import type {
  Preprocessor,
  Postprocessor,
  Writer,
  ProcessResult,
  FileResult,
  TreeMap,
  TreeContext
} from 'jstatico';
```
