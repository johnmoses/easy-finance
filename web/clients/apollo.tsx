import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { GetStaticPropsResult, NextPageContext } from "next";
import { useMemo } from "react";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  StoreObject,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
export const COOKIES_TOKEN_NAME = 'jwt';

let authToken: string | null = null;

const getToken = async () => {
  authToken = await localStorage.getItem('authToken');
  return authToken;
}

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const httpLink = new HttpLink({
  fetch,
  uri: process.env.GRAPHQL_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : '',
    },
  };
});

function createApolloClient(ctx: NextPageContext | null) {
  return new ApolloClient({
    credentials: "include",
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            adminZones: {merge:true}
          }
        },
        Location: {
          fields: {
            admins: {merge:true,},
          }
        }
      }
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      }
    }
  });
}

export function initializeApollo(
  initialState: StoreObject | null = null, ctx: NextPageContext | null = null
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: {
    props: NormalizedCacheObject;
    revalidate?: number;
  }
): GetStaticPropsResult<NormalizedCacheObject> {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }
  return pageProps;
}

export function useApollo(
  pageProps: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}

