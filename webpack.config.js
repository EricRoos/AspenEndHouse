const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    styles: './src/styles.js',
    core_styles: './src/core_styles.js',
    vendor_styles: './src/vendor_styles.js',
  },
  output: {
    publicPath: "",
    filename: 'assets/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(ttf|svg|eot|woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/[name].css",
      chunkFilename: "assets/[id].css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: './src/index.html'
    }),
    new HTMLInlineCSSWebpackPlugin({
      filter(fileName){
        var result = fileName.includes('core_styles') || fileName.includes('index.html');
        return result;
      }
    }),
    new CompressionPlugin
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
};
