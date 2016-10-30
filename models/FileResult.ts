const preprocessors = require("../preprocessors");
import { processors as postprocessors } from "../postprocessors";
import writers from "../writers";
import path = require("path");
import fs = require("fs");
import { decode } from "iconv-lite";
const textBased = [".svg", ".html", ".js", ".md", ".css", ".txt"];

interface IFileResultMeta {
}

export type Encoding = "utf8" | "ascii" | "base64" | "binary" | "hex" | "ucs2";

export class FileResultArray {

	results: FileResult[];

	constructor(fileResults: FileResult[]) {
		this.results = fileResults;
	}
}

export default class FileResult {

	name: string;
	path: string;
	extension: string;
	meta: IFileResultMeta;
	encoding: Encoding;
	_rendered: FileResult | FileResultArray | string;
	_contents?: string | Buffer;

	constructor(fileName: string, meta: IFileResultMeta) {
		this.name = path.basename(fileName);
		this.path = path.resolve(fileName);
		this.extension = path.extname(fileName);
		this.meta = meta || {};
		this._rendered = "";
		this.encoding = textBased.indexOf(this.extension) ? "utf8" : "binary";
	}

	contents() {
		if (!!this._contents) {
			return this._contents;
		}
		try {
			let contents: string | Buffer;
			if (!this.encoding) {
				contents = fs.readFileSync(this.path, this.encoding);
			} else {
				let buffer = fs.readFileSync(this.path);
				contents = textBased.indexOf(this.extension) >= 0 ? decode(buffer, "utf8") : buffer;
			}
			this._contents = contents;
			return contents;
		} catch (e) {
			return "";
		}
	}

	parsed() {
		let self = this;
		let availableProcessors = preprocessors.filter(function(p) { return p.match.test(self.name); });
		return availableProcessors.length > 0 ? availableProcessors[0].parse.call(self) : self;
	}

	rendered() {
		return this._rendered;
	}

	render(context: any) {
		context = Object.assign({}, context, { file: this });
		let rendered = render(this, context);
		this._rendered = rendered;
		return rendered;
	}

	write(sourcePath: string, destinationPath: string) {
		let self = this;
		if (this._rendered instanceof FileResultArray) {
			this._rendered.results.forEach(function(result) {
				result.write(sourcePath, destinationPath);
			});
			return;
		}
		let availableWriters = writers.filter(function(w) { return w.match.test(self.name); });
		let writeOperations = availableWriters.map(function(writer) {
			return writer.write(self, sourcePath, destinationPath);
		});
	}
}


function render(file: FileResult | FileResultArray, context: any): FileResult | FileResultArray {
	if (file instanceof FileResultArray) {
		file.results.forEach(function(s) {
			s.render(context);
		});
		return file;
	}
	let availablePostprocessors = postprocessors.filter(function(p) { return p.match.test(file.name); });
	if (availablePostprocessors.length === 0) {
		return file;
	}
	return render(availablePostprocessors[0].process.call(file, context), context);
}

module.exports = FileResult;