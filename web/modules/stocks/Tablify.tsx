import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAnalyticListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  isDeleted?: boolean;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useAnalyticListQuery({
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
      <h1>Stocks</h1>
      <Table>
        <TableHeader>
          <TableHead>User ID</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {data?.analytics?.edges.map((analytic) => (
            <TableRow key={analytic?.node?.id}>
              <TableCell className="px-6 py-4">
                {analytic?.node?.userId}
              </TableCell>
              <TableCell className="px-6 py-4">
                {analytic?.node?.path}
              </TableCell>
              <TableCell className="px-6 py-4">
                {analytic?.node?.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
