import { readFileSync } from "fs";
import { basename, extname, resolve } from "path";
import type { FileMeta, TreeContext, Preprocessor, Postprocessor, Writer, ProcessResult } from "../types";
import { FileResultArray } from "./FileResultArray";

const TEXT_BASED_EXTENSIONS = [".svg", ".html", ".js", ".md", ".css", ".txt"];

// These will be set by the preprocessors/postprocessors/writers modules
let preprocessors: Preprocessor[] = [];
let postprocessors: Postprocessor[] = [];
let writers: Writer[] = [];

export function setPreprocessors(p: Preprocessor[]): void {
  preprocessors = p;
}

export function setPostprocessors(p: Postprocessor[]): void {
  postprocessors = p;
}

export function setWriters(w: Writer[]): void {
  writers = w;
}

export class FileResult {
  name: string;
  path: string;
  extension: string;
  meta: FileMeta;
  encoding: BufferEncoding | null;
  private _contents: string | Buffer | null = null;
  private _rendered: ProcessResult = null;

  constructor(fileName: string, meta: FileMeta = {}) {
    this.name = basename(fileName);
    this.path = resolve(fileName);
    this.extension = extname(fileName);
    this.meta = meta;
    this.encoding = TEXT_BASED_EXTENSIONS.includes(this.extension) ? "utf8" : null;
  }

  get contents(): string | Buffer {
    if (this._contents !== null) {
      return this._contents;
    }
    try {
      if (this.encoding) {
        const buffer = readFileSync(this.path);
        this._contents = TEXT_BASED_EXTENSIONS.includes(this.extension)
          ? buffer.toString("utf8")
          : buffer;
      } else {
        this._contents = readFileSync(this.path);
      }
      return this._contents;
    } catch {
      return "";
    }
  }

  set contents(value: string | Buffer) {
    this._contents = value;
  }

  get parsed(): FileResult | FileResultArray | Record<string, unknown> {
    const availableProcessors = preprocessors.filter((p) => p.match.test(this.name));
    return availableProcessors.length > 0 ? availableProcessors[0].parse.call(this) : this;
  }

  get rendered(): ProcessResult {
    return this._rendered;
  }

  async render(context: TreeContext): Promise<ProcessResult> {
    const extendedContext: TreeContext = { ...context, file: this };
    const rendered = await this.renderInternal(extendedContext);
    this._rendered = rendered;
    return rendered;
  }

  private async renderInternal(context: TreeContext): Promise<ProcessResult> {
    const availablePostprocessors = postprocessors.filter((p) => p.match.test(this.name));
    if (availablePostprocessors.length === 0) {
      return this;
    }

    const result = await availablePostprocessors[0].process.call(this, context);
    if (result instanceof FileResult) {
      return result.renderInternal(context);
    }
    if (result instanceof FileResultArray) {
      await Promise.all(result.results.map((r) => r.render(context)));
      return result;
    }
    return result;
  }

  write(homePath: string, destinationPath: string): void {
    if (this._rendered instanceof FileResultArray) {
      this._rendered.results.forEach((result) => {
        result.write(homePath, destinationPath);
      });
      return;
    }

    const availableWriters = writers.filter((w) => w.match.test(this.name));
    availableWriters.forEach((writer) => {
      writer.write.call(this, homePath, destinationPath);
    });
  }
}
