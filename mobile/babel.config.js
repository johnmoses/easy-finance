module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app': './src',
          '@clients': './src/clients',
          '@components': './src/components',
          '@modules': './src/modules',
          '@navigators': './src/navigators',
          '@store': './src/store',
          '@screens': './src/screens',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
