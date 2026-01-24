import { FileResult } from "../models/FileResult";
import type { Postprocessor, TreeContext } from "../types";
import type { FileResultArray } from "../models/FileResultArray";

export const pageGeneratorProcessor: Postprocessor = {
  match: /^.+\.processor\.js$/,
  process: function (this: FileResult, context: TreeContext) {
    // Dynamic import for custom processor files
    const fn = require(this.path) as (
      this: FileResult,
      context: TreeContext
    ) => string | FileResult | FileResultArray | null;
    return fn.call(this, context);
  },
};
