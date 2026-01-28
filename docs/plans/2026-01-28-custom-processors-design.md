# Custom Processors and Preprocessors Design

## Overview

Add support for custom preprocessors, postprocessors, and writers through two mechanisms:
1. **Auto-discovery** from `_processors/` directory in the source site
2. **Programmatic API** via a chainable builder pattern

## Directory Structure & Auto-Discovery

Custom processors live in a `_processors/` directory at the root of the source site:

```
site/
├── _processors/
│   ├── preprocessors/
│   │   └── sassProcessor.ts
│   ├── postprocessors/
│   │   └── imageOptimizer.js
│   └── writers/
│       └── s3Writer.ts
├── _layouts/
├── index.md
└── ...
```

**Auto-discovery rules:**
- Each `.ts` or `.js` file in the subdirectories must export a `processor` (for pre/postprocessors) or `writer` object
- Files are loaded alphabetically, all prepended before built-ins
- The `_processors/` directory is excluded from output (underscore prefix convention)

**Processor file format:**

```typescript
// _processors/preprocessors/sassProcessor.ts
import type { Preprocessor } from "jstatico";

export const processor: Preprocessor = {
  match: /\.scss$/,
  parse(this) {
    // Transform SASS to CSS, return new FileResult with .css extension
  }
};
```

## Chainable Builder API

```typescript
import jstatico from "jstatico";

await jstatico("./src", "./dist")
  .addPreprocessor({
    match: /\.scss$/,
    parse() { /* ... */ }
  })
  .addPostprocessor({
    match: /\.html$/,
    process(context) { /* ... */ }
  })
  .addWriter({
    match: /\.html$/,
    write(homePath, destPath) { /* ... */ }
  })
  .disableBuiltinPreprocessor("markdown")
  .disableBuiltinPostprocessor("html")
  .disableBuiltinWriter("simple")
  .clearBuiltinPreprocessors()
  .clearBuiltinPostprocessors()
  .clearBuiltinWriters()
  .generate();
```

**Built-in processor names (for disabling):**
- Preprocessors: `"markdown"`, `"json"`
- Postprocessors: `"html"`, `"pageGenerator"`, `"bundle"`
- Writers: `"simple"`

**Method chaining rules:**
- `add*` methods prepend to the processor list (custom runs before built-ins)
- `disableBuiltin*` removes a specific built-in by name
- `clearBuiltin*` removes all built-ins of that type
- `generate()` is terminal — executes the build and returns a Promise

The simple `generate(source, dest)` function continues to work unchanged.

## Processor Precedence

When using the builder, auto-discovered processors from `_processors/` are still loaded:

```
1. Programmatic (added via builder)  ← runs first
2. Auto-discovered (from _processors/)
3. Built-ins (unless disabled)       ← runs last
```

**To skip auto-discovery:**

```typescript
await jstatico("./src", "./dist")
  .skipAutoDiscovery()
  .addPreprocessor(...)
  .generate();
```

**Error handling:**
- Processor file with syntax error or missing export fails build with clear error message
- Invalid name in `disableBuiltin*()` logs warning but continues

## Implementation Changes

**New file: `src/builder.ts`**
- Exports `jstatico()` function returning `JstaticoBuilder` class
- Builder holds configuration: custom processors, disabled built-ins, skipAutoDiscovery flag
- `generate()` method wires everything and calls the existing pipeline

**Changes to `src/index.ts`**
- Extract processor loading into `loadProcessors()` function
- Add `discoverProcessors(sourcePath)` to scan `_processors/` directory
- Keep `generate(source, dest)` as simple wrapper with defaults

**New file: `src/discovery.ts`**
- `discoverPreprocessors(sourcePath)` — scans `_processors/preprocessors/`
- `discoverPostprocessors(sourcePath)` — scans `_processors/postprocessors/`
- `discoverWriters(sourcePath)` — scans `_processors/writers/`
- Uses Bun's dynamic `import()` to load `.ts` and `.js` files
- Validates exports have required shape

**No changes to `src/models/FileResult.ts`** — already uses setter functions.

## Exports

```typescript
// Main API
export { generate } from "./index";
export { default, jstatico } from "./builder";

// Types for custom processors
export type { Preprocessor, Postprocessor, Writer } from "./types";
export type { FileResult } from "./models/FileResult";
export type { FileResultArray } from "./models/FileResultArray";
export type { TreeContext, FileMeta } from "./types";
```

## Testing Strategy

**Auto-discovery tests:**
- Add `test/src/_processors/preprocessors/uppercaseProcessor.ts`
- Add `test/src/sample.upper` and `test/reference/sample.upper`
- Existing test framework compares output

**Builder API tests (`test/builder.test.ts`):**
- `addPreprocessor` prepends and runs before built-ins
- `disableBuiltinPreprocessor("markdown")` skips markdown processing
- `clearBuiltinPostprocessors()` removes all postprocessors
- `skipAutoDiscovery()` ignores `_processors/` directory
- Builder processors take precedence over auto-discovered

**Error handling tests:**
- Syntax error in processor file fails with clear message
- Missing `processor` export fails with clear message
- Invalid name in `disableBuiltin*()` logs warning
