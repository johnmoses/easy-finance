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

interface MinuteStockPricesProps {
  search?: string;
  last?: number;
}

export const MinuteStockPrices: React.FC<MinuteStockPricesProps> = (props) => {
  const [stockprices, setStockPrices] = useState<any[]>([]);

  const getStockPrices = async () => {
    apixClient
    .post(`/stock/prices`, {
      symbol: "AMZN"
    })
      .then((response) => {
        setStockPrices(response.data);
        console.log('StockPrice: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getStockPrices();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Stock Prices</h1>
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
