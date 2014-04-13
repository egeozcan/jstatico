var fs = require('fs'),
    path = require('path'),
    extend = require('node.extend');

global.FileResult = require('./models/FileResult');
global.FileResultArray = require('./models/FileResultArray');

function dirTree(filename, isParent) {
    var stats = fs.lstatSync(filename),
		isDirectory = stats.isDirectory(),
		fileName = path.basename(filename);
	if((stats.size === 0 && !isDirectory) || filename[0] === ".") {
		return null;
	}
    if (isDirectory) {
        var map = fs.readdirSync(filename)
            .map(function (child) {
                return dirTree(filename + '/' + child);
            })
            .filter(function (f) {
                return f !== null;
            })
            .reduce(function (obj, cur) {
                if (cur instanceof FileResult) {
                    obj[cur.name] = cur;
                    return obj;
                }
                if(cur instanceof FileResultArray) {
	                cur.results.forEach(function(c) {
		                obj[c.name] = c;
	                });
                }
                for (var prop in cur) {
                    if (cur.hasOwnProperty(prop)) {
                        obj[prop] = cur[prop];
                    }
                }
                return obj;
            }, {});
        if(isParent) {
            return map;
        }
        var info = {};
        info[fileName] = map;
		return info;
    }
	return new FileResult(filename).parsed;
}

function processTree(tree, part) {
    if (part === null || typeof part !== "object" || Array.isArray(part)) {
        return;
    }
    Object.keys(part).forEach(function (treepath) {
        var treeObject = part[treepath];
        if (treeObject instanceof FileResult) {
            treeObject.render(extend({}, tree, part));
            return;
        }
        processTree(tree, treeObject);
    });
}

function writeTree(tree, part, homePath, destinationPath) {
    if (part === null || typeof part !== "object" || Array.isArray(part)) {
        return;
	}
	if (part instanceof FileResult) {
        part.write(homePath, destinationPath);
		return;
	}
	if (part instanceof FileResultArray) {
        part.results.forEach(function(p) {
            p.write(homePath, destinationPath);
        });
        return;
    }
	Object.keys(part).forEach(function (key) {
        if(key[0] === "_") {
            return;
        }
		writeTree(tree, part[key], homePath, destinationPath);
	});
}

module.exports = function(homePath, destinationPath) {
    global.homePath = homePath;
    global.destinationPath = destinationPath;
    var tree = dirTree(homePath, true);
    processTree(tree, tree);
    writeTree(tree, tree, homePath, destinationPath);
};