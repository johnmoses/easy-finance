import { useAccountCategoryListQuery } from "@/gql/schemas";
import Link from "next/link";
import React, { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { Show } from "./Show";
import { SearchBox } from "@/components/search/SearchBox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ListProps {
  isDeleted?: boolean;
}

export const List: React.FC<ListProps> = (props) => {
  const [selectedData, setSelectedData] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  const { loading, data, error, refetch } = useAccountCategoryListQuery({
    variables: { search: ""},
  });

  const handleSearch = (search: string) => {
    refetch({ search: search });
  };

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
      <h1>Account Categories</h1>
      <SearchBox doSearch={handleSearch} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.accountcategories?.edges.map((category) => (
          <Card
            key={category?.node?.id}
            className="my-2 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <Link
                href={`/accountcategories/[id]`}
                as={`/accountcategories/${category?.node?.id}`}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <p>{category?.node?.name}</p>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {category?.node?.description}{" "}
                  {category?.node?.categoryAccounts.count} categories
                </p>
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  toggleShowModal();
                  setSelectedData(category?.node);
                }}
              >
                <MdMenuOpen />
              </button>
            </div>
          </Card>
        ))}

        <Show node={selectedData} open={showModal} onClose={toggleShowModal} />
      </div>
    </>
  );
};
