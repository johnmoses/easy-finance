import Footer from "../../footer";
import React from "react";
import Head from "next/head";
import Header from "../../header";

type LayoutProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const Layout = ({ title, description, children }: LayoutProps) => {
  return (
    <div>
      <Head>
        {title ? (
          <title>{"EasyFinance | " + title}</title>
        ) : (
          <title>EasyFinance</title>
        )}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="flex flex-col min-h-[100vh]">
        <Header />
        <main className="container m-auto mt-40 px-4">{children}</main>
        {/* <Toaster /> */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
