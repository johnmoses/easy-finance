import { useHelpSelectQuery } from "@/gql/schemas";
import { RootState } from "@/store";
import { setChatBoxOpen } from "@/store/slices/chat";
import { setHelpBoxOpen, setHelpModal } from "@/store/slices/help";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const ShowModal = () => {
  const dispatch = useDispatch();
  const helpState = useSelector((state: RootState) => state.help);
  const { data } = useHelpSelectQuery({
    variables: { id: helpState.activeId },
  });

  const getHelps = () => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(1));
  };

  const getHelpCategories = () => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(0));
  };

  return (
    <>
      <div className="helps-header">
        <Link onClick={getHelpCategories} href={"#"}>
          Categories
        </Link>{" "} 
        | {" "}
        <Link onClick={getHelps} href={"#"}>
          Topics
        </Link>
      </div>
      <div className="helps-body">
        <p>{data?.help?.title}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: data?.help?.content as string,
          }}
        />
        <p>Category: {data?.help?.category?.name}</p>
      </div>
    </>
  );
};
