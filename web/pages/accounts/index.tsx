import { GetStaticProps, NextPage } from "next";
import { addApolloState, initializeApollo } from "@/clients/apollo";
import Layout from "@/components/layout";
import { List } from "@/modules/accounts/List";
// import { usePageAnalytics } from "@/hooks";

const AccountsPage: NextPage = () => {
  // usePageAnalytics();

  return (
    <Layout title="Accounts">
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

export default AccountsPage;
