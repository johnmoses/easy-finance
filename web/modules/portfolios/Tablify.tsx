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
  isDeleted?: boolean;
  last?: number;
}

export const Tablify: React.FC<TablifyProps> = (props) => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [plot, setPlot] = useState('');

  const getPortfolios = async () => {
    apixClient
    .post(`/portfolios`, {
      symbols: ["AMZN","AAPL","MSFT"],
    })
      .then((response) => {
        setPortfolios(response.data);
        console.log('portfolioe: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  const plotSample = async () => {
    apixClient
    .get(`/plot/fig`)
      .then((response) => {
        setPlot(response.data);
        console.log('plot: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getPortfolios();
    plotSample();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Portfolios</h1>
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
