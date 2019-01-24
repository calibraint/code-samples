var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');
var cssnano = require('cssnano');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'hidden-source-map',

    entry: {
        app: [
            './client/index.js',
        ],
        vendor: [
            'react',
            'react-dom',
        ]
    },

    output: {
        path: __dirname + '/dist/',
        filename: '[name].[chunkhash].js',
        publicPath: '/',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'client',
            'node_modules',
        ],
    },

    module: {
        rules: [{
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?localIdentName=[hash:base64]&modules&importLoaders=1',
                    'postcss-loader',
                ]
            },
            {
                test: /\.jsx*$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: {
                    loader: 'url-loader?limit=10000'
                }
            },
            {
                test: /\.json$/,
                type: 'javascript/auto',
                use: 'json-loader'
            },
        ],
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: 'assets',
            to: 'assets'
        }]),
        new ExtractTextPlugin('app.[chunkhash].css', {
            allChunks: true
        }),
        new ManifestPlugin({
            basePath: '/',
        }),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest",
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            }
        }),
    ],

};
