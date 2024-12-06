import React, { useState } from "react";
// import { SearchBox } from "@/components/search/SearchBox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apixClient } from "@/clients/axios";

interface StickersProps {
  isDeleted?: boolean;
  last?: number;
}

export const Stickers: React.FC<StickersProps> = (props) => {
  const [stickers, setStickers] = useState<any[]>([]);

  const getStickers = async () => {
    apixClient
    .post(`/stock/stickers`)
      .then((response) => {
        setStickers(response.data);
        console.log('Stickers: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getStickers();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Stickers</h1>
      {/* <img src={`data:image/png:base64,${plot}`} /> */}
      {/* <SearchBox doSearch={handleSearch} /> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stickers.map((sticker, index) => (
            <TableRow key={index}>
              <TableCell className="px-6 py-4">{sticker}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
