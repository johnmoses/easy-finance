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

interface TablifyProps {
  search?: string;
  last?: number;
}

export const Stocks: React.FC<TablifyProps> = (props) => {
  const [stocks, setStocks] = useState<any[]>([]);

  const getStocks = async () => {
    apixClient
    .post(`/stocks`, {
      last: 5,
    })
      .then((response) => {
        setStocks(response.data);
        console.log('stocks: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getStocks();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Stocks</h1>
      {/* <img src={`data:image/png:base64,${plot}`} /> */}
      {/* <SearchBox doSearch={handleSearch} /> */}
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolios.map((portfolio) => (
            <TableRow key={portfolio.Date}>
              <TableCell className="px-6 py-4">{portfolio.Date}</TableCell>
              <TableCell className="px-6 py-4">
                {portfolio.Date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </>
  );
};
