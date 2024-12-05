import { useUserListQuery } from "@/gql/schemas";
import Link from "next/link";
import React, { useState } from "react";
import moment from "moment";
import { SearchBox } from "@/components/search/SearchBox";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { apixURL } from "@/clients/utils";
import { Button } from "@/components/ui/button";

interface ListProps {
  last?: number;
  isDeleted?: boolean;
}

export const List: React.FC<ListProps> = (props) => {
  const [after, setAfter] = useState<any>("");
  const { loading, data, error, refetch } = useUserListQuery({
    variables: {
      isDeleted: false,
      first: 20,
      after: after,
    },
  });

  const hasLess = Boolean(data?.users?.count! >= 20);
  const hasMore = Boolean(data?.users?.pageInfo.hasNextPage);

  const handleSearch = (search: string) => {
    refetch({
      search: search,
      isDeleted: false,
      first: 20,
      after: after,
    });
  };

  const loadLess = () => {
    setAfter("");
  };

  const loadMore = () => {
    setAfter(data?.users?.pageInfo.endCursor);
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
      <h1>Users</h1>
      <SearchBox doSearch={handleSearch} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.users?.edges.map((user) => (
          <Card
            key={user?.node?.id}
            className="my-2 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
            <Link href={`/users/[id]`} as={`/users/${user?.node?.id}`}>
              <Avatar>
                <AvatarImage
                  src={`${apixURL}/static/uploads/users/${user?.node?.avatar}`}
                  alt="@shadcn"
                />
                {/* <AvatarFallback>{user?.node?.username}</AvatarFallback> */}
              </Avatar>
              <div className="space-y-1 font-medium dark:text-white">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {user?.node?.username}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Member since: {moment(user?.node?.dateJoined).format("ll")}
                </div>
              </div>
            </Link>
            </div>
          </Card>
        ))}
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
