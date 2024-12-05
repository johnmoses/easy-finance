import { GetStaticProps, NextPage } from "next";
import { addApolloState, initializeApollo } from "@/clients/apollo";
import Layout from "@/components/layout";
import { List } from "@/modules/helpcategories/List";
// import { usePageAnalytics } from "@/hooks";

const CategorysPage: NextPage = () => {
  // usePageAnalytics();

  return (
    <Layout title="Help Categories">
      <List isDeleted={false} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default CategorysPage;
