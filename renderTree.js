#!/usr/bin/env node

var path = require('path'),
    dirTree = require("./dirTree");

var homePath = path.resolve(process.argv[2] || "./");
var destinationPath = path.resolve(process.argv[3] || "../output");

dirTree(homePath, destinationPath);