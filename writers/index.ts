import fs = require("fs");
import { IWriter } from "./IWriter";
const writers: IWriter[] = [];

fs.readdirSync(__dirname).forEach(function (file) {
	if (file == "index.js") {
		return;
	}
    writers.push(<IWriter>require('./' + file));
});

export default writers;