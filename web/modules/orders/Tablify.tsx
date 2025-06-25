import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useOrderListQuery({
    variables: {
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
      <h1>Orders</h1>
      <Table>
        <TableHeader>
          <TableHead>Quantity</TableHead>
          <TableHead>Buy Price</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {data?.orders?.edges.map((order) => (
            <TableRow key={order?.node?.id}>
              <TableCell className="px-6 py-4">
                {order?.node?.quantity}
              </TableCell>
              <TableCell className="px-6 py-4">
                {order?.node?.buyPrice}
              </TableCell>
              <TableCell className="px-6 py-4">
                {order?.node?.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
