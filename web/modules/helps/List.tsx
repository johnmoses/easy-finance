import { useHelpListQuery } from "@/gql/schemas";
import Link from "next/link";
import React, { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { Show } from "./Show";
import { SearchBox } from "@/components/search/SearchBox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ListProps {
  categoryId?: any;
}

export const List: React.FC<ListProps> = (props) => {
  const [selectedData, setSelectedData] = useState<any>("");
  const [after, setAfter] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  const { loading, data, error, refetch } = useHelpListQuery({
    variables: {
      categoryId: props.categoryId,
      isDeleted: false,
      first: 20,
      after: after,
    },
  });

  const hasLess = Boolean(data?.helps?.count! >= 20);
  const hasMore = Boolean(data?.helps?.pageInfo.hasNextPage);

  const handleSearch = (search: string) => {
    refetch({
      search: search,
      categoryId: props.categoryId,
      isDeleted: false,
      // first: 20,
      // after: after,
    });
  };

  const loadLess = () => {
    setAfter("");
  };

  const loadMore = () => {
    setAfter(data?.helps?.pageInfo.endCursor);
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
      <h1>Help Topics</h1>
      <SearchBox doSearch={handleSearch} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.helps?.edges.map((help) => (
          <Card
            key={help?.node?.id}
            className="my-2 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <Link href={`/helps/[id]`} as={`/helps/${help?.node?.id}`}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {help?.node?.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: help?.node?.content?.substring(0, 50) as string,
                    }}
                  />
                </p>
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  toggleShowModal();
                  setSelectedData(help?.node);
                }}
              >
                <MdMenuOpen />
              </button>
            </div>
          </Card>
        ))}
        <Show node={selectedData} open={showModal} onClose={toggleShowModal} />
      </div>
      <div className="flex justify-center item-center">
        {hasLess && (
          <Button onClick={loadLess}>{loading ? "Loading..." : "Start"}</Button>
        )}
        {hasMore && (
          <Button onClick={loadMore}>{loading ? "Loading..." : "Next"}</Button>
        )}
      </div>
    </>
  );
};
