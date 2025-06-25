import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStrategyListQuery } from "@/gql/schemas";
import React from "react";

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error } = useStrategyListQuery({
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
      <h1>Strategies</h1>
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
        </TableHeader>
        <TableBody>
          {data?.strategies?.edges.map((strategy) => (
            <TableRow key={strategy?.node?.id}>
              <TableCell className="px-6 py-4">
                {strategy?.node?.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
