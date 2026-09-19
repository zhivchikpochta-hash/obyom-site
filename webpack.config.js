const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: { filename: 'assets/site.[contenthash].js', path: path.resolve(__dirname, 'dist'), clean: true },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
    ],
  },
  resolve: { extensions: ['.ts', '.js'] },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', title: 'OBYOM — WebGPU-powered 3D viewing for the web' }),
    new CopyPlugin({ patterns: [
      { from: 'assets', to: 'assets' },
      { from: 'src/shaders/basic.wgsl', to: 'shaders/basic.wgsl' },
    ] }),
  ],
  devServer: { static: { directory: path.join(__dirname, 'dist') }, port: 3000, open: false },
};
