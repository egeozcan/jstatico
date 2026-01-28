import type { Writer } from "../types";
import { simpleFileWriter } from "./simpleFileWriter";

// Add names for disabling via builder
const namedSimple: Writer = { ...simpleFileWriter, name: "simple" };

export const writers: Writer[] = [namedSimple];
