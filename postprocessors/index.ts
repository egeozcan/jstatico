const fs = require("fs");

interface Preprocessor {
	match: RegExp;
	process: (context: any) => string;
}

export const processors: Preprocessor[] = [];

(<string[]>fs.readdirSync(__dirname)).forEach(function (file: string) {
	if (file === "index.js") {
		return;
	}
    processors.push(<Preprocessor>require('./' + file));
});
