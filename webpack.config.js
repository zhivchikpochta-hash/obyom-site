const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'site.js',
    path: __dirname,
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/obyom/src/shaders/webgpu', to: 'shaders/webgpu' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      obyom: path.resolve(__dirname, 'node_modules/obyom/src/index.ts'),
    },
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, 'node_modules')],
  },
};
