const webpack = require("webpack");
const path = require('path');
const DEV = process.env.NODE_ENV !== 'production';
const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const  ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'resources/js/index.tsx'),
    output: {
        filename: DEV ? 'js/app.js' : 'js/app.[hash].js',
        path: path.resolve(__dirname, 'public')
    },
    mode: DEV ? 'development' : 'production',
    devtool: DEV ? "source-map" : false,
    optimization: {
        minimize: !DEV
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                  // transpileOnly: true // IMPORTANT! use transpileOnly mode to speed-up compilation
                 },
            },
            /*{
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            },*/
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                ]
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
            'react-bootstrap': path.resolve('./node_modules/react-bootstrap'),
            moment: path.resolve('./node_modules/moment'),
            'react-widgets-moment': path.resolve('./node_modules/react-widgets-moment'),
          }
    },
    stats: {
        // suppress "export not found" warnings about re-exported types
        warningsFilter: /export .* was not found in/
    },

    plugins: [
      //  new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin([{ from: 'resources/images', to: 'images' }]),

        //new ExtractTextPlugin(DEV ? 'css/[name].css' : 'css/[name].[hash].css'),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: DEV ? 'css/[name].css' : 'css/[name].[hash].css',
          chunkFilename: DEV ? 'css/[id].css' : 'css/[id].[hash].css',
        }),

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
        }),
        new WebpackNotifierPlugin({ title: 'Evolution Users' })
    ]
};