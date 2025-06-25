import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useStockListQuery({
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
      <h1>Stocks</h1>
      <Table>
        <TableHeader>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {data?.stocks?.edges.map((stock) => (
            <TableRow key={stock?.node?.id}>
              <TableCell className="px-6 py-4">
                {stock?.node?.description}
              </TableCell>
              <TableCell className="px-6 py-4">
                {stock?.node?.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
