import type { FileResult } from "./models/FileResult";
import type { FileResultArray } from "./models/FileResultArray";

export interface FileMeta {
  layout?: string;
  cleanurl?: boolean;
  title?: string;
  ago?: string;
  time?: string;
  [key: string]: unknown;
}

export interface Preprocessor {
  name?: string;
  match: RegExp;
  parse: (this: FileResult) => FileResult | FileResultArray | Record<string, unknown>;
}

export type ProcessResult = string | FileResult | FileResultArray | null;

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

export interface TreeContext {
  file?: FileResult;
  body?: string;
  meta?: FileMeta;
  [key: string]: unknown;
}

export type TreeNode = FileResult | FileResultArray | TreeMap | null;

export interface TreeMap {
  [key: string]: TreeNode;
}
