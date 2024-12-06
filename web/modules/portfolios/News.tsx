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

interface NewsProps {
  isDeleted?: boolean;
  last?: number;
}

export const News: React.FC<NewsProps> = (props) => {
  const [news, setNews] = useState<any[]>([]);

  const getNews = async () => {
    apixClient
    .post(`/news`)
      .then((response) => {
        setNews(response.data);
        console.log('news: ', response);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getNews();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>News</h1>
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
