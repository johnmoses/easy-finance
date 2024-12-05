import Link from "next/link";
import React from "react";
import { footerContent } from "./content";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Chatbox = dynamic(() => import("@/modules/chats"), {
  ssr: false,
});
const HelpBox = dynamic(() => import("@/modules/helps"), {
  ssr: false,
});

const Footer = () => {
    const state = useSelector((state: RootState) => state.app);

    return (
        <footer className="mt-12">
            <div className="border-t-[1px] border-slate-500/30 text-center text-xs md:text-sm py-4">
                <div className="flex flex-wrap py-4 md:py-8 md:px-4 w-full xl:max-w-[2100px] mx-auto">
                    <div className="flex justify-between flex-wrap flex-grow min-width-[800px] xl:rtl:pl-60">
                        {footerContent.map((item) => {
                            return (
                                <div className="mt-6 md:mt-0" key={item.title}>
                                    <h2 className="text-md rtl:border-r-4 ltr:border-l-4 border-palette-primary px-2">
                                        {item.title}
                                    </h2>
                                    <div className="flex flex-col mt-2">
                                        {item.subtitles.map((subItem) => {
                                            return (
                                                <Link href={subItem.href} key={subItem.text}>
                                                    <div className="text-sm text-palette-base/90 px-4 py-2 hover:text-palette-base/100">
                                                        {subItem.text}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="border-t-[1px] border-slate-500/30 text-center text-xs md:text-sm py-4">
                    <div>@2024</div>
                    <div className="py-1">
                        Easy Finance &nbsp;
                        <a
                            href="https://easyfinance.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-palette-side underline font-bold px-2"
                        >
                            Enterprise
                        </a>
                    </div>
                </div>
            </div>
            <Chatbox />
            <HelpBox />
        </footer>
    )
}

export default Footer;