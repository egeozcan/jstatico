var postsPerPage = 5;

module.exports = function(ctx) {
    var self = this;
    var pages = Object.keys(ctx.post)
        .reduceRight(function (prev, cur) {
            var latest = prev[prev.length - 1];
            if (latest.length === postsPerPage) {
                latest = [];
                prev.push(latest);
            }
            latest.push(ctx.post[cur]);
            return prev;
        }, [[]])
        .map(function (postArray, index, postArrays) {
            var path = self.path.replace(self.name, (index === 0 ? "index" : index + 1) + ".html");
            var result = new FileResult(path, {
                posts: postArray,
                pages: postArrays.map(function(v, i) { return i+1; }),
                currentPage: index + 1,
                cleanurl: index !== 0
            });
            result._contents = ctx._layouts["_posts.html"].contents;
            return result;
        });
    return new FileResultArray(pages);
};