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
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
