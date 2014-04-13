var fs = require("fs");
var writers = [];
fs.readdirSync(__dirname).forEach(function (file) {
	if (file == "index.js") {
		return;
	}
    writers.push(require('./' + file));
});

module.exports = writers;