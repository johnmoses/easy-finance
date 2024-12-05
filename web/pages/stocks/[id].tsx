"use client";
import Layout from "@/components/layout";
import { initializeApollo, addApolloState } from "@/clients/apollo";
import { useHelpSelectQuery } from "@/gql/schemas";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Create as CreateReview } from "@/modules/reviews/Create";
import { List as ListReviews } from "@/modules/reviews/List";
import { Button } from "@/components/ui/button";
// import { usePageAnalytics } from "@/hooks";

const StockPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useHelpSelectQuery({
    variables: { id: id },
  });
  const [addReviewModal, setAddReviewModal] = useState<boolean>(false);
  // const [isRefetching, setIsRefetching] = useState<boolean>(false);

  function toggleReviewModal() {
    setAddReviewModal(!addReviewModal);
  }
  // usePageAnalytics();

  return (
    <Layout title="Stock">
      <div className="flex justify-center items-center md:mt-5">
        <div className="lex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {data?.help?.title}
          </h5>
          <div
            dangerouslySetInnerHTML={{
              __html: data?.help?.content as string,
            }}
          />
          <ListReviews
            itemId={id}
            itemType="Help"
            last={5}
            inline={true}
            refetching={addReviewModal}
          />
          <div>
            <Button
              onClick={() => {
                toggleReviewModal();
              }}
            >
              Add Review
            </Button>
          </div>
          <CreateReview
            itemId={id}
            itemType={"Help"}
            open={addReviewModal}
            onClose={toggleReviewModal}
          />
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

export default StockPage;
