const DtsBundleWebpack = require("dts-bundle-webpack"); // NOSONAR
import path from "path";
import webpack from "webpack";

export function configureWebpack(bundleName: string, entryPoint: string) {
    const repositoryRoot = path.normalize(path.resolve(__dirname, "../../../.."));
    const webpackRoot = `${repositoryRoot}/build/webpack`;
    const webpackBundleRoot = `${webpackRoot}/bundles`;
    const webpackTscRoot = `${webpackRoot}/tsc`;
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
        entry: `./build/webpack/src/${entryPoint}`,
        output: {
            filename: `typefinity-${bundleName}.js`,
            path: webpackBundleRoot,
            library: {
                name: "all" === bundleName ? "typefinity" : `typefinity-${bundleName}`,
                type: "umd",
            },
            globalObject: "this",
        },
        plugins: [
            new DtsBundleWebpack({
                name: "all" === bundleName ? "@david-04/typefinity" : `@david-04/typefinity/${bundleName}`,
                main: `${webpackTscRoot}/${entryPoint.replace(/\.ts$/, "")}.d.ts`,
                out: `${webpackBundleRoot}/typefinity-${bundleName}.d.ts`,
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
