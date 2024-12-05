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
        <div className={`flex min-h-screen flex-col justify-between`}>
            <Head>
                {title ? (
                    <title>{"Easy Finance | " + title}</title>
                ) : (
                    <title>Easy Finance</title>
                )}
                {description && <meta name="description" content={description} />}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <div className="flex flex-col min-h-[100vh]">
                <Header />
                <main className="fcontainer m-auto mt-40 px-4">{children}</main>
                {/* <Toaster /> */}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
