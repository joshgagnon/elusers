var webpack = require("webpack");
var path = require('path');
var DEV = process.env.NODE_ENV !== 'production';
var WebpackNotifierPlugin = require('webpack-notifier');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'resources/js/index.tsx'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/js')

    },
    devtool: DEV ? "source-map" : false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new WebpackNotifierPlugin({ title: 'Evolution Users' }),
        !DEV ? new webpack.optimize.UglifyJsPlugin() : function(){}
    ]
};