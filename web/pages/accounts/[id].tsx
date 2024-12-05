"use client";
import Layout from "@/components/layout";
import { initializeApollo, addApolloState } from "@/clients/apollo";
import { useHelpSelectQuery } from "@/gql/schemas";
import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Create as CreateAccount } from "@/modules/accounts/Create";
import { List as ListAccounts } from "@/modules/accounts/List";
import { Button } from "@/components/ui/button";
// import { usePageAnalytics } from "@/hooks";

const AccountPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useHelpSelectQuery({
    variables: { id: id },
  });
  const [addAccountModal, setAddAccountModal] = useState<boolean>(false);
  // const [isRefetching, setIsRefetching] = useState<boolean>(false);

  function toggleAccountModal() {
    setAddAccountModal(!addAccountModal);
  }
  // usePageAnalytics();

  return (
    <Layout title="Help Topic">
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
          <ListAccounts
            last={5}
          />
          <div>
            <Button
              onClick={() => {
                toggleAccountModal();
              }}
            >
              Add Account
            </Button>
          </div>
          <CreateAccount
            open={addAccountModal}
            onClose={toggleAccountModal}
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

export default AccountPage;
