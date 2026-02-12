const path = require('path');
const webpack = require('webpack');

var config = {
  mode: "development",
  stats: {
    // Suppress known third-party warning: @huggingface/transformers uses import.meta in a way webpack flags
    warningsFilter: (w) => {
      const msg = typeof w === 'string' ? w : (w && w.message);
      if (!msg) return true;
      return !(/Critical dependency: 'import\.meta'/.test(msg) && /transformers/.test(msg));
    },
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        // docs: https://webpack.js.org/configuration/module/#resolvefullyspecified
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        }
      }
    ]
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};

var AppConfig = Object.assign({}, config, {
  name: "app",
  entry: {
    "db-worker" : "./target/db-worker.js",
    "inference-worker" : "./target/inference-worker.js"
  },

  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name]-bundle.js',
    clean: false,
    chunkLoading: false,
  },
});

var MobileConfig = Object.assign({}, config, {
  name: "mobile",
  entry: {
    "db-worker" : "./target/db-worker.js",
  },

  output: {
    path: path.resolve(__dirname, 'static/mobile/js'),
    filename: '[name]-bundle.js',
    clean: false,
    chunkLoading: false,
  },
});

module.exports = [
  AppConfig, MobileConfig,
];
