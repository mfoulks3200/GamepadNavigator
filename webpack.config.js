const webpack = require('webpack');
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.BUILD_MODE || "development",
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "GamepadNavigator.Bundle.js",
        clean: true
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /\.css$/,
                loader: "css-loader",
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                    to: "manifest.json",
                    force: true,
                    // The `content` argument is a [`Buffer`](https://nodejs.org/api/buffer.html) object, it could be converted to a `String` to be processed using `content.toString()`
                    // The `absoluteFrom` argument is a `String`, it is absolute path from where the file is being copied
                    transform(content, absoluteFrom) {
                        let manifest = JSON.parse(content.toString());
                        manifest.version = `${manifest.version}.${new Date().getUTCFullYear().toString().substr(2)}${new Date().getUTCMonth().toString().padStart(2, '0')}.${new Date().getUTCDate().toString().padStart(2, '0')}${new Date().getUTCHours().toString().padStart(2, '0')}`
                        return JSON.stringify(manifest, null, 4);
                    },
                },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: "graphics/exports/",
                    from: "Logo-Mark*.png",
                    to: "assets/images/icons"
                },
            ],
        })
    ],
}
