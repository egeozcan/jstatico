import { marked } from "marked";
import yaml from "js-yaml";
import hljs from "highlight.js";
import { FileResult } from "../models/FileResult";
import type { Preprocessor } from "../types";

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return diffYears === 1 ? "a year ago" : `${diffYears} years ago`;
  }
  if (diffMonths > 0) {
    return diffMonths === 1 ? "a month ago" : `${diffMonths} months ago`;
  }
  if (diffDays > 0) {
    return diffDays === 1 ? "a day ago" : `${diffDays} days ago`;
  }
  return "today";
}

export const markdownProcessor: Preprocessor = {
  match: /\.md$/,
  parse: function (this: FileResult) {
    this.encoding = "utf8";
    const contents = this.contents as string;
    const parts = contents.split(/---$/gm);

    if (parts.length === 1) {
      return this;
    }
    if (parts.length !== 3) {
      throw new Error(`The dash problem (---) @ file: ${this.path}`);
    }

    const parsed = (yaml.load(parts[1]) as Record<string, unknown>) || {};
    const fullName = this.name.split(".")[0].split("-");
    parsed.title = parsed.title || fullName.slice(3).map(capitalizeFirstLetter).join(" ");

    const dateStr = (parsed.time as string) || fullName.slice(0, 3).join("-");
    parsed.ago = formatTimeAgo(new Date(dateStr));

    const newPath = this.path
      .replace(/\.md$/, ".html")
      .replace(fullName.slice(0, 3).join("-") + "-", "");

    const result = new FileResult(newPath, parsed);

    marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
    });

    marked.use({
      renderer: {
        code(token) {
          const { text, lang } = token;
          if (lang && hljs.getLanguage(lang)) {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
          }
          const highlighted = hljs.highlightAuto(text).value;
          return `<pre><code class="hljs">${highlighted}</code></pre>`;
        },
      },
    });

    result.contents = marked.parse(parts[2]) as string;
    return result;
  },
};
