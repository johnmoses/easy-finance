import Layout from "@/components/layout";
import { initializeApollo, addApolloState } from "@/clients/apollo";
import { useReviewSelectQuery } from "@/gql/schemas";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
// import { usePageAnalytics } from "@/hooks";

const ReviewPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useReviewSelectQuery({
    variables: { id: id },
  });
  // usePageAnalytics();
  
  return (
    <Layout title="Reporter | Review">
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Reviews
          </h5>
          <p>{data?.review?.reviewer.username}</p>
          <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            {data?.review?.content}
          </p>
          <div>{data?.review?.createdAt}</div>
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

export default ReviewPage;
