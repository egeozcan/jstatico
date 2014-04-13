var preprocessors = require('../preprocessors'),
	postprocessors = require('../postprocessors'),
	writers = require('../writers'),
	path = require('path'),
	fs = require('fs'),
	extend = require('node.extend'),
	iconv = require('iconv-lite'),
	textBased = [".svg", ".html", ".js", ".md", ".css", ".txt"];

function FileResult(fileName, meta) {
    this.name = path.basename(fileName);
    this.path = path.resolve(fileName);
    this.extension = path.extname(fileName);
    this.meta = meta || {};
    this._rendered = "";
	this.encoding = textBased.indexOf(this.extension) ? "utf8" : null;
}

Object.defineProperty(FileResult.prototype, "contents", {
    get: function() {
        if(!!this._contents) {
            return this._contents;
        }
        try {
	        var contents;
	        if (!this.encoding) {
		        contents = fs.readFileSync(this.path, { encoding: this.encoding });
	        } else {
		        var buffer = fs.readFileSync(this.path);
		        contents = textBased.indexOf(this.extension) >= 0 ? iconv.decode(buffer) : buffer;
	        }
	        this._contents = contents;
	        return contents;
        } catch(e) {
            return "";
        }
    },
    configurable: true
});

Object.defineProperty(FileResult.prototype, "parsed", {
    get: function() {
        var self = this;
        var availableProcessors = preprocessors.filter(function(p) { return p.match.test(self.name); });
        return availableProcessors.length > 0 ? availableProcessors[0].parse.call(self) : self;
    }
});

Object.defineProperty(FileResult.prototype, "rendered", {
    get: function() {
        return this._rendered;
    }
});

function render(self, context) {
    if(self instanceof FileResultArray) {
        self.results.forEach(function(s) {
            s.render(context);
        });
	    return self;
    }
    if(!(self instanceof FileResult)) {
        return self;
    }
    var availablePostprocessors = postprocessors.filter(function(p) { return p.match.test(self.name); });
    if (availablePostprocessors.length === 0) {
        return self;
    }
    return render(availablePostprocessors[0].process.call(self, context), context);
}

Object.defineProperty(FileResult.prototype, "render", {
    value: function(context) {
        context = extend({}, context, { file: this });
        var rendered = render(this, context);
        this._rendered = rendered;
        return rendered;
    }
});

Object.defineProperty(FileResult.prototype, "write", {
    value: function writeFileResult(homePath, destinationPath) {
        var self = this;
	    if (this._rendered instanceof FileResultArray) {
		    this._rendered.results.forEach(function(result) {
			    result.write(homePath, destinationPath);
		    });
		    return;
	    }
        var availableWriters = writers.filter(function(w) { return w.match.test(self.name); });
        availableWriters.forEach(function(writer) {
            writer.write.call(self, homePath, destinationPath);
        });
    }
});

module.exports = FileResult;