import { writeFileSync, mkdirSync } from "fs";
import { relative, join, dirname } from "path";
import { FileResult } from "../models/FileResult";
import type { Writer } from "../types";

export const simpleFileWriter: Writer = {
  match: /^[^_](.+)?\.(jpg|gif|json|txt|html|css)$/,
  write: function (this: FileResult, homePath: string, destinationPath: string) {
    const filePath = relative(homePath, this.path);
    const target = join(destinationPath, filePath);

    mkdirSync(dirname(target), { recursive: true });
    this.encoding = "utf8";

    const content =
      this.rendered instanceof FileResult ? this.contents : (this.rendered as string);

    writeFileSync(target, content);
  },
};
