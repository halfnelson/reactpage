const path = require('path');

module.exports = {
  entry: './src/lib/cms.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [ path.resolve(__dirname, 'src/lib')]
      }
    ]
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
     "react": "react",
     "react-dom": "react-dom"
  },
  output: {
    filename: 'cms.js',
    library: 'cms',
    libraryTarget: 'umd',
    //https://github.com/webpack/webpack/issues/6522
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    path: path.resolve(__dirname, 'dist/lib')
  }
};