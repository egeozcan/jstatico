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
