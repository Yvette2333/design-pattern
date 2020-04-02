const path = require("path");
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './release/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_module)/,
        loader: 'babel-loader',
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './release'),
    open: true,
    port: 9000,
  }
}