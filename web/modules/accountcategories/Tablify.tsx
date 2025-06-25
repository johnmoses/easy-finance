import { useAccountCategoryListQuery } from "@/gql/schemas";
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
  last?: number;
  hasCreate?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, error, refetch } = useAccountCategoryListQuery({
    variables: { search: "" },
  });

  const [category, setCategory] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleCreateModal() {
    setCreateModal(!createModal);
    refetch({
      last: props.last
    });
  }

  function toggleUpdateModal() {
    setUpdateModal(!updateModal);
  }

  function toggleDeleteModal() {
    setDeleteModal(!deleteModal);
    refetch({
      last: props.last,
    });
  }

  function toggleRemoveModal() {
    setRemoveModal(!removeModal);
  }

  const handleSearch = (search: string) => {
    refetch({ search: search });
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
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Accounts</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.accountcategories?.edges.map((category) => (
            <TableRow key={category?.node?.id}>
              <TableCell className="px-6 py-4">
                {category?.node?.name}
              </TableCell>
              <TableCell className="px-6 py-4">
                {category?.node?.description}
              </TableCell>
              <TableCell className="px-6 py-4">
                {category?.node?.categoryAccounts.count}
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
                        setCategory(category?.node);
                      }}
                    >
                      Show
                    </DropdownMenuItem>
                    {props.hasUpdate && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleUpdateModal();
                          setCategory(category?.node);
                        }}
                      >
                        Update
                      </DropdownMenuItem>
                    )}
                    {props.hasDelete && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleDeleteModal();
                          setCategory(category?.node);
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

      {props.hasCreate && (
        <Create open={createModal} onClose={toggleCreateModal} />
      )}
      {category && (
        <>
          <Show node={category} open={showModal} onClose={toggleShowModal} />
          <Update
            node={category}
            open={updateModal}
            onClose={toggleUpdateModal}
          />
          <Delete
            node={category}
            open={deleteModal}
            onClose={toggleDeleteModal}
          />
        </>
      )}
    </div>
  );
};
