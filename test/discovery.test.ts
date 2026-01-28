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
