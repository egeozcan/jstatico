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
