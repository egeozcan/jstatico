jstatico
==========================
As simple as static web site generation gets.

Creates a JSON tree from a directory, applies built-in filters (Markdown, Nunjucks templating, syntax highlighting), and outputs to a destination directory.

## Documentation

Full documentation is available at **https://egeozcan.github.io/jstatico/**

- [Getting Started](https://egeozcan.github.io/jstatico/getting-started/)
- [Core Concepts](https://egeozcan.github.io/jstatico/concepts/)
- [API Reference](https://egeozcan.github.io/jstatico/api/)

## Requirements

- [Bun](https://bun.sh) runtime

## Installation

    bun install jstatico

## Usage

    jstatico /path/to/inputDirectory /path/to/outputDirectory

## Development

Run tests:

    bun test

Type check:

    bun run typecheck

## Custom Processors

### Auto-Discovery

Create a `_processors/` directory in your source folder:

```
site/
├── _processors/
│   ├── preprocessors/
│   │   └── myProcessor.ts
│   ├── postprocessors/
│   │   └── myPostprocessor.js
│   └── writers/
│       └── myWriter.ts
```

Processors are loaded alphabetically and run before built-ins.

**Preprocessor example:**

```typescript
import type { Preprocessor } from "jstatico";

export const processor: Preprocessor = {
  match: /\.scss$/,
  parse() {
    // Transform this.contents, return new FileResult
  }
};
```

### Programmatic API

```typescript
import jstatico from "jstatico/builder";

await jstatico("./src", "./dist")
  .addPreprocessor({ match: /\.scss$/, parse() { ... } })
  .disableBuiltinPreprocessor("markdown")
  .skipAutoDiscovery()
  .generate();
```

That's it!

I use this to generate egeozcan.com

An example site is included. See the folder named "test".

License: MIT
