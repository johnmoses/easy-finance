import { useHelpListQuery } from "@/gql/schemas";
import React, { useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { Create } from "./Create";
import { Show } from "./Show";
import { Update } from "./Update";
import { Delete } from "./Delete";
import { SearchBox } from "@/components/search/SearchBox";
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
  hasCreate?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasAdmin?: boolean;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const [help, setHelp] = useState<any>();
  const [after, setAfter] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);

  const { loading, data, error, refetch } = useHelpListQuery({
    variables: {
      isDeleted: false,
      first: 20,
      after: after,
    },
  });

  const hasLess = Boolean(data?.helps?.count! >= 20);
  const hasMore = Boolean(data?.helps?.pageInfo.hasNextPage);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleCreateModal() {
    setCreateModal(!createModal);
    refetch({
      isDeleted: false,
      // first: 20,
      // after: after,
    });
  }

  function toggleUpdateModal() {
    setUpdateModal(!updateModal);
  }

  function toggleDeleteModal() {
    setDeleteModal(!deleteModal);
    refetch({
      isDeleted: false,
      // first: 20,
      // after: after,
    });
  }

  function toggleRemoveModal() {
    setRemoveModal(!removeModal);
  }

  const handleSearch = (search: string) => {
    refetch({
      search: search,
      isDeleted: false,
      // first: 20,
      // after: after,
    });
  };

  const loadLess = () => {
    setAfter("");
  };

  const loadMore = () => {
    setAfter(data?.helps?.pageInfo.endCursor);
  };

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
    <div className="flex flex-col">
      {props.hasCreate && (
        <div className="px-2 py-2">
          <div className="float-right">
            <button>
              <MdAddCircle
                size={30}
                onClick={() => {
                  toggleCreateModal();
                }}
              />
            </button>
          </div>
        </div>
      )}
      <SearchBox doSearch={handleSearch} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Picture</TableHead>
            <TableHead>Category</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.helps?.edges.map((help) => (
            <TableRow key={help?.node?.id}>
              <TableCell className="px-6 py-4">{help?.node?.title}</TableCell>
              <TableCell className="px-6 py-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: help?.node?.content as string,
                  }}
                />
              </TableCell>
              <TableCell className="px-6 py-4">{help?.node?.pic}</TableCell>
              <TableCell className="px-6 py-4">
                {help?.node?.category?.name}
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
                        setHelp(help?.node);
                      }}
                    >
                      Show
                    </DropdownMenuItem>
                    {props.hasUpdate && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleUpdateModal();
                          setHelp(help?.node);
                        }}
                      >
                        Update
                      </DropdownMenuItem>
                    )}
                    {props.hasDelete && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleDeleteModal();
                          setHelp(help?.node);
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
      <div className="flex justify-center item-center">
        {hasLess && (
          <Button onClick={loadLess}>{loading ? "Loading..." : "Start"}</Button>
        )}
        {hasMore && (
          <Button onClick={loadMore}>{loading ? "Loading..." : "Next"}</Button>
        )}
      </div>

      {props.hasCreate && (
        <Create open={createModal} onClose={toggleCreateModal} />
      )}
      {help && (
        <>
          <Show node={help} open={showModal} onClose={toggleShowModal} />
          <Update node={help} open={updateModal} onClose={toggleUpdateModal} />
          <Delete node={help} open={deleteModal} onClose={toggleDeleteModal} />
        </>
      )}
    </div>
  );
};
