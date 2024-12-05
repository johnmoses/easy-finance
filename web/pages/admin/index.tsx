import Layout from "@/components/layout";
import { usePageAnalytics } from "@/hooks";
import { Menus } from "@/modules/users/Menus";
import { setChatBoxOpen } from "@/store/slices/chat";
import { setActiveId, setHelpBoxOpen, setHelpModal } from "@/store/slices/help";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

const AdminDashboardPage: NextPage = () => {
  usePageAnalytics();
  const dispatch = useDispatch();

  const getHelp = () => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(2));
    dispatch(setActiveId("SGVscFR5cGU6NA=="));
  };
  
  return (
    <Layout title="Admin Dashboard">
      <div className="float-left">
        <Menus />
      </div>
      <div className="flex justify-center items-center md:mt-5">
        <div className="flex max-w-md flex-col gap-2">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h5>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <h6 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h6>
      </div>
      <Link
        onClick={getHelp}
        href={""}
        className="text-cyan-600 hover:underline dark:text-cyan-500"
      >
        <span className="text-white p-2 hover:text-gray-400">
          Learn more...
        </span>
      </Link>
    </Layout>
  );
};

export default AdminDashboardPage;
