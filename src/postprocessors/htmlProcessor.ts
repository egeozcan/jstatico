import nunjucks from "nunjucks";
import { join, dirname, basename } from "path";
import { minify } from "html-minifier-terser";
import { FileResult } from "../models/FileResult";
import type { TreeContext, Postprocessor } from "../types";

interface TemplateSource {
  src: string;
  path: string;
  noCache: boolean;
}

class TemplateLoader {
  private context: TreeContext;

  constructor(opts: { context: TreeContext }) {
    this.context = opts.context;
  }

  getSource(name: string): TemplateSource {
    let result: unknown = this.context;
    let unresolved = "";

    const parts = name.replace(/[\/\\]/g, ".").split(".");
    for (const p of parts) {
      let key = p;
      if (unresolved) {
        key = unresolved + "." + p;
      }

      const current = result as Record<string, unknown>;
      if (current && current[key] !== undefined) {
        result = current[key];
        unresolved = "";
        continue;
      }
      unresolved = key;
    }

    if (unresolved) {
      throw new Error(`Unresolved: ${unresolved}`);
    }

    if (result instanceof FileResult) {
      return { src: result.contents as string, path: result.path, noCache: false };
    }

    const source = result as { src: string; path: string };
    return { ...source, noCache: false };
  }
}

export const htmlProcessor: Postprocessor = {
  match: /^[^_](.+)?\.html$/,
  process: async function (this: FileResult, context: TreeContext): Promise<string> {
    this.encoding = "utf8";
    const loader = new TemplateLoader({ context });
    const env = new nunjucks.Environment(loader as unknown as nunjucks.ILoader, {
      autoescape: false,
    });

    let src: string | TemplateSource;
    if (this.meta.layout) {
      src = loader.getSource(this.meta.layout);
    } else {
      src = this.contents as string;
    }

    if (this.meta.cleanurl) {
      this.path = join(dirname(this.path), basename(this.path, ".html"), "index.html");
    }

    context.body = this.contents as string;
    context.meta = this.meta;

    const template = typeof src === "string" ? src : src.src;
    const rendered = env.renderString(template, context);

    return minify(rendered, {
      caseSensitive: true,
      removeComments: true,
      collapseWhitespace: true,
      useShortDoctype: true,
      minifyJS: true,
    });
  },
};
