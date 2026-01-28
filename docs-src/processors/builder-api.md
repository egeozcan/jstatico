---
layout: _layouts._doc.html
title: Builder API
description: Programmatic configuration with the builder pattern
currentPath: /processors/builder-api/
---

The Builder API provides programmatic control over jstatico.

## Basic Usage

```typescript
import { jstatico } from 'jstatico/builder';

await jstatico('src', 'dist').generate();
```

## Adding Processors

```typescript
import { jstatico } from 'jstatico/builder';
import { processor as myProcessor } from './myProcessor';

await jstatico('src', 'dist')
  .addPreprocessor(myProcessor)
  .addPostprocessor(anotherProcessor)
  .addWriter(customWriter)
  .generate();
```

## Disabling Built-ins

```typescript
await jstatico('src', 'dist')
  .disableBuiltinPreprocessor('markdown')
  .disableBuiltinPostprocessor('html')
  .generate();
```

## Clear All Built-ins

```typescript
await jstatico('src', 'dist')
  .clearBuiltinPreprocessors()
  .clearBuiltinPostprocessors()
  .clearBuiltinWriters()
  .generate();
```

## Skip Auto-Discovery

```typescript
await jstatico('src', 'dist')
  .skipAutoDiscovery()
  .generate();
```

## Method Reference

| Method | Description |
|--------|-------------|
| `addPreprocessor(p)` | Add a preprocessor |
| `addPostprocessor(p)` | Add a postprocessor |
| `addWriter(w)` | Add a writer |
| `disableBuiltinPreprocessor(name)` | Disable built-in by name |
| `disableBuiltinPostprocessor(name)` | Disable built-in by name |
| `disableBuiltinWriter(name)` | Disable built-in by name |
| `clearBuiltinPreprocessors()` | Remove all built-in preprocessors |
| `clearBuiltinPostprocessors()` | Remove all built-in postprocessors |
| `clearBuiltinWriters()` | Remove all built-in writers |
| `skipAutoDiscovery()` | Don't load from `_processors/` |
| `generate()` | Run the build (terminal) |
