/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Main } from './src/app';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '@app/clients/apollo';
import { AppContextProvider } from '@app/contexts/AppContext';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@app/store';
import { SyncContextProvider } from '@app/contexts/SyncContext';
import { RealmProvider } from '@app/offline';

const client = getApolloClient();

function App(): React.JSX.Element {
  return (
    <StoreProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <RealmProvider>
          <AppContextProvider>
            <SyncContextProvider>
              <Main />
            </SyncContextProvider>
          </AppContextProvider>
        </RealmProvider>
      </ApolloProvider>
    </PersistGate>
  </StoreProvider>
  );
}

export default App;
