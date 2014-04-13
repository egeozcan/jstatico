var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

module.exports = {
    match: /^[^_](.+)?\.(jpg|gif|json|txt|html|css)$/,
    write: function(homePath, destinationPath) {
        var filePath = path.relative(homePath, this.path);
        var target = path.join(destinationPath, filePath);
        mkdirp.sync(path.dirname(target));
        this.encoding = "utf8";
        fs.writeFileSync(target, this.rendered instanceof FileResult ? this.contents : this.rendered);
    }
};