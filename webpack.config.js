module.exports = {
    // watchモードを有効にする
    // watch: true,
    entry: "./public/js/app.js",
    output: {
        filename: "bundle.js",
        path: __dirname + '/bundle'
    }
};
