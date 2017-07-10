var webpack = require("webpack");
var path = require('path');
var DEV = process.env.NODE_ENV !== 'production';
var WebpackNotifierPlugin = require('webpack-notifier');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: path.resolve(__dirname, 'resources/js/index.tsx'),
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, 'public')
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
            },
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({use: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]})
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 28192
                        }
                    }
                ]
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                // loader: 'file-loader?name=[name].[ext]&outputPath=./fonts/'
                loader: "file-loader?name=../fonts/[name].[ext]"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new WebpackNotifierPlugin({ title: 'Evolution Users' }),
        new ExtractTextPlugin('css/[name].css'),
        !DEV ? new webpack.optimize.UglifyJsPlugin() : function(){}
    ]
};