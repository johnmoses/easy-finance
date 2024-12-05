import { Progress } from "@/components/ui/progress";
import { AppContext } from "@/context/AppContext";
import { useCategoryListQuery } from "@/gql/schemas";
import Link from "next/link";
import React, { useContext } from "react";

export const CategoryModal = () => {
  const { showhelps } = useContext(AppContext);
  const { loading, data, error } = useCategoryListQuery({
    variables: { slug: "", isDeleted: false },
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
    <div className="helps-body">
      {data?.categories?.edges.map((category) => (
        <div key={category?.node?.id}>
          <Link onClick={() => showhelps(category?.node?.id)} href={"#"}>
            {category?.node?.name}
          </Link>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {category?.node?.description} {category?.node?.categoryHelps.count}{" "}
            topic(s)
          </p>
        </div>
      ))}
    </div>
  );
};
