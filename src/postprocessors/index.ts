import type { Postprocessor } from "../types";
import { htmlProcessor } from "./htmlProcessor";
import { pageGeneratorProcessor } from "./pageGeneratorProcessor";
import { bundleProcessor } from "./bundleProcessor";

export const postprocessors: Postprocessor[] = [
  htmlProcessor,
  pageGeneratorProcessor,
  bundleProcessor,
];
