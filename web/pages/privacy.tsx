import Layout from "@/components/layout";
// import { usePageAnalytics } from "@/hooks";
import { NextPage } from "next";
import React from "react";

const PrivacyPage: NextPage = () => {
  // usePageAnalytics();
  return (
    <Layout title="Privacy Policy">
      <div className="flex justify-center items-center md:mt-5">
        <div className="lex max-w-md flex-col gap-2">
          <h3>Privacy Policy</h3>
          <p>
            Easy Finance operates all the financial services.
          </p>
          <p>
            This page informs you of our policies regarding the collection, use,
            and disclosure of personal data when you use our Service and the
            choices you have associated with that data.
          </p>
          <p>Information Collection and Use</p>
          <p>
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>
          <p>Types of Data Collected</p>
          <p>Personal Data</p>
          <p>
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you ("Personal Data"). Personally identifiable information
            may include, but is not limited to:
          </p>
          <p>
            Email address First name and last name Phone number Address, State,
            Province, ZIP/Postal code, City Cookies and Usage Data Usage Data
          </p>
          <p>
            This content may violate our content policy or terms of use. If you
            believe this to be in error, please contact us — your input will aid
            our research in this area.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
