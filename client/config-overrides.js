/* config-overrides.js */
const { override, addWebpackAlias, addLessLoader, fixBabelImports, overrideDevServer/*, addBundleVisualizer*/ } = require('customize-cra');
// const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const Utils = require('./src/utils');

const resolve = dir => {
  return path.join(__dirname, '.', dir);
};

const debugePluginsLoader = () => config => {
  if (process.env.NODE_ENV === 'production') {
    const date = Utils.dateFormat(new Date().getTime(), 'yyyyMMddhhmm');
    config.output = Object.assign(config.output, {
      filename: config.output.filename.replace(/\/js/, `/js${date}`),
      chunkFilename: config.output.chunkFilename.replace(/\/js/, `/js${date}`),
    });
    // config.optimization.minimizer.push(
    //   new TerserPlugin({
    //     sourceMap: false,
    //     terserOptions: {
    //       compress: {
    //         drop_console: true,
    //       },
    //     },
    //   })
    // );
    const path = require('path');

    const paths = require('react-scripts/config/paths');
    paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');
    config.output.path = path.join(path.dirname(config.output.path), 'dist');
  }

  return config;
};

const devServerConfig = () => config => {
  let options = {
    target: 'http://172.18.0.3:8072',
    // target: 'http://104.155.213.63:8072',
    changeOrigin: true,
    secure: false,
  };
  if (process.env.NODE_ENV === 'development') {
    let processArgv = process.argv;
    let _url = processArgv[processArgv.length - 1].match(/url=(.*)/);
    if (_url && _url.length >= 2) {
      options.target = `${_url[1]}`;
    }
  }
  return {
    historyApiFallback: true,
    ...config,
    port: 3000,
    proxy: {
      '/api': options,
    },
  };
};

module.exports = {
  devServer: overrideDevServer(devServerConfig()),
  webpack: override(
    config => {
      if (process.env.NODE_ENV !== 'development') {
        config.devtool = 'none';
      }

      return config;
    },
    //配置别名
    addWebpackAlias({
      '@': resolve('src'),
    }),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
    addLessLoader({
      lessOptions: { javascriptEnabled: true },
    }),
    debugePluginsLoader(),
    // addBundleVisualizer({ analyzerMode: 'static', generateStatsFile: true, reportFilename: 'report.html' })
    // disableEsLint()
  ),
};
