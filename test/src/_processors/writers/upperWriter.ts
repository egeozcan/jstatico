import { writeFileSync, mkdirSync } from "fs";
import { relative, join, dirname } from "path";
import type { Writer } from "../../../../src/types";
import { FileResult } from "../../../../src/models/FileResult";

export const writer: Writer = {
  match: /\.upper$/,
  write: function (this: FileResult, homePath: string, destinationPath: string) {
    const filePath = relative(homePath, this.path);
    const target = join(destinationPath, filePath);

    mkdirSync(dirname(target), { recursive: true });

    const content =
      this.rendered instanceof FileResult ? this.contents : (this.rendered as string);

    writeFileSync(target, content);
  },
};
