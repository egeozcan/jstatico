import { writeFileSync, mkdirSync } from "fs";
import { relative, join, dirname } from "path";
import { FileResult } from "../models/FileResult";
import type { Writer } from "../types";

const BINARY_EXTENSIONS = [".jpg", ".jpeg", ".gif", ".png", ".webp", ".ico", ".pdf", ".woff", ".woff2", ".ttf", ".eot"];

export const simpleFileWriter: Writer = {
  match: /^[^_](.+)?\.(jpg|jpeg|gif|png|webp|svg|ico|json|txt|html|css|pdf|xml|woff|woff2|ttf|eot)$/,
  write: function (this: FileResult, homePath: string, destinationPath: string) {
    const filePath = relative(homePath, this.path);
    const target = join(destinationPath, filePath);

    mkdirSync(dirname(target), { recursive: true });

    const isBinary = BINARY_EXTENSIONS.includes(this.extension);

    if (isBinary) {
      // Write binary files directly from contents buffer
      writeFileSync(target, this.contents);
    } else {
      // Write text files (possibly rendered)
      const content =
        this.rendered instanceof FileResult ? this.contents : (this.rendered as string);
      writeFileSync(target, content);
    }
  },
};
