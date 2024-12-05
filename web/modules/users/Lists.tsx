import { Progress } from "@/components/ui/progress";
import { useUserSelectQuery } from "@/gql/schemas";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

export const Lists = () => {
  const state = useSelector((state: RootState) => state.app);
  const { loading, data, error } = useUserSelectQuery({
    variables: { id: state.authUserId },
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
      <h1>My Lists</h1>

      <h1>Stocks</h1>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.user?.adminZones.edges.map((zone) => (
          <Card
            key={zone?.node?.id}
            className="my-2 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <Link href={`/zones/[id]`} as={`/zones/${zone?.node?.id}`}>
                {zone?.node?.name}
              </Link>
            </div>
          </Card>
        ))}
      </div> */}

    </>
  );
};
