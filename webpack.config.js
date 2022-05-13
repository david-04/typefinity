const path = require("path");

module.exports = {
    entry: "./src/library/typefinity.ts",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "typefinity.js",
        path: path.resolve(__dirname, "build/webpack"),
    },
};
