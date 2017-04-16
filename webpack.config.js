'use strict';

const path = require('path');
const webpack = require('webpack');

//const WebpackFailPlugin = require('webpack-fail-plugin');
const IconsPlugin = require('icons-loader/IconsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// https://webpack.github.io/docs/configuration.html
let config = {
  entry: './public/src/App.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  // required for continous building in the vagrant machine
  watchOptions: {
    poll: true
  },
  plugins: [
    //WebpackFailPlugin, // as recommended "Failing the build on TypeScript compilation error" - https://www.npmjs.com/package/ts-loader
    new BellOnBundlerErrorPlugin(),
    new IconsPlugin({
      fontName: 'c2j-icons',
      timestamp: Math.round(Date.now() / 1000),
      normalize: true,
      formats: ['ttf', 'eot', 'woff', 'svg']
    }),
    new webpack.ProvidePlugin({
      // for the pragma configured in .babelrc
      '__jsx': path.resolve(__dirname, 'utils', 'jsx-transform.js')
    }),
    new CopyWebpackPlugin([
      { context: 'public/dist', from: '**', to: '[path][name].[ext]' }
    ]),
    /*new webpack.LoaderOptionsPlugin({
      debug: true
    })*/
  ],
  resolve: {
    modules: [
      path.resolve(),
      'node_modules'
    ],
    /** @see https://webpack.github.io/docs/configuration.html#resolve-modulesdirectories */
    alias: {
      'root': path.resolve(__dirname, 'public'),
      'srcroot': path.resolve(__dirname, 'public', 'ts')
    },
    extensions: [
      '.js', '.jsx', '.ts', '.tsx'
    ],
    // use to exclude certain dependencies from the bundle
    /*externals: []*/
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(tsx?|jsx?|scss)$/,
        use: ['source-map-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.tsx$/,
        // Maybe switch to nativejsx when it got SourceMaps support added (see wishlist at https://github.com/treycordova/nativejsx)
        //'nativejsx',
        use: [
          // https://github.com/s-panferov/awesome-typescript-loader
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: [
          // https://github.com/s-panferov/awesome-typescript-loader
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {}
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]' // keep original file name
            }
          }
        ]
      },
      {
        test: /\.json$/,
        // https://github.com/webpack/json-loader
        use: ['json-loader'],
        exclude: /iconfont\//
      },
      {
        test: /img\/.+\.(png|jpg|gif|svg)$/,
        use: ['file-loader']
      },
      {
        test: /iconfont\/.+\.json$/,
        // https://github.com/DragonsInn/fontgen-loader
        use: ['style-loader', 'css-loader', 'fontgen-loader']
      },/*
      // generates an icon font from the required .svg files
      // https://www.npmjs.com/package/icons-loader
      {
        test: /iconfont\/.+\.svg$/,
        use: ['icons-loader']
      }*/
    ]
  }
};

function reconfigureLoader(config, loaderName, newLoaderString) {
  config.module.loaders.forEach(function(loader) {
    if (loader.loaders) {
      for (let i = 0; i < loader.loaders.length; i++) {
        let loaderString = loader.loaders[i];
        if (loaderString.indexOf(loaderName) !== -1)
          loader.loaders[i] = newLoaderString;
      }
    }
  })
};

module.exports = config;
