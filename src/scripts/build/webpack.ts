const DtsBundleWebpack = require("dts-bundle-webpack"); // NOSONAR
import { normalize, resolve } from "path";
import webpack from "webpack";

//----------------------------------------------------------------------------------------------------------------------
// Directories
//----------------------------------------------------------------------------------------------------------------------

const repositoryRoot = normalize(resolve(__dirname, "../../../.."));
const webpackRoot = `${repositoryRoot}/build/webpack`;

//----------------------------------------------------------------------------------------------------------------------
// Configure all bundles
//----------------------------------------------------------------------------------------------------------------------

module.exports = [
    configureWebpack("core", "bundle-core"),
    configureWebpack("node", "bundle-node"),
    configureWebpack("web", "bundle-web"),
    configureWebpack("all", "bundle-all"),
    configureWebpack("cli", "scripts/typefinity-cli/typefinity-cli"),
];

//----------------------------------------------------------------------------------------------------------------------
// Configure a single bundle
//----------------------------------------------------------------------------------------------------------------------

function configureWebpack(bundleName: string, entryPoint: string) {
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
        entry: `./build/webpack/src/${entryPoint}.ts`,
        output: {
            filename: `typefinity-${bundleName}.js`,
            path: `${webpackRoot}/bundles`,
            library: {
                name: "all" === bundleName ? "typefinity" : `typefinity-${bundleName}`,
                type: "umd",
            },
            globalObject: "this",
        },
        plugins: [
            new DtsBundleWebpack({
                name: "all" === bundleName ? "@david-04/typefinity" : `@david-04/typefinity/${bundleName}`,
                main: `${webpackRoot}/tsc/${entryPoint}.d.ts`,
                out: `${webpackRoot}/bundles/typefinity-${bundleName}.d.ts`,
                externals: false,
                verbose: false,
            }),
            new webpack.SourceMapDevToolPlugin({
                noSources: true,
                filename: `typefinity-${bundleName}.js.map`,
                sourceRoot: `./src`,
            }),
        ]
    };
}
