import { RootState } from "@/store";
import Link from "next/link";
import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  id?: any;
}

const Menus = ({ id }: Props) => {
  const state = useSelector((state: RootState) => state.app);
  const [openMenu, setMenuOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setMenuOpen(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MdMenu size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/stocks`}>Home</Link>
        </DropdownMenuItem>
        {openMenu === true && (
          <>
            <DropdownMenuItem>
              <Link href={`/stocks/topgainers`}>Top Gainers</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/stocks/stockprices`}>Stock Prices</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/stocks/stickers`}>Stickers</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menus;
