var path = require('path'),
    dirTree = require("../dirTree"),
    exec = require('child_process').exec,
    command = "diff -r ./reference ./output";
	
var homePath = path.resolve("./src");
var destinationPath = path.resolve("./output");

dirTree(homePath, destinationPath);

exec(command, function (error, stdout, stderr) {
	if (error !== null) {
		console.log("Some errors:")
		console.log(stdout);
		return;
	}
	if (stdout.length === 0) {
		console.log("All seems to be ok.")
	}
	console.error(stdout);
})
