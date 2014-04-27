var marked = require("marked");
var yaml = require("js-yaml");
var moment = require("moment");

function capitaliseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
	match: /\.md$/,
	parse: function() {
		this.encoding = "utf8";
        var parts = this.contents.split(/---$/gm);
        if(parts.length === 1) {
            return parts[0];
        }
        if(parts.length !== 3) {
            throw new Error("The dash problem (---) @ file: " + this.path);
        }
        var parsed = yaml.safeLoad(parts[1]);
		var fullName = this.name.split(".")[0].split("-");
		parsed.title = parsed.title || fullName.slice(3).map(capitaliseFirstLetter).join(" ");
		parsed.ago = moment(parsed.time || fullName.slice(0,3).join("-")).fromNow();
        var result = new FileResult(this.path.replace(/\.md$/, ".html").replace(fullName.slice(0,3).join("-") + "-", ""), parsed);
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            highlight: function (code) {
                return require('highlight.js').highlightAuto(code).value;
            }
        });
        result._contents = marked(parts[2]);
        return  result;
	}
};