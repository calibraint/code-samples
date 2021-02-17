const postcssFocus = require('postcss-focus');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');
const postcssReporter = require('postcss-reporter');

module.exports = {
    plugins: [
        postcssReporter({
            clearMessages: true,
        }),
        postcssFocus(),
        postcssPresetEnv({
            browsers: ['last 2 versions', 'IE > 10'],
        }),
        cssNano(),
    ],
};
