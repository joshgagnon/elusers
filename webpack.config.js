const webpack = require("webpack");
const path = require('path');
const DEV = process.env.NODE_ENV !== 'production';
const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'resources/js/index.tsx'),
    output: {
        filename: DEV ? 'js/app.js' : 'js/app.[hash].js',
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
        extensions: ['.ts', '.tsx', '.js', '.json'],
          alias: {
            react: path.resolve('./node_modules/react'),
            redux: path.resolve('./node_modules/redux'),
            'react-redux': path.resolve('./node_modules/react-redux'),
            'react-widgets': path.resolve('./node_modules/react-widgets'),
            moment: path.resolve('./node_modules/moment'),
            'react-widgets-moment': path.resolve('./node_modules/react-widgets-moment'),
          }
    },
    plugins: [
          new CopyWebpackPlugin([{ from: 'resources/images', to: 'images' }]),

        new WebpackNotifierPlugin({ title: 'Evolution Users' }),
        new ExtractTextPlugin(DEV ? 'css/[name].css' : 'css/[name].[hash].css'),
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
        new ManifestPlugin({
            fileName: 'mix-manifest.json',
            basePath: '/'
        })
    ]
};