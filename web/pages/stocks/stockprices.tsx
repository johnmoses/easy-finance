import Layout from "@/components/layout";
import { NextPage } from "next";
import React from "react";
import { StockPrices } from "@/modules/stocks/StockPrices";
import dynamic from "next/dynamic";
// import { usePageAnalytics } from "@/hooks";

const Menus = dynamic(() => import("@/modules/stocks/Menus"), {
  ssr: false,
});

const StockPricesTablePage: NextPage = () => {
  // usePageAnalytics();
  return (
    <Layout title='Portfolios'>
      <div className="float-left">
        <Menus />
      </div>
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Stock Prices
          </h5>
        </div>
      </div>
      <StockPrices />
    </Layout>
  );
};

export default StockPricesTablePage;
