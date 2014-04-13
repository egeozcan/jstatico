#!/usr/bin/env node

var path = require('path'),
    dirTree = require("./dirTree");

var homePath = path.resolve(process.argv[2] || "./test/sample");
var destinationPath = path.resolve(process.argv[3] || "./test/output");

dirTree(homePath, destinationPath);