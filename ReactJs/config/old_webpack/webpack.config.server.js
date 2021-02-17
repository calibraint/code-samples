// var fs = require('fs')
var path = require('path')
var ExternalsPlugin = require('webpack-externals-plugin')

module.exports = {

    entry: path.resolve(__dirname, 'server/server.js'),

    output: {
        path: __dirname + '/dist/',
        filename: 'server.bundle.js',
    },

    target: 'node',

    node: {
        __filename: true,
        __dirname: true,
    },

    resolve: {
        extensions: [ '.js', '.jsx' ],
        modules: [
            'client',
            'node_modules',
        ],
    },

    module: {
        rules: [ {
            test: /\.jsx*$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: { plugins: [  'loadable-components/babel' ] },
                query: {
                    presets: [
                        '@babel/preset-react',
                        '@babel/preset-env',
                    ],
                    plugins: [
                        /*[
                                'babel-plugin-webpack-loaders', {
                                    'config': './webpack.config.babel.js',
                                    "verbose": false
                                }
                            ]*/
                    ],
                },
            },
        },
        {
            test: /\.json$/,
            type: 'javascript/auto',
            use: 'json-loader',
        },
        ],
    },
    plugins: [
        new ExternalsPlugin({
            type: 'commonjs',
            include: path.join(__dirname, './node_modules/'),
        }),
    ],
}
