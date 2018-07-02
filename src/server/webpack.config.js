const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  target: 'node',
  context: path.resolve(__dirname, '../../'),
  entry: './src/server/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      //  include: [ path.resolve(__dirname, './src/docs')]
      }
    ]
  },
  optimization: {
    minimize: false,
  },
  cache: false,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      // CUSTOM PACKAGES:
        'cms': path.resolve(__dirname, '../../dist/lib/cms'),
     }
  },
  externals: [
     nodeExternals(),
     { "cms": "commonjs ../lib/cms" } 
    ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../dist/server')
  },
  node: {
    __dirname: false
  },
};
