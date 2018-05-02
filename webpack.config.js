var webpack = require("webpack");
var path = require('path');
var DEV = process.env.NODE_ENV !== 'production';
var WebpackNotifierPlugin = require('webpack-notifier');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin')


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
                            ],
                            sourceMap: true
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
                loader: 'url-loader',
                query: {
                    limit: 28192
                }
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                query: {
                    name: 'fonts/[name].[ext]',
                    publicPath: '../'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
          new CopyWebpackPlugin([{ from: 'resources/images', to: 'images' }]),

        new WebpackNotifierPlugin({ title: 'Evolution Users' }),
        new ExtractTextPlugin('css/[name].css'),
        DEV ? function(){} : new webpack.optimize.UglifyJsPlugin(),

        // Using define pluggin makes sure we are using the production build
        // of React when we build for production.
        new webpack.DefinePlugin({
            __DEV__: DEV,
            __SERVER__: false,
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ]
};