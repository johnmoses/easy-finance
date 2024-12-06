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

interface TopGainersProps {
  isDeleted?: boolean;
  last?: number;
}

export const TopGainers: React.FC<TopGainersProps> = (props) => {
  const [tableData, setTableData] = useState<any[]>([]);

  const getTopGainers = async () => {
    apixClient
    .post(`/stock/topgainers`)
      .then((response) => {
        setTableData(response.data);
        console.log('TopGainers: ', response.data);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getTopGainers();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Top Gainers</h1>
      {/* <img src={`data:image/png:base64,${plot}`} /> */}
      {/* <SearchBox doSearch={handleSearch} /> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow key={index}>
              <TableCell className="px-6 py-4">{data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
