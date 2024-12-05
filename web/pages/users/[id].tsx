import Layout from "@/components/layout";
import { addApolloState, initializeApollo } from "@/clients/apollo";
import { useUserSelectQuery } from "@/gql/schemas";
import moment from "moment";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { usePageAnalytics } from "@/hooks";

const UserPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useUserSelectQuery({
    variables: { id: id },
  });
  // console.log(data);
  usePageAnalytics();

  return (
    <Layout title="Reporter | User">
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {data?.user?.username}
          </h5>

          <div className="space-y-6">
            <p>User name: {data?.user?.username}</p>
            <p>Mobile: {data?.user?.mobile}</p>
            <p>Email: {data?.user?.email}</p>
            <p>Verified: {data?.user?.isVerified || false}</p>
            <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
              Member since: {moment(data?.user?.dateJoined).format("llll")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  if (!context.params) {
    return {
      props: {},
    };
  }

  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default UserPage;
