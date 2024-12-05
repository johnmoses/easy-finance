import { GetStaticProps, NextPage } from "next";
import { addApolloState, initializeApollo } from "@/clients/apollo";
import Layout from "@/components/layout";
import { List } from "@/modules/reviews/List";
// import { usePageAnalytics } from "@/hooks";

const FeedbacksPage: NextPage = () => {
  // usePageAnalytics();
  
  return (
    <Layout title="Reviews">
      <List last={50} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default FeedbacksPage;
