const path = require("path");
const DtsBundleWebpack = require("dts-bundle-webpack");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    devtool: false,
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
        filename: "index.js",
        path: path.resolve(__dirname, "build/webpack"),
        library: {
            name: 'typefinity',
            type: 'umd',
        },
        globalObject: 'this',
    },
    plugins: [
        new DtsBundleWebpack({
            name: "@david-04/typefinity",
            main: "build/preprocess/build/library/export.d.ts",
            out: "../../../webpack/index.d.ts",
            externals: false,
            verbose: false,
        }),
        new webpack.SourceMapDevToolPlugin({
            noSources: true,
            filename: "index.js.map",
        }),
    ]
};
