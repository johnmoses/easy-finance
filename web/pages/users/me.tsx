import { initializeApollo, addApolloState } from "@/clients/apollo";
import { Profile } from "@/modules/users/Profile";
import { GetStaticProps, NextPage } from "next";
import Layout from "@/components/layout";
import React from "react";
import { usePageAnalytics } from "@/hooks";

const MePage: NextPage = () => {
  usePageAnalytics();
  
  return (
    <Layout title="My Profile">
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <Profile />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default MePage;
