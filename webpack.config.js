var webpack = require('webpack');
module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    }
};