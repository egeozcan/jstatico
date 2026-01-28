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
