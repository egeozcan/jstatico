import type { Preprocessor } from "../types";
import { markdownProcessor } from "./markdownProcessor";
import { jsonProcessor } from "./jsonProcessor";

// Add names for disabling via builder
const namedMarkdown: Preprocessor = { ...markdownProcessor, name: "markdown" };
const namedJson: Preprocessor = { ...jsonProcessor, name: "json" };

export const preprocessors: Preprocessor[] = [namedMarkdown, namedJson];
