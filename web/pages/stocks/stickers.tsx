import Layout from "@/components/layout";
import { NextPage } from "next";
import React from "react";
import { Stickers } from "@/modules/stocks/Stickers";
import dynamic from "next/dynamic";
import SavingsLineChart from "@/components/charts/SavingsLineChart";
import StackedBarChart from "@/components/charts/StackedBarChart";

const Menus = dynamic(() => import("@/modules/stocks/Menus"), {
  ssr: false,
});

interface Savings {
  month: string;
  amount: number;
}

interface StackedData {
  category: string;
  income: number;
  expenses: number;
}

const savingsData: Savings[] = [
  { month: 'January', amount: 1000 },
  { month: 'February', amount: 1200 },
  { month: 'March', amount: 1500 },
  { month: 'April', amount: 2000 },
];

const stackedData: StackedData[] = [
  { category: 'January', income: 3000, expenses: 2000 },
  { category: 'February', income: 2500, expenses: 2200 },
  { category: 'March', income: 2800, expenses: 2300 },
];

const StickersTablePage: NextPage = () => {
  // usePageAnalytics();

  return (
    <Layout title='Stickers'>
      <div className="float-left">
        <Menus />
      </div>
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Stickers
          </h5>
          <SavingsLineChart data={savingsData} />
          <StackedBarChart data={stackedData} />
          <ul>
            {stackedData.map((data, index) => (
              <li key={index}>
                {data.category} - Income: ${data.income}, Expenses: ${data.expenses}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Stickers />
    </Layout>
  );
};

export default StickersTablePage;
