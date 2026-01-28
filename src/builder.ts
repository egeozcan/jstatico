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
  private clearPreprocessorsFlag = false;
  private clearPostprocessorsFlag = false;
  private clearWritersFlag = false;
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
    this.clearPreprocessorsFlag = true;
    return this;
  }

  clearBuiltinPostprocessors(): this {
    this.clearPostprocessorsFlag = true;
    return this;
  }

  clearBuiltinWriters(): this {
    this.clearWritersFlag = true;
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
    const filteredPreprocessors = this.clearPreprocessorsFlag
      ? []
      : builtinPreprocessors.filter((p) => !p.name || !this.disabledPreprocessors.has(p.name));

    const filteredPostprocessors = this.clearPostprocessorsFlag
      ? []
      : builtinPostprocessors.filter((p) => !p.name || !this.disabledPostprocessors.has(p.name));

    const filteredWriters = this.clearWritersFlag
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

    // Merge: custom (first) -> discovered -> built-ins (last)
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
