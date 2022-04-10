const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.pug'),
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader', // https://github.com/webdiscus/pug-loader#install-and-quick-start
      },
      {
        test: /\.(css$|scss$)/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },

  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(path.resolve()),
    },
    hot: true,
    open: true,
    compress: true,
    port: 8080,
  },

};