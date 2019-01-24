const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const resolvePath = path => require('path').resolve(__dirname, path)
const Dotenv = require('dotenv-webpack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const webpack = require('webpack')

const webpackClientConfig = smp.wrap({
    name: 'client', // Used by webpack-hot-server-middleware
    mode: 'development',
    target: 'web',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        resolvePath(
            '../../client/index.js',
        ),
    ],
    output: {
        filename: 'dev-[name].js',
        chunkFilename: 'dev-[name].js',
        path: resolvePath('../../bootstrap/client-build'),
        publicPath: '/',
    },
    devtool: "#eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            "@babel/preset-env", {
                                "modules": false,
                                "targets": { "browsers": [ "last 2 versions", "IE > 10" ] },
                            },
                        ],
                        "@babel/preset-react",
                    ],
                    plugins: [
                        "universal-import",
                        "react-hot-loader/babel",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-proposal-object-rest-spread",
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
    optimization: {
        runtimeChunk: {
            name: 'bootstrap',
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractCssChunks({
            filename: 'dev-[name].css',
            chunkFilename: 'dev-[name]-[hash:8].css',
            hot: true,
        }),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new Dotenv({
            path: './.env.development',
            safe: true
        })
    ],
    resolve: {
        extensions: [ '.js' ],
        modules: [ resolvePath('../../client'), 'node_modules' ],
    },
})

module.exports = webpackClientConfig