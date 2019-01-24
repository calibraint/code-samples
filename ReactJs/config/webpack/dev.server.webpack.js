const path = require('path')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()

const resolvePath = _path => path.resolve(__dirname, _path)

const webpack = require('webpack')


const webpackServerConfig = smp.wrap({
    name: 'server', // Used by webpack-hot-server-middleware
    mode: 'development',
    target: 'node',
    entry: resolvePath('../../server/entry.js'),
    output: {
        filename: 'dev.server.js',
        libraryTarget: 'commonjs2',
        path: resolvePath('../../bootstrap/server-build'),
    },
    devtool: "#eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        "universal-import",
                        "react-hot-loader/babel",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-proposal-object-rest-spread",
                    ],
                    presets: [
                        [
                            "@babel/preset-env", {
                                "modules": false,
                                "targets": { "browsers": [ "last 2 versions", "IE > 10" ] },
                            },
                        ],
                        "@babel/preset-react",
                    ],
                },
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: 'dev-[name]__[local]--[hash:base64:5]',
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                    /*{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							ident: 'postcss',
						},
					},*/
                ],
            },
            {
                test: /\.(gif|ico|jpg|png|svg)$/,
                loader: 'url-loader',
            },
        ],
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new ExtractCssChunks({
            filename: 'dev-[name].css',
            chunkFilename: 'dev-[name]-[hash:8].css',
            hot: true,
        }),
        new Dotenv({
            path: './.env.development',
            safe: true
        })
    ],
    resolve: {
        extensions: [ '.js' ],
        modules: [
            resolvePath('../../server'),
            resolvePath('../../client'),
            'node_modules',
        ],
    },
    externals: [ nodeExternals({
        whitelist: [
            /babel-plugin-universal-import|react-universal-component/,
        ],
    }) ],
})

module.exports = webpackServerConfig