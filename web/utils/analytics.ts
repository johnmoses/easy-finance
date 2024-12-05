import Analytics from 'analytics';

export const analytics = Analytics({
  debug: true,
  app: 'web',
  plugins: [
    localProviderPlugin({
      xyz: '123',
    }),
  ],
});

function localProviderPlugin(userConfig = {}) {
  return {
    name: 'local-provider',
    NAMESPACE: 'provider-example',
    config: userConfig,
    initialize: ({ payload }: any) => {
      console.log('Load it');
    },
    page: ({ payload }: any) => {
      console.log('Page', payload);
    },
    track: ({ payload }: any) => {
      console.log('Track', payload);
    },
    identify: ({ payload }: any) => {
      console.log('Identify', payload);
    },
    loaded: () => {
      return true;
    },
    ready: () => {
      console.log('Ready');
    },
  };
}
