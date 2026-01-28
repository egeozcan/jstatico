import { describe, test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { resolve } from "path";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "fs";
import { jstatico, JstaticoBuilder } from "../src/builder";
import { FileResult } from "../src/models/FileResult";

const integrationDir = resolve(import.meta.dir, "./builder-integration");
const outputDir = resolve(import.meta.dir, "./builder-output");

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
    // Clean up _processors directory if it exists (from skipAutoDiscovery test)
    const processorsDir = `${integrationDir}/_processors`;
    if (existsSync(processorsDir)) {
      rmSync(processorsDir, { recursive: true });
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
          // Create a new FileResult with the correct .html path
          const newPath = this.path.replace(/\.md$/, ".html");
          const result = new FileResult(newPath, {});
          result.contents = "<p>Custom processed</p>";
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
    // and since there's no writer for .md files, it won't be written at all
    expect(existsSync(`${outputDir}/test.html`)).toBe(false);
    // plain.txt should still be written
    expect(existsSync(`${outputDir}/plain.txt`)).toBe(true);
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
  });
});
