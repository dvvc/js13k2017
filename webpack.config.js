'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const GAME_DIR = path.join(__dirname, 'game');
const BUILD_DIR = path.join(__dirname, 'assets');

let config = {
  context: GAME_DIR,
  devtool: 'source-map',
  entry: {
    game: [
      './js/index.js',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader?presets[]=es2015!jshint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },
  output: {
    path: BUILD_DIR,
    filename: '[name]-bundle.js',
    publicPath: '/assets/',
  },
  plugins: [
  ],
};

if (process.env.ENV !== 'dev') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

module.exports = config;
