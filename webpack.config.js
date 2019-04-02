const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /node_modules[/\\]rc/i,
        use: {
          loader: require.resolve('shebang-loader'),
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: __dirname,
        exclude: /node_modules\/(?!(koa-bodyparser|koa-logger)\/).*/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'transform-object-rest-spread',
            'transform-async-to-generator',
          ],
          presets: ['flow'],
        },
      },
    ]
  },
};