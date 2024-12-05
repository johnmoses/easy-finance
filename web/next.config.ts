import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    API_URL: process.env.API_URL,
    APIX_URL: process.env.APIX_URL,
  },
};

// console.log("GRAPHQL_URL: ", process.env.GRAPHQL_URL);
// console.log("API_URL: ", process.env.API_URL);
// console.log("APIX_URL: ", process.env.APIX_URL);

export default nextConfig;
