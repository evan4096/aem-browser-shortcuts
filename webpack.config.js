const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

// See https://stackoverflow.com/a/46920791/839595 https://erikonarheim.com/posts/automating-websites-with-bookmarklets/
class AssetToBookmarkletPlugin {
  pluginName = 'AssetToBookmarkletPlugin';

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tap({
        name: this.pluginName,
        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
      }, (assets) => {
        // Emit a new .bookmarklet
        for (const assetName in assets) {
          const asset = assets[assetName];
          const content = 'javascript:' + encodeURIComponent('(function(){' + asset.source() + '})()');
          compilation.emitAsset(assetName + '.bookmarklet.txt', new webpack.sources.RawSource(content))
        }
      });
    });
  };
}


module.exports = {
  entry: {
    crxde: path.resolve(__dirname, 'src/js/crxde.js'),
    edit: path.resolve(__dirname, 'src/js/edit.js'),
    preview: path.resolve(__dirname, 'src/js/preview.js'),
    sites: path.resolve(__dirname, 'src/js/sites.js'),
    properties: path.resolve(__dirname, 'src/js/properties.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {minimize: true} // Minify CSS as well
        }]
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
    new AssetToBookmarkletPlugin()
  ]
}