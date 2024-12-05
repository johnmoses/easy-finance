import { useBannerListQuery } from "@/gql/schemas";
import React, { useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { Create } from "./Create";
import { Show } from "./Show";
import { Update } from "./Update";
import { Delete } from "./Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { apixURL } from "@/clients/utils";

interface TablifyProps {
  isDeleted?: boolean;
  last?: number;
  hasCreate?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const { loading, data, refetch, error } = useBannerListQuery({
    variables: {
      isDeleted: false,
      last: props.last,
    },
  });

  // const handleSearch = (search: string) => {
  //   refetch({
  //     search: search,
  //     last: props.last,
  //     isDeleted: props.isDeleted,
  //   });
  // };

  const [banner, setBanner] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleCreateModal() {
    setCreateModal(!createModal);
    refetch({
      isDeleted: false,
      last: props.last,
    });
  }

  function toggleUpdateModal() {
    setUpdateModal(!updateModal);
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
      {/* <SearchBox doSearch={handleSearch} /> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Banner</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Picture</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.banners?.edges.map((banner) => (
            <TableRow key={banner?.node?.id}>
              <TableCell className="px-6 py-4">{banner?.node?.title}</TableCell>
              <TableCell className="px-6 py-4">
                {banner?.node?.content}
              </TableCell>
              <TableCell>
                {banner?.node?.isActive === false ? "No" : "Yes"}
              </TableCell>
              <TableCell className="px-6 py-4">
                <img
                  height={50}
                  width={50}
                  src={`${apixURL}/static/uploads/banners/${banner?.node?.pic}`}
                />
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
                        setBanner(banner?.node);
                      }}
                    >
                      Show
                    </DropdownMenuItem>
                    {props.hasUpdate && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleUpdateModal();
                          setBanner(banner?.node);
                        }}
                      >
                        Update
                      </DropdownMenuItem>
                    )}
                    {props.hasDelete && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleDeleteModal();
                          setBanner(banner?.node);
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
      {banner && (
        <>
          <Show data={banner} open={showModal} onClose={toggleShowModal} />
          <Update
            node={banner}
            open={updateModal}
            onClose={toggleUpdateModal}
          />
          <Delete
            node={banner}
            open={deleteModal}
            onClose={toggleDeleteModal}
          />
        </>
      )}
    </div>
  );
};
