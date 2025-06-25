import { useReviewListQuery } from "@/gql/schemas";
import React, { useState } from "react";
import { Show } from "./Show";
import { Delete } from "./Delete";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface TablifyProps {
  last?: number;
  hasCreate?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasAdmin?: boolean;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error, refetch } = useReviewListQuery({
    variables: {
      isDeleted: false,
      last: props.last,
    },
  });
  const [review, setReview] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleDeleteModal() {
    setDeleteModal(!deleteModal);
    refetch({
      isDeleted: false,
      last: props.last,
    });
  }

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
      <h1>Reviews</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Item Id</TableHead>
            <TableHead>Item Type</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.reviews?.edges.map((review) => (
            <TableRow key={review?.node?.id}>
              <TableCell>{review?.node?.content}</TableCell>
              <TableCell>{review?.node?.rating}</TableCell>
              <TableCell>{review?.node?.user.username}</TableCell>
              <TableCell>{review?.node?.itemId}</TableCell>
              <TableCell>{review?.node?.itemType}</TableCell>
              <TableCell>
                {moment(review?.node?.createdAt).format("ll")}
              </TableCell>
              <TableCell className="px-6 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      {/* <DotsHorizontalIcon className="h-4 w-4" /> */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        toggleShowModal();
                        setReview(review?.node);
                      }}
                    >
                      Show
                    </DropdownMenuItem>
                    {props.hasDelete && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleDeleteModal();
                          setReview(review?.node);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {review && (
        <>
          <Show node={review} open={showModal} onClose={toggleShowModal} />
          <Delete
            node={review}
            open={deleteModal}
            onClose={toggleDeleteModal}
          />
        </>
      )}
    </>
  );
};
