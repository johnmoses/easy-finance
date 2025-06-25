import { useReviewListQuery } from "@/gql/schemas";
import React, { useState } from "react";
import { Show } from "./Show";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StarIcon from "@/components/review/StarIcon";

interface ListProps {
  itemId?: string;
  itemType?: string;
  last?: number;
  inline?: boolean;
  refetching?: boolean;
}

export const List: React.FC<ListProps> = (props) => {
  const [selectedData, setSelectedData] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  const { loading, data, error, refetch } = useReviewListQuery({
    variables: {
      itemId: props.itemId,
      itemType: props.itemType,
      isDeleted: false,
      last: props.last,
    },
  });

  const handleRefetch = () => {
    refetch({
      itemId: props.itemId,
      itemType: props.itemType,
    });
  };

  React.useEffect(() => {
    handleRefetch()
  },[props.refetching])

  if (loading) {
    return (
      <div className="text-center">
      <Progress value={33} />
      </div>
    );
  }

  if (error) {
    return <div>No Items</div>;
  }

  if (props.inline) {
    return (
      <>
        {data?.reviews?.edges.map((review) => (
          <div key={review?.node?.id}>
            <div className="flex">
              {Array.from(Array(5)).map((value: undefined, i: number) => (
                <StarIcon key={i} filled={review?.node?.rating > i} />
              ))}
            </div>
            <p>{review?.node?.content}</p>
            <div>{review?.node?.user.username}</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <h1>Reviews</h1>
      {data?.reviews?.edges.map((review) => (
        <Card
          key={review?.node?.createdAt}
          className="flex flex-col aspect-square items-center justify-center dark:shadow-gray-900 dark:bg-gray-800 p-3"
        >
          <div className="flex">
            {Array.from(Array(5)).map((value: undefined, i: number) => (
              <StarIcon key={i} filled={review?.node?.rating > i} />
            ))}
          </div>
          <p>{review?.node?.content}</p>
          <h3>{review?.node?.user.username}</h3>
        </Card>
      ))}

      <Show node={selectedData} open={showModal} onClose={toggleShowModal} />
    </div>
  );
};
