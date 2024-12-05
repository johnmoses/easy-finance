"use client";
import Layout from "@/components/layout";
import { initializeApollo, addApolloState } from "@/clients/apollo";
import { useBannerSelectQuery } from "@/gql/schemas";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Card } from "@/components/ui/card";
// import { usePageAnalytics } from "@/hooks";
import { apixURL } from "@/clients/utils";

const BannerPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useBannerSelectQuery({
    variables: { id: id },
  });
  // usePageAnalytics();

  return (
    <Layout title="Trending">
      <Card className="relative w-full">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          <img
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${apixURL}/static/uploads/banners/${data?.banner?.pic}`}
            className="absolute block w-full "
            alt="..."
          />
        </div>
      </Card>
      <div  className="flex justify-center items-center md:mt-5">
          <div  className="flex max-w-md flex-col gap-2">
            <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {data?.banner?.title}
            </h5>
            <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
              {data?.banner?.content}
            </p>
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

export default BannerPage;
