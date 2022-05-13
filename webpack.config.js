const path = require("path");
const DtsBundleWebpack = require("dts-bundle-webpack");
const webpack = require("webpack");

module.exports = {
    entry: "./src/library/typefinity.ts",
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
        filename: "typefinity.js",
        path: path.resolve(__dirname, "build/webpack"),
    },
    plugins: [
        new DtsBundleWebpack({
            name: "typefinity",
            main: "build/tsc/library/typefinity.d.ts",
            out: "../../webpack/typefinity.d.ts",
            externals: false,
            verbose: false,
        }),
        new webpack.SourceMapDevToolPlugin({
            noSources: true,
            filename: "typefinity.js.map.tmp",
            append: "\n//# sourceMappingURL=typefinity.js.map\n",
        }),
    ],
};
