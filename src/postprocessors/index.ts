import type { Postprocessor } from "../types";
import { htmlProcessor } from "./htmlProcessor";
import { pageGeneratorProcessor } from "./pageGeneratorProcessor";
import { bundleProcessor } from "./bundleProcessor";

// Add names for disabling via builder
const namedHtml: Postprocessor = { ...htmlProcessor, name: "html" };
const namedPageGenerator: Postprocessor = { ...pageGeneratorProcessor, name: "pageGenerator" };
const namedBundle: Postprocessor = { ...bundleProcessor, name: "bundle" };

export const postprocessors: Postprocessor[] = [
  namedHtml,
  namedPageGenerator,
  namedBundle,
];
