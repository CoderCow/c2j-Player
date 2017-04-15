'use strict';

const path = require('path');
const merge = require('webpack-merge');

const webpack = require('webpack');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// https://webpack.github.io/docs/configuration.html
module.exports = merge(require('./webpack.config'), {
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public/config.release.json', to: 'config.json' }
    ]),
    new UglifyJsPlugin({
      // beautify: true, //debug
      // mangle: false, //debug
      // dead_code: false, //debug
      // unused: false, //debug
      // deadCode: false, //debug
      // compress: {
      //   screw_ie8: true,
      //   keep_fnames: true,
      //   drop_debugger: false,
      //   dead_code: false,
      //   unused: false
      // }, // debug
      // comments: true, //debug

      beautify: false,
      mangle: { screw_ie8 : true },
      compress: { screw_ie8: true },
      comments: false,
      warnings: true
    }),
    // https://github.com/jantimon/favicons-webpack-plugin
    new FaviconsWebpackPlugin({
      title: 'Fruit Store',
      logo: 'public/assets/logo.jpg',
      prefix: 'icons/[hash]', // The prefix for all image files (might be a folder or a name)
      emitStats: false,
      statsFilename: 'icons/[hash].json',
      persistentCache: true,
      inject: true, // Inject the html into the html-webpack-plugin
      background: '#fff',

      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 2 version',

            }
          }
        ]
      }
    ]
  }
});
