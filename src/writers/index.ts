import type { Writer } from "../types";
import { simpleFileWriter } from "./simpleFileWriter";

export const writers: Writer[] = [simpleFileWriter];
