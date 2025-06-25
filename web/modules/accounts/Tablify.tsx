import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccountListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useAccountListQuery({
    variables: {
      search: props.search,
      last: props.last
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
      <h1>Accounts</h1>
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Balance</TableHead>
        </TableHeader>
        <TableBody>
          {data?.accounts?.edges.map((account) => (
            <TableRow key={account?.node?.id}>
              <TableCell className="px-6 py-4">
                {account?.node?.category.name}
              </TableCell>
              <TableCell className="px-6 py-4">
                {account?.node?.currency}
              </TableCell>
              <TableCell className="px-6 py-4">
                {account?.node?.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
