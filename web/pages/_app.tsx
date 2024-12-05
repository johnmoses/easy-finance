import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as StoreProvider } from "react-redux";
import store from "@/store";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/theme-provider";
import { useApollo } from "@/clients/apollo";
import { ApolloProvider } from "@apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  
  return (
    <StoreProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Component {...pageProps} />
          </ThemeProvider>
        </AppProvider>
      </ApolloProvider>
    </StoreProvider>
  );
}