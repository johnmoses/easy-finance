import Layout from "@/components/layout";
// import { usePageAnalytics } from "@/hooks";
import { NextPage } from "next";
import React from "react";

const AboutPage: NextPage = () => {
  // usePageAnalytics();
  return (
    <Layout title="About Us">
      <div className="flex justify-center items-center md:mt-5">
        <div className="lex max-w-md flex-col gap-2">
          <h3>About us</h3>
          <p>Easy Finance is a technology platform</p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
