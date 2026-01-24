import type { FileResult } from "./FileResult";

export class FileResultArray {
  results: FileResult[];

  constructor(fileResults: FileResult[]) {
    this.results = fileResults;
  }
}
