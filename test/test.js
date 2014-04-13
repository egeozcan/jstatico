var path = require('path')
var homePath = path.resolve(__dirname, "./src");
var refPath = path.resolve(__dirname, "./reference");
var destinationPath = path.resolve(__dirname, "./output");

var dirTree = require("../dirTree"),
    exec = require('child_process').exec,
    command = "diff -r " + refPath + " " + destinationPath;

dirTree(homePath, destinationPath);

exec(command, function (error, stdout, stderr) {
	if (error !== null) {
		console.log("Changes:");
		console.log(stdout || "none");
		console.log("---");
		console.log("Errors:");
		console.log(stderr || "none");
		return;
	}
	if (stdout.length === 0) {
		console.log("All seems to be ok.")
	}
	console.error(stdout);
})
