const DtsBundleWebpack = require("dts-bundle-webpack"); // NOSONAR
import path from "path";
import webpack from "webpack";

export function configureWebpack(module: "core" | "node" | "web" | "root" | "typefinity-cli") {
    const projectRoot = path.normalize(path.resolve(__dirname, "../../../.."));
    const tscRoot = `${projectRoot}/build/tsc`;
    const webpackRoot = `${projectRoot}/build/webpack`;
    const moduleMain = "root" === module ? "export" : `${module}/export-${module}`;
    const main = "typefinity-cli" === module ? "scripts/typefinity-cli/typefinity-cli" : moduleMain;
    return {
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
        target: "node",
        output: {
            filename: "index.js",
            path: path.resolve(webpackRoot, module),
            library: {
                name: "typefinity",
                type: "umd",
            },
            globalObject: "this",
        },
        plugins: [
            new DtsBundleWebpack({
                name: "root" === module ? "@david-04/typefinity" : `@david-04/typefinity/${module}`,
                main: `${tscRoot}/${main}.d.ts`,
                out: `${webpackRoot}/${module}/index.d.ts`,
                externals: false,
                verbose: false,
            }),
            new webpack.SourceMapDevToolPlugin({
                noSources: true,
                filename: "index.js.map",
            }),
        ]
    };
}
