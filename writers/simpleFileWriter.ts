import fs = require("fs");
import path = require("path");
import mkdirp = require("mkdirp");
import { IWriter } from "./IWriter";
import FileResult from "../models/FileResult"

const writer: IWriter = {
    match: /^[^_](.+)?\.(jpg|gif|json|txt|html|css)$/,
    write: function(self, homePath, destinationPath) {
        var filePath = path.relative(homePath, self.path);
        var target = path.join(destinationPath, filePath);
        mkdirp.sync(path.dirname(target));
        self.encoding = "utf8";
        return new Promise((res, rej) => {
            fs.writeFile(target, self.rendered instanceof FileResult ? self.contents : self.rendered, (err) => {
                if(err) {
                    rej(err);
                }
                res();
            });
        });
    }
};

export default writer;