# Custom Processors Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add support for custom preprocessors, postprocessors, and writers via auto-discovery and a chainable builder API.

**Architecture:** Create a discovery module to scan `_processors/` directories and a builder class for programmatic configuration. The builder merges custom, discovered, and built-in processors in precedence order, then calls the existing pipeline.

**Tech Stack:** TypeScript, Bun (dynamic import for .ts/.js files)

---

### Task 1: Add Processor Names to Built-ins

**Files:**
- Modify: `src/preprocessors/index.ts`
- Modify: `src/postprocessors/index.ts`
- Modify: `src/writers/index.ts`
- Modify: `src/types.ts`

**Step 1: Add name field to processor types**

In `src/types.ts`, add optional `name` field to each processor interface:

```typescript
export interface Preprocessor {
  name?: string;
  match: RegExp;
  parse: (this: FileResult) => FileResult | FileResultArray | Record<string, unknown>;
}

export interface Postprocessor {
  name?: string;
  match: RegExp;
  process: (this: FileResult, context: TreeContext) => ProcessResult | Promise<ProcessResult>;
}

export interface Writer {
  name?: string;
  match: RegExp;
  write: (this: FileResult, homePath: string, destinationPath: string) => void;
}
```

**Step 2: Add names to built-in preprocessors**

In `src/preprocessors/index.ts`:

```typescript
import type { Preprocessor } from "../types";
import { markdownProcessor } from "./markdownProcessor";
import { jsonProcessor } from "./jsonProcessor";

// Add names for disabling via builder
const namedMarkdown: Preprocessor = { ...markdownProcessor, name: "markdown" };
const namedJson: Preprocessor = { ...jsonProcessor, name: "json" };

export const preprocessors: Preprocessor[] = [namedMarkdown, namedJson];
```

**Step 3: Add names to built-in postprocessors**

In `src/postprocessors/index.ts`:

```typescript
import type { Postprocessor } from "../types";
import { htmlProcessor } from "./htmlProcessor";
import { pageGeneratorProcessor } from "./pageGeneratorProcessor";
import { bundleProcessor } from "./bundleProcessor";

const namedHtml: Postprocessor = { ...htmlProcessor, name: "html" };
const namedPageGenerator: Postprocessor = { ...pageGeneratorProcessor, name: "pageGenerator" };
const namedBundle: Postprocessor = { ...bundleProcessor, name: "bundle" };

export const postprocessors: Postprocessor[] = [
  namedHtml,
  namedPageGenerator,
  namedBundle,
];
```

**Step 4: Add names to built-in writers**

In `src/writers/index.ts`:

```typescript
import type { Writer } from "../types";
import { simpleFileWriter } from "./simpleFileWriter";

const namedSimple: Writer = { ...simpleFileWriter, name: "simple" };

export const writers: Writer[] = [namedSimple];
```

**Step 5: Run tests to verify no regression**

Run: `bun test`
Expected: 2 tests pass

**Step 6: Commit**

```bash
git add src/types.ts src/preprocessors/index.ts src/postprocessors/index.ts src/writers/index.ts
git commit -m "feat: add name field to built-in processors for disabling"
```

---

### Task 2: Create Discovery Module

**Files:**
- Create: `src/discovery.ts`
- Create: `test/discovery.test.ts`

**Step 1: Write the failing test for discoverPreprocessors**

