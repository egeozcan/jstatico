import { resolve, join } from "path";
import { describe, test, expect, beforeAll } from "bun:test";
import { readdirSync, readFileSync, statSync, rmSync, existsSync } from "fs";
import { generate } from "../src/index";

const homePath = resolve(import.meta.dir, "./src");
const refPath = resolve(import.meta.dir, "./reference");
const destinationPath = resolve(import.meta.dir, "./output");

function getAllFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

describe("jstatico", () => {
  beforeAll(async () => {
    // Clean output directory if it exists
    if (existsSync(destinationPath)) {
      rmSync(destinationPath, { recursive: true });
    }

    // Generate the site
    await generate(homePath, destinationPath);
  });

  test("generates expected output files", () => {
    const refFiles = getAllFiles(refPath);
    const outFiles = getAllFiles(destinationPath);

    // Compare number of files
    const refRelative = refFiles.map((f) => f.replace(refPath, "")).sort();
    const outRelative = outFiles.map((f) => f.replace(destinationPath, "")).sort();

    expect(outRelative).toEqual(refRelative);
  });

  test("generated files match reference content", () => {
    const refFiles = getAllFiles(refPath);

    for (const refFile of refFiles) {
      const relativePath = refFile.replace(refPath, "");
      const outFile = join(destinationPath, relativePath);

      const refContent = readFileSync(refFile, "utf8");
      const outContent = readFileSync(outFile, "utf8");

      expect(outContent).toBe(refContent);
    }
  });
});
