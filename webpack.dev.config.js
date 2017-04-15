'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config');

const WebpackBrowserPlugin = require('webpack-browser-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// https://webpack.github.io/docs/configuration.html
module.exports = merge(config, {
  //verbose: true,
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: 'true'
    }),
    new CopyWebpackPlugin([
      { from: 'public/config.json', to: 'config.json' }
    ])/*,
    new WebpackBrowserPlugin({
      browser: 'Chrome'
    })*/
  ],
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    //contentBase: "dist/",
    noInfo: true,
    overlay: true,
    port: 8080,
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 2 version'
            }
          }
        ]
      }
    ]
  }
});
