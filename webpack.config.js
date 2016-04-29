const path              = require('path');
const srcPath           = path.join(__dirname, 'src');
const distPath          = path.join(__dirname, 'dist');

const webpack           = require('webpack');

const autoreset         = require('postcss-autoreset');
const autoprefixer      = require('autoprefixer');


module.exports = {
  devtool: 'source-map',

  entry: [
    path.join(srcPath, 'index')
  ],

  output: {
    path:          distPath,
    filename:      'index.js',
    library:       'AnimakitRotator',
    libraryTarget: 'umd'
  },

  resolve: {
    root:               srcPath,
    extensions:         ['', '.js', '.jsx'],
    modulesDirectories: [
      srcPath,
      path.join(__dirname, 'node_modules')
    ]
  },

  externals: {
    'react':     'react',
    'react-dom': 'react-dom'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      {
        test:    /\.jsx?/,
        loader:  'babel',
        include: srcPath
      },
      {
        test:   /\.css/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]!postcss'
      }
    ]
  },

  postcss: [
    autoreset(),
    autoprefixer()
  ]
};
