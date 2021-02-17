const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'source-map', //'cheap-module-eval-source-map',

    entry: {
        app: [
            'eventsource-polyfill',
            'webpack-hot-middleware/client',
            'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            './client/index.js',
        ],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        publicPath: 'http://127.0.0.1:8000/',
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },


    resolve: {
        extensions: [ '.js', '.jsx' ],
        modules: [
            'client',
            'node_modules',
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
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
                test: /\.(jpg|svg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.json$/,
                type: 'javascript/auto',
                use: 'json-loader',
            },
        ],
    },

    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new ExtractCssChunks({
            filename: '[name].css',
            chunkFilename: '[name]-[hash:8].css',
            hot: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([ {
            from: 'assets',
            to: 'assets',
        } ]),
    ],

    /*
    postcss: () => [
      postcssFocus(),
      cssnext({
        browsers: ['last 2 versions', 'IE > 10'],
      }),
      postcssReporter({
        clearMessages: true,
      }),
    ],
    */
}
