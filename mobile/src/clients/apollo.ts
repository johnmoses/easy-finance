import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import { log } from '../utils/logs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const getApolloClient = () => {
  const fetchToken = () => {
    const token = AsyncStorage.getItem('authToken');
    return token;
  };

  const httpLink = new HttpLink({
    fetch,
    uri: Platform.select({
      android: Config.GRAPHQL_URL_ANDROID,
      ios: Config.GRAPHQL_URL_IOS,
    }),
  });

  const retryLink = new RetryLink();

  const authLink = setContext(async (_, { headers }) => {
    const token = await fetchToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `JWT ${token}` : '',
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      log('ErrorLink error'+ graphQLErrors);
    }
    if (networkError) {
      log('Network error:'+ networkError);
    }
  });

  return new ApolloClient({
    credentials: 'include',
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            senderTestimonies: {
              merge: true,
            },
            adminZones: {
              merge: true,
            },
          },
        },
        Testimony: {
          merge: true,
        },
      },
    }),
    link: authLink.concat(httpLink),
    name: 'react-web-client',
    version: '1.3',
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};
