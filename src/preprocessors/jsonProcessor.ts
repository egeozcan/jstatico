import { FileResult } from "../models/FileResult";
import type { Preprocessor } from "../types";

export const jsonProcessor: Preprocessor = {
  match: /^_.+\.json$/,
  parse: function (this: FileResult) {
    this.encoding = "utf8";
    const key = this.name.replace(/^_/, "").replace(/\.json$/, "");
    const contents = this.contents as string;
    return {
      [key]: JSON.parse(contents),
    };
  },
};
