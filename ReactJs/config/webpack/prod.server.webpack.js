const path = require('path')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const Dotenv = require('dotenv-webpack')


const resolvePath = _path => path.resolve(__dirname, _path)

const webpack = require('webpack')

const webpackServerConfig = {
    name: 'server', // Used by webpack-hot-server-middleware
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    entry: resolvePath('../../server/entry.js'),
    output: {
        filename: 'prod.server.js',
        libraryTarget: 'commonjs2',
        path: resolvePath('../../bootstrap/server-build'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        "universal-import",
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
                            localIdentName: 'prod-[name]__[local]--[hash:base64:5]',
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
        new ExtractCssChunks({
            filename: 'prod-[name].css',
            chunkFilename: 'prod-[name]-[hash:8].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new Dotenv({
            path: './.env.production',
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
}

module.exports = webpackServerConfig