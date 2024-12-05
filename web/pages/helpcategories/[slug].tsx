'use client'
import Layout from "@/components/layout";
import { initializeApollo, addApolloState } from "@/clients/apollo";
import { useCategorySelectQuery } from "@/gql/schemas";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Card } from "@/components/ui/card";
// import { usePageAnalytics } from "@/hooks";

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data } = useCategorySelectQuery({
    variables: { slug: slug },
  });
  // usePageAnalytics();
  
  return (
    <Layout title="Help Category">
      <Card>
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {data?.category?.name}
        </h5>
        <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
          {data?.category?.description}
        </p>
      </Card>
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

export default CategoryPage;
