// frontend/webpack.dev.js
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/'
    },
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
    client: {
      logging: 'info',
      overlay: { errors: true, warnings: false },
      progress: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
      });
      return middlewares;
    },
  },
  plugins: [
    new Dotenv({
      path: '.env',
      systemvars: true,
      safe: false
    })
  ]
});
