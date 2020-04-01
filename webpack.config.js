const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // file to dependencies to bundle together
    entry: [
        'babel-polyfill',
        './src/js/index.js'
    ],
    // output property and where to save
    output: {
        // absolute path - needs node module 'path'
        // __dirname is the current directory
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // test all the js files that end with js
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};