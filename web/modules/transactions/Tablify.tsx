import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactionListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useTransactionListQuery({
    variables: {
      search: props.search,
      last: props.last,
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
      <h1>Transactions</h1>
      <Table>
        <TableHeader>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {data?.transactions?.edges.map((transaction) => (
            <TableRow key={transaction?.node?.id}>
              <TableCell className="px-6 py-4">
                {transaction?.node?.description}
              </TableCell>
              <TableCell className="px-6 py-4">
                {transaction?.node?.amount}
              </TableCell>
              <TableCell className="px-6 py-4">
                {transaction?.node?.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
