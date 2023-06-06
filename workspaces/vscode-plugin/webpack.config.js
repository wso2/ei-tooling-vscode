const path = require('path');

module.exports = {
  entry: './src/extension.ts',
  watch: false,
  mode :'development',
  target: 'node',
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/, 
        exclude: /datamapper/,
        use: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map'
};
