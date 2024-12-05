import { initializeApollo, addApolloState } from "@/clients/apollo";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import Layout from "@/components/layout";
import { Lists } from "@/modules/users/Lists";
import { usePageAnalytics } from "@/hooks";

const ListsPage: NextPage = () => {
  usePageAnalytics();
  
  return (
    <Layout title="My Lists">
      <Lists />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default ListsPage;
