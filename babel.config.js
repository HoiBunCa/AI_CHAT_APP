module.exports = function(api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
