var fs = require("fs");
var processors = [];
fs.readdirSync(__dirname).forEach(function (file) {
	if (file == "index.js") {
		return;
	}
    processors.push(require('./' + file));
});

module.exports = processors;