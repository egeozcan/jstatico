module.exports = {
    match: /^.+\.processor\.js$/,
    process: function(context) {
        var fn = require(this.path);
        return fn.call(this, context);
    }
};