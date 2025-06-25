import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactionListQuery } from "@/gql/schemas";
import React from "react";

interface ListProps {
  last?: number;
}

export const List: React.FC<ListProps> = (props) => {
  const { loading, data, error } = useTransactionListQuery({
    variables: { last: props.last },
  });

  if (loading) {
    <div className="text-center">
         <Progress value={33} />
      </div>
  }

  if (error) {
    return <div>No Data</div>;
  }

  return (
    <>
      <h1>Transactions</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.transactions?.edges.map((transaction) => (
          <Card
            key={transaction?.node?.createdAt}
            className="my-2 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>User {transaction?.node?.account?.user.username}</p>
              </h5>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
