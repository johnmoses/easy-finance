import { Progress } from "@/components/ui/progress";
import { AppContext } from "@/context/AppContext";
import { useHelpListQuery } from "@/gql/schemas";
import { RootState } from "@/store";
import Link from "next/link";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

export const ListModal = () => {
  const { showhelp, showhelpcats } = useContext(AppContext);
  const helpState = useSelector((state: RootState) => state.help);
  const { loading, data, error } = useHelpListQuery({
    variables: {
        categoryId: helpState.activeCategoryId,
      isDeleted: false,
    },
  });

  if (loading) {
    return (
      <div className="text-center">
      <Progress value={33} />
      </div>
    );
  }

  if (error) {
    return <div>No Data</div>;
  }
  return (
    <>
      <div className="helps-header">
        <Link onClick={() => showhelpcats()} href={"#"}>
          Categories
        </Link>
      </div>
      <div className="helps-body">
        {data?.helps?.edges.map((help) => (
          <div key={help?.node?.id}>
            <Link onClick={() => showhelp(help?.node?.id)} href={"#"}>
              {help?.node?.title}
            </Link>
            <div className="font-normal text-gray-700 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: help?.node?.content?.substring(0, 40) as string,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
