import { GetStaticProps, NextPage } from "next";
import { addApolloState, initializeApollo } from "@/clients/apollo";
import Layout from "@/components/layout";
import { List } from "@/modules/users/List";
import { usePageAnalytics } from "@/hooks";

const UsersPage: NextPage = () => {
  usePageAnalytics();
  
  return (
    <Layout title="Users">
      <List />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default UsersPage;
