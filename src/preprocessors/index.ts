import type { Preprocessor } from "../types";
import { markdownProcessor } from "./markdownProcessor";
import { jsonProcessor } from "./jsonProcessor";

export const preprocessors: Preprocessor[] = [markdownProcessor, jsonProcessor];
