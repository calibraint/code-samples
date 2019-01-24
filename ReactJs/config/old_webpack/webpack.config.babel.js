var cssModulesIdentName = '[name]__[local]__[hash:base64:5]'
if (process.env.NODE_ENV === 'production') {
    cssModulesIdentName = '[hash:base64]'
}

module.exports = {
    output: {
        publicPath: '/',
        libraryTarget: 'commonjs2',
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
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader?localIdentName=' + cssModulesIdentName + '&modules&importLoaders=1&sourceMap',
                    'postcss-loader',
                ],
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$/i,
                use: 'url-loader?limit=10000',
            },
        ],
    },
}
