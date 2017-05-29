module.exports = {
    // watchモードを有効にする
    // watch: true,
    entry: "./dest/script.js",
    output: {
        filename: "bundle.js",
        path: __dirname + '/bundle'
    }
};
