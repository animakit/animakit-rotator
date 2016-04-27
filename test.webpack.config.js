module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test:   /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]!postcss'
      }
    ]
  }
};
