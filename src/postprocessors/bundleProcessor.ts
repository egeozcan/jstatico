import type { Postprocessor } from "../types";

export const bundleProcessor: Postprocessor = {
  match: /^.+?\.bundle$/,
  process: function () {
    return null;
  },
};