Create `test/discovery.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { resolve } from "path";
import { discoverPreprocessors, discoverPostprocessors, discoverWriters } from "../src/discovery";

const testDir = resolve(import.meta.dir, "./discovery-test-fixtures");

describe("discovery", () => {
  beforeAll(() => {
    // Create test fixture directory structure
    mkdirSync(`${testDir}/_processors/preprocessors`, { recursive: true });
    mkdirSync(`${testDir}/_processors/postprocessors`, { recursive: true });
    mkdirSync(`${testDir}/_processors/writers`, { recursive: true });

    // Create a valid preprocessor
    writeFileSync(
      `${testDir}/_processors/preprocessors/upperProcessor.ts`,
      `export const processor = {
        match: /\\.upper$/,
        parse() { return this; }
      };`
    );

    // Create a valid postprocessor
    writeFileSync(
      `${testDir}/_processors/postprocessors/testProcessor.js`,
      `export const processor = {
        match: /\\.test$/,
        process() { return this; }
      };`
    );

    // Create a valid writer
    writeFileSync(
      `${testDir}/_processors/writers/testWriter.ts`,
      `export const writer = {
        match: /\\.out$/,
        write() {}
      };`
    );
  });

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });

  test("discoverPreprocessors finds .ts files", async () => {
    const processors = await discoverPreprocessors(testDir);
    expect(processors).toHaveLength(1);
    expect(processors[0].match.test("file.upper")).toBe(true);
  });

  test("discoverPostprocessors finds .js files", async () => {
    const processors = await discoverPostprocessors(testDir);
    expect(processors).toHaveLength(1);
    expect(processors[0].match.test("file.test")).toBe(true);
  });

  test("discoverWriters finds writer exports", async () => {
    const writers = await discoverWriters(testDir);
    expect(writers).toHaveLength(1);
    expect(writers[0].match.test("file.out")).toBe(true);
  });

  test("discoverPreprocessors returns empty array when directory missing", async () => {
    const processors = await discoverPreprocessors("/nonexistent/path");
    expect(processors).toEqual([]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test test/discovery.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write the discovery module**

Create `src/discovery.ts`:

```typescript
import { readdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import type { Preprocessor, Postprocessor, Writer } from "./types";

async function discoverProcessorsInDir<T>(
  basePath: string,
  subdir: string,
  exportName: string
): Promise<T[]> {
  const dir = join(basePath, "_processors", subdir);

  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
    .sort();

  const processors: T[] = [];

  for (const file of files) {
    const fullPath = resolve(dir, file);
    try {
      const module = await import(fullPath);
      if (module[exportName]) {
        processors.push(module[exportName] as T);
      } else {
        console.error(`Warning: ${fullPath} does not export '${exportName}'`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load processor from ${fullPath}: ${message}`);
    }
  }

  return processors;
}

export async function discoverPreprocessors(basePath: string): Promise<Preprocessor[]> {
  return discoverProcessorsInDir<Preprocessor>(basePath, "preprocessors", "processor");
}

export async function discoverPostprocessors(basePath: string): Promise<Postprocessor[]> {
  return discoverProcessorsInDir<Postprocessor>(basePath, "postprocessors", "processor");
}

export async function discoverWriters(basePath: string): Promise<Writer[]> {
  return discoverProcessorsInDir<Writer>(basePath, "writers", "writer");
}
```

**Step 4: Run test to verify it passes**

Run: `bun test test/discovery.test.ts`
Expected: 4 tests pass

**Step 5: Run all tests to verify no regression**

Run: `bun test`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/discovery.ts test/discovery.test.ts
git commit -m "feat: add discovery module for auto-loading custom processors"
```

---

### Task 3: Create Builder Class

**Files:**
- Create: `src/builder.ts`
- Create: `test/builder.test.ts`

**Step 1: Write the failing test for builder basics**

Create `test/builder.test.ts`:

```typescript
import { describe, test, expect } from "bun:test";
import { jstatico, JstaticoBuilder } from "../src/builder";

describe("JstaticoBuilder", () => {
  test("jstatico() returns a builder instance", () => {
    const builder = jstatico("./src", "./dist");
    expect(builder).toBeInstanceOf(JstaticoBuilder);
  });

  test("addPreprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addPreprocessor({
      match: /\.test$/,
      parse() { return this; }
    });
    expect(result).toBe(builder);
  });

  test("addPostprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addPostprocessor({
      match: /\.test$/,
      process() { return this; }
    });
    expect(result).toBe(builder);
  });

  test("addWriter returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addWriter({
      match: /\.test$/,
      write() {}
    });
    expect(result).toBe(builder);
  });

  test("disableBuiltinPreprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.disableBuiltinPreprocessor("markdown");
    expect(result).toBe(builder);
  });

  test("clearBuiltinPreprocessors returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.clearBuiltinPreprocessors();
    expect(result).toBe(builder);
  });

  test("skipAutoDiscovery returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.skipAutoDiscovery();
    expect(result).toBe(builder);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test test/builder.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write the builder module**

Create `src/builder.ts`:

```typescript
import type { Preprocessor, Postprocessor, Writer } from "./types";
import { preprocessors as builtinPreprocessors } from "./preprocessors";
import { postprocessors as builtinPostprocessors } from "./postprocessors";
import { writers as builtinWriters } from "./writers";
import { discoverPreprocessors, discoverPostprocessors, discoverWriters } from "./discovery";
import { setPreprocessors, setPostprocessors, setWriters } from "./models/FileResult";
import { generateInternal } from "./index";

export class JstaticoBuilder {
  private sourcePath: string;
  private destPath: string;
  private customPreprocessors: Preprocessor[] = [];
  private customPostprocessors: Postprocessor[] = [];
  private customWriters: Writer[] = [];
  private disabledPreprocessors: Set<string> = new Set();
  private disabledPostprocessors: Set<string> = new Set();
  private disabledWriters: Set<string> = new Set();
  private clearPreprocessors = false;
  private clearPostprocessors = false;
  private clearWriters = false;
  private skipDiscovery = false;

  constructor(sourcePath: string, destPath: string) {
    this.sourcePath = sourcePath;
    this.destPath = destPath;
  }

  addPreprocessor(processor: Preprocessor): this {
    this.customPreprocessors.push(processor);
    return this;
  }

  addPostprocessor(processor: Postprocessor): this {
    this.customPostprocessors.push(processor);
    return this;
  }

  addWriter(writer: Writer): this {
    this.customWriters.push(writer);
    return this;
  }

  disableBuiltinPreprocessor(name: string): this {
    this.disabledPreprocessors.add(name);
    return this;
  }

  disableBuiltinPostprocessor(name: string): this {
    this.disabledPostprocessors.add(name);
    return this;
  }

  disableBuiltinWriter(name: string): this {
    this.disabledWriters.add(name);
    return this;
  }

  clearBuiltinPreprocessors(): this {
    this.clearPreprocessors = true;
    return this;
  }

  clearBuiltinPostprocessors(): this {
    this.clearPostprocessors = true;
    return this;
  }

  clearBuiltinWriters(): this {
    this.clearWriters = true;
    return this;
  }

  skipAutoDiscovery(): this {
    this.skipDiscovery = true;
    return this;
  }

  async generate(): Promise<void> {
    // Discover processors from source directory
    let discoveredPreprocessors: Preprocessor[] = [];
    let discoveredPostprocessors: Postprocessor[] = [];
    let discoveredWriters: Writer[] = [];

    if (!this.skipDiscovery) {
      discoveredPreprocessors = await discoverPreprocessors(this.sourcePath);
      discoveredPostprocessors = await discoverPostprocessors(this.sourcePath);
      discoveredWriters = await discoverWriters(this.sourcePath);
    }

    // Filter built-ins
    const filteredPreprocessors = this.clearPreprocessors
      ? []
      : builtinPreprocessors.filter((p) => !p.name || !this.disabledPreprocessors.has(p.name));

    const filteredPostprocessors = this.clearPostprocessors
      ? []
      : builtinPostprocessors.filter((p) => !p.name || !this.disabledPostprocessors.has(p.name));

    const filteredWriters = this.clearWriters
      ? []
      : builtinWriters.filter((w) => !w.name || !this.disabledWriters.has(w.name));

    // Warn about unknown names
    for (const name of this.disabledPreprocessors) {
      if (!builtinPreprocessors.some((p) => p.name === name)) {
        console.warn(`Warning: Unknown preprocessor name '${name}'`);
      }
    }
    for (const name of this.disabledPostprocessors) {
      if (!builtinPostprocessors.some((p) => p.name === name)) {
        console.warn(`Warning: Unknown postprocessor name '${name}'`);
      }
    }
    for (const name of this.disabledWriters) {
      if (!builtinWriters.some((w) => w.name === name)) {
        console.warn(`Warning: Unknown writer name '${name}'`);
      }
    }

    // Merge: custom (first) → discovered → built-ins (last)
    const finalPreprocessors = [
      ...this.customPreprocessors,
      ...discoveredPreprocessors,
      ...filteredPreprocessors,
    ];
    const finalPostprocessors = [
      ...this.customPostprocessors,
      ...discoveredPostprocessors,
      ...filteredPostprocessors,
    ];
    const finalWriters = [
      ...this.customWriters,
      ...discoveredWriters,
      ...filteredWriters,
    ];

    // Set processors and generate
    setPreprocessors(finalPreprocessors);
    setPostprocessors(finalPostprocessors);
    setWriters(finalWriters);

    await generateInternal(this.sourcePath, this.destPath);
  }
}

export function jstatico(sourcePath: string, destPath: string): JstaticoBuilder {
  return new JstaticoBuilder(sourcePath, destPath);
}

export default jstatico;
```

**Step 4: Run test to verify it passes**

Run: `bun test test/builder.test.ts`
Expected: 7 tests pass

**Step 5: Commit**

```bash
git add src/builder.ts test/builder.test.ts
git commit -m "feat: add chainable builder class for custom processors"
```

---

### Task 4: Refactor index.ts to Export generateInternal

**Files:**
- Modify: `src/index.ts`

**Step 1: Run existing tests to verify baseline**

Run: `bun test test/jstatico.test.ts`
Expected: 2 tests pass

**Step 2: Refactor index.ts**

Extract the core generation logic to `generateInternal` and keep `generate` as the simple wrapper:

```typescript
import { readdirSync, lstatSync } from "fs";
import { basename } from "path";
import { FileResult, setPreprocessors, setPostprocessors, setWriters } from "./models/FileResult";
import { FileResultArray } from "./models/FileResultArray";
import { preprocessors } from "./preprocessors";
import { postprocessors } from "./postprocessors";
import { writers } from "./writers";
import { discoverPreprocessors, discoverPostprocessors, discoverWriters } from "./discovery";
import type { TreeMap, TreeNode } from "./types";

// Expose to global scope for backward compatibility with custom processors
(globalThis as Record<string, unknown>).FileResult = FileResult;
(globalThis as Record<string, unknown>).FileResultArray = FileResultArray;

function dirTree(filename: string, isParent: boolean): TreeMap | null {
  const stats = lstatSync(filename);
  const isDirectory = stats.isDirectory();
  const fileName = basename(filename);

  if ((stats.size === 0 && !isDirectory) || fileName[0] === ".") {
    return null;
  }

  if (isDirectory) {
    const children = readdirSync(filename);
    const map = children
      .map((child) => dirTree(`${filename}/${child}`, false))
      .filter((f): f is TreeMap => f !== null)
      .reduce<TreeMap>((obj, cur) => {
        // Check if it's a direct FileResult by examining properties
        if (cur && typeof cur === "object" && "name" in cur && "path" in cur && cur instanceof FileResult) {
          obj[(cur as unknown as FileResult).name] = cur as unknown as FileResult;
          return obj;
        }

        // Check if any value is a FileResultArray
        for (const prop in cur) {
          if (Object.prototype.hasOwnProperty.call(cur, prop)) {
            const value = cur[prop];
            if (value instanceof FileResultArray) {
              value.results.forEach((c) => {
                obj[c.name] = c;
              });
            } else {
              obj[prop] = value;
            }
          }
        }
        return obj;
      }, {});

    if (isParent) {
      return map;
    }

    return { [fileName]: map };
  }

  const fileResult = new FileResult(filename);
  const parsed = fileResult.parsed;

  // Handle parsed result which might be FileResult, FileResultArray, or a plain object
  if (parsed instanceof FileResult) {
    return { [parsed.name]: parsed } as TreeMap;
  }
  if (parsed instanceof FileResultArray) {
    const result: TreeMap = {};
    parsed.results.forEach((r) => {
      result[r.name] = r;
    });
    return result;
  }

  // Plain object returned by jsonProcessor
  return parsed as TreeMap;
}

async function processTree(tree: TreeMap, part: TreeNode): Promise<void> {
  if (part === null || typeof part !== "object" || Array.isArray(part)) {
    return;
  }

  if (part instanceof FileResult) {
    await part.render({ ...tree });
    return;
  }

  if (part instanceof FileResultArray) {
    await Promise.all(part.results.map((r) => r.render(tree)));
    return;
  }

  const treeMap = part as TreeMap;
  for (const treepath of Object.keys(treeMap)) {
    const treeObject = treeMap[treepath];
    if (treeObject instanceof FileResult) {
      await treeObject.render({ ...tree, ...treeMap });
    } else {
      await processTree(tree, treeObject);
    }
  }
}

function writeTree(
  tree: TreeMap,
  part: TreeNode,
  homePath: string,
  destinationPath: string
): void {
  if (part === null || typeof part !== "object" || Array.isArray(part)) {
    return;
  }

  if (part instanceof FileResult) {
    part.write(homePath, destinationPath);
    return;
  }

  if (part instanceof FileResultArray) {
    part.results.forEach((p) => {
      p.write(homePath, destinationPath);
    });
    return;
  }

  const treeMap = part as TreeMap;
  Object.keys(treeMap).forEach((key) => {
    if (key[0] === "_") {
      return;
    }
    writeTree(tree, treeMap[key], homePath, destinationPath);
  });
}

/**
 * Internal generate function - processors must be set before calling
 */
export async function generateInternal(homePath: string, destinationPath: string): Promise<void> {
  const tree = dirTree(homePath, true);
  if (tree) {
    await processTree(tree, tree);
    writeTree(tree, tree, homePath, destinationPath);
  }
}

/**
 * Simple generate function with auto-discovery and built-in processors
 */
export async function generate(homePath: string, destinationPath: string): Promise<void> {
  // Discover custom processors
  const discoveredPreprocessors = await discoverPreprocessors(homePath);
  const discoveredPostprocessors = await discoverPostprocessors(homePath);
  const discoveredWriters = await discoverWriters(homePath);

  // Merge: discovered (first) → built-ins (last)
  setPreprocessors([...discoveredPreprocessors, ...preprocessors]);
  setPostprocessors([...discoveredPostprocessors, ...postprocessors]);
  setWriters([...discoveredWriters, ...writers]);

  await generateInternal(homePath, destinationPath);
}

export { FileResult } from "./models/FileResult";
export { FileResultArray } from "./models/FileResultArray";
export type * from "./types";
```

**Step 3: Run tests to verify no regression**

Run: `bun test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "refactor: extract generateInternal for builder usage"
```

---

### Task 5: Add Auto-Discovery Integration Test

**Files:**
- Create: `test/src/_processors/preprocessors/uppercaseProcessor.ts`
- Create: `test/src/sample.upper`
- Create: `test/reference/sample.upper`

**Step 1: Create the custom preprocessor**

Create `test/src/_processors/preprocessors/uppercaseProcessor.ts`:

```typescript
import type { Preprocessor } from "../../../../src/types";
import { FileResult } from "../../../../src/models/FileResult";

export const processor: Preprocessor = {
  match: /\.upper$/,
  parse() {
    const contents = this.contents.toString().toUpperCase();
    const result = new FileResult(this.path, this.meta);
    result.contents = contents;
    return result;
  },
};
```

**Step 2: Create test input file**

Create `test/src/sample.upper`:

```
hello world
this should be uppercase
```

**Step 3: Create expected output**

Create `test/reference/sample.upper`:

```
HELLO WORLD
THIS SHOULD BE UPPERCASE
```

**Step 4: Run tests**

Run: `bun test test/jstatico.test.ts`
Expected: 2 tests pass (auto-discovery picks up the custom processor)

**Step 5: Commit**

```bash
git add test/src/_processors test/src/sample.upper test/reference/sample.upper
git commit -m "test: add auto-discovery integration test with uppercase processor"
```

---

### Task 6: Add Builder Integration Tests

**Files:**
- Modify: `test/builder.test.ts`

**Step 1: Add integration tests to builder test file**

Append to `test/builder.test.ts`:

```typescript
import { resolve } from "path";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "fs";

const integrationDir = resolve(import.meta.dir, "./builder-integration");
const outputDir = resolve(import.meta.dir, "./builder-output");

describe("JstaticoBuilder integration", () => {
  beforeAll(() => {
    // Create test fixture
    mkdirSync(`${integrationDir}/_layouts`, { recursive: true });

    writeFileSync(
      `${integrationDir}/_layouts/_base.html`,
      `<html><body>{{ body | safe }}</body></html>`
    );

    writeFileSync(
      `${integrationDir}/test.md`,
      `---
layout: _layouts._base.html
---
# Hello`
    );

    writeFileSync(
      `${integrationDir}/plain.txt`,
      `plain text content`
    );
  });

  afterAll(() => {
    if (existsSync(integrationDir)) {
      rmSync(integrationDir, { recursive: true });
    }
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true });
    }
  });

  beforeEach(() => {
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true });
    }
  });

  test("custom preprocessor runs before built-ins", async () => {
    let preprocessorCalled = false;

    await jstatico(integrationDir, outputDir)
      .addPreprocessor({
        match: /\.md$/,
        parse() {
          preprocessorCalled = true;
          // Return modified content that won't be processed by markdown
          const { FileResult } = require("../src/models/FileResult");
          const result = new FileResult(this.path, {});
          result.contents = "<p>Custom processed</p>";
          (result as any).name = this.name.replace(".md", ".html");
          (result as any).extension = ".html";
          return result;
        },
      })
      .generate();

    expect(preprocessorCalled).toBe(true);
    const content = readFileSync(`${outputDir}/test.html`, "utf8");
    expect(content).toContain("Custom processed");
  });

  test("disableBuiltinPreprocessor skips markdown processing", async () => {
    await jstatico(integrationDir, outputDir)
      .disableBuiltinPreprocessor("markdown")
      .generate();

    // Without markdown processor, .md file is not converted to .html
    expect(existsSync(`${outputDir}/test.html`)).toBe(false);
    expect(existsSync(`${outputDir}/test.md`)).toBe(true);
  });

  test("skipAutoDiscovery ignores _processors directory", async () => {
    // Create a custom processor in the integration dir
    mkdirSync(`${integrationDir}/_processors/preprocessors`, { recursive: true });
    writeFileSync(
      `${integrationDir}/_processors/preprocessors/failing.ts`,
      `throw new Error("Should not be loaded");`
    );

    // Should not throw because we skip auto-discovery
    await jstatico(integrationDir, outputDir)
      .skipAutoDiscovery()
      .generate();

    // Cleanup
    rmSync(`${integrationDir}/_processors`, { recursive: true });
  });
});
```

**Step 2: Add imports at top of file**

Add to imports section of `test/builder.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
```

**Step 3: Run tests**

Run: `bun test test/builder.test.ts`
Expected: All tests pass

**Step 4: Run all tests**

Run: `bun test`
Expected: All tests pass

**Step 5: Commit**

```bash
git add test/builder.test.ts
git commit -m "test: add builder integration tests"
```

---

### Task 7: Update Package Exports

**Files:**
- Modify: `package.json`

**Step 1: Update package.json exports**

Add exports field to `package.json`:

```json
{
  "name": "jstatico",
  "version": "1.0.0",
  "description": "As simple as static web site generation gets.",
  "type": "module",
  "main": "src/index.ts",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    },
    "./builder": {
      "import": "./src/builder.ts",
      "types": "./src/builder.ts"
    }
  },
  "scripts": {
    "test": "bun test",
    "build": "bun run src/cli.ts",
    "typecheck": "tsc --noEmit"
  },
  ...
}
```

**Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: No errors

**Step 3: Run all tests**

Run: `bun test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add package exports for builder module"
```

---

### Task 8: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

**Step 1: Update README.md**

Add custom processors section after Usage:

```markdown
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
```

**Step 2: Update CLAUDE.md**

Add custom processors section:

```markdown
### Custom Processors

Users can add custom processors via:
1. **Auto-discovery**: `_processors/{preprocessors,postprocessors,writers}/` directories
2. **Builder API**: `jstatico(src, dest).addPreprocessor(...).generate()`

Precedence: programmatic → auto-discovered → built-ins
```

**Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: add custom processors documentation"
```

---

### Task 9: Remove TODO Item

**Files:**
- Modify: `README.md`

**Step 1: Remove completed TODO**

Remove or update the TODO section in README.md since "Add support for custom processors and preprocessors" is now complete.

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: remove completed TODO for custom processors"
```

---

### Task 10: Final Verification

**Step 1: Run all tests**

Run: `bun test`
Expected: All tests pass

**Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: No errors

**Step 3: Test CLI still works**

Run: `bun run src/cli.ts test/src test/verify-output && diff -r test/verify-output test/reference`
Expected: No differences

**Step 4: Clean up verification output**

Run: `rm -rf test/verify-output`

**Step 5: Final commit if any uncommitted changes**

Check: `git status`
If clean, done. Otherwise commit remaining changes.
