import { useUserListQuery } from "@/gql/schemas";
import React, { useState } from "react";
import moment from "moment";
import { SearchBox } from "@/components/search/SearchBox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Show } from "./Show";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ToggleAdmin } from "./ToggleAdmin";

interface TablifyProps {
  last?: number;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasAdmin?: boolean;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const [user, setUser] = useState<any>();
  const [after, setAfter] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [adminToggleModal, setAdminToggleModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleAdminToggleModal() {
    setAdminToggleModal(!adminToggleModal);
  }

  const { loading, data, error, refetch } = useUserListQuery({
    variables: {
      isDeleted: false,
      first: 20,
      after: after,
    },
  });

  const hasLess = Boolean(data?.users?.count! >= 20);
  const hasMore = Boolean(data?.users?.pageInfo.hasNextPage);

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
    setAfter(data?.users?.pageInfo.endCursor);
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
    <>
      <SearchBox doSearch={handleSearch} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users?.edges.map((user) => (
            <TableRow key={user?.node?.id}>
              <TableCell>{user?.node?.username}</TableCell>
              <TableCell>{user?.node?.mobile}</TableCell>
              <TableCell>{user?.node?.email}</TableCell>
              <TableCell>
                {user?.node?.isVerified === false ? "No" : "Yes"}
              </TableCell>
              <TableCell>
                {user?.node?.isAdmin === false ? "No" : "Yes"}
              </TableCell>
              <TableCell>
                {moment(user?.node?.dateJoined).format("ll")}
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
                        setUser(user?.node);
                      }}
                    >
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {props.hasAdmin && (
                      <DropdownMenuItem
                        onClick={() => {
                          toggleAdminToggleModal();
                          setUser(user?.node);
                        }}
                      >
                        Add Admin
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

      {user && (
        <>
          <Show node={user} open={showModal} onClose={toggleShowModal} />
          <ToggleAdmin
            node={user}
            open={adminToggleModal}
            onClose={toggleAdminToggleModal}
          />
        </>
      )}
    </>
  );
};
