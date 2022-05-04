/* eslint-disable no-underscore-dangle */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
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
      directory: path.join(path.resolve(), 'dist'),
    },
    open: true,
    compress: true,
    port: 8080,
  },
};
