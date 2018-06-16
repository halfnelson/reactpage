const path = require('path');

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, '../../'),
  entry: './src/docs/index.tsx',
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
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      // CUSTOM PACKAGES:
        'cms': path.resolve(__dirname, '../../dist/lib/cms'),
     }
  },
  /*externals: {
     "react": "react",
     "react-dom": "react-dom",
     "cms": "cms"
  },*/
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../dist/docs')
  },
  devServer: {
    contentBase: path.join(__dirname, "../../dist/docs"),
  }
};