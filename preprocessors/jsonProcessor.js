module.exports = {
	match: /^_.+\.json$/,
	parse: function() {
		this.encoding = "utf8";
        var result = {};
        result[this.name.replace(/^_/, "").replace(/\.json$/, "")] = JSON.parse(this.contents);
        return result;
	}
};