const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const glob = require('glob-all');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default
const PurgecssPlugin = require('purgecss-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    styles: './src/styles.js',
  },
  output: {
    publicPath: "",
    filename: 'assets/[name].[contenthash].js',
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
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: './src/index.html',
      templateParameters: {
        'foo': 'bar'
      },
      inject: true

    }),
    new HTMLInlineCSSWebpackPlugin({
      filter(fileName){
        console.log(fileName);
        var result = false && (fileName.includes('main') || fileName.includes('index.html'));
        return result;
      }
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
      chunkFilename: "assets/[id].[contenthash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        './src/**/*',
        './vendor/**/*'
      ],
      { nodir: true })
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.HotModuleReplacementPlugin(),
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
