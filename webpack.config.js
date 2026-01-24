const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    crxde: path.resolve(__dirname, 'src/js/crxde.js'),
    edit: path.resolve(__dirname, 'src/js/edit.js'),
    preview: path.resolve(__dirname, 'src/js/preview.js'),
    sites: path.resolve(__dirname, 'src/js/sites.js'),
    properties: path.resolve(__dirname, 'src/js/properties.js'),
    popup: path.resolve(__dirname, 'src/popup/popup.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'posthtml-loader',
            options: {
              ident: 'posthtml'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/popup/popup.html', to: 'popup.html' },
        { from: 'src/popup/popup.css', to: 'popup.css' },
        { from: 'src/icons', to: 'icons', noErrorOnMissing: true }
      ]
    })
  ]
}