var nj = require("nunjucks");
var path = require("path");
var minify = require("html-minifier").minify;

function TemplateLoader(opts) {
    this.context = opts.context;
}

TemplateLoader.prototype.getSource = function(name) {
    var result = this.context;
    var unresolved = '';
    name.replace(/[\/\\]/g, ".").split('.').forEach(function(p) {
        if(!!unresolved) {
            p = unresolved + "." + p;
        }
        if(!!result[p]) {
            result = result[p];
            unresolved = '';
            return;
        }
        unresolved = p;
    });
    if(!!unresolved) {
        throw new Error("Unresolved: " + unresolved);
    }
    var contents = result instanceof FileResult ? { src : result.contents, path: result.path } : result;
    return  contents;
};

module.exports = {
    match: /^[^_](.+)?\.html$/,
    process: function(context) {
        this.encoding = "utf8";
        var loader = new TemplateLoader({ context: context });
        var env = new nj.Environment(loader);
        var src = !!this.meta.layout ? loader.getSource(this.meta.layout) : this.contents;
	    if (!!this.meta.cleanurl) {
		    this.path = path.join(path.dirname(this.path), path.basename(this.path, ".html"), "index.html");
	    }
        context.body = this.contents;
	    context.meta = this.meta;
        try {
	        var rendered = env.renderString(!!src.src ? src.src : src, context);
	        return minify(rendered, { caseSensitive: true, removeComments: true, collapseWhitespace: true, useShortDoctype: true, minifyJS: true });
        } catch(e) {
            throw e;
        }
    }
};