import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/store";
import Link from "next/link";
import React from "react";
import { MdMenu } from "react-icons/md";
import { useSelector } from "react-redux";

export const Menus = () => {
  const state = useSelector((state: RootState) => state.app);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MdMenu size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/admin`}>Dashboard</Link>
        </DropdownMenuItem>
        {state.isAdmin ? (
          <>
            <DropdownMenuItem>
              <Link href="/admin/chats">Chats</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/banners">Banners</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/users">Users</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/helpcategories">Help Categories</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/helps">Helps</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/feedbacks">Feedbacks</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/analytics">Analytics</Link>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
