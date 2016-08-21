var webpack = require('webpack');
module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        })
    ]
};