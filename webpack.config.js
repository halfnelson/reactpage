const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    
  },
  output: {
    filename: 'cmscomponents.js',
    library: 'cmsComponents',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  }
};