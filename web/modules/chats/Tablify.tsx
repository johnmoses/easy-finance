import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Delete } from "./Delete";
import { SearchBox } from "@/components/search/SearchBox";
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
  const [chat, setChat] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  function toggleDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  const getChats = async () => {
    apixClient
    .post(`/chats`, {
      name: '',
      last: 80
    })
      .then((response) => {
        setChats(response.data);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getChats();
  }, []);


  const handleSearch = (search: string) => {
    
  };

  return (
    <>
      <h1>Chats</h1>
      <SearchBox doSearch={handleSearch} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chat</TableHead>
            <TableHead>Starter</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chats.map((chat) => (
            <TableRow key={chat.id}>
              <TableCell className="px-6 py-4">{chat.name}</TableCell>
              <TableCell className="px-6 py-4">
                {chat?.node?.starter?.username}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div>
                  <button>
                    <MdDelete
                      onClick={() => {
                        toggleDeleteModal
                        setChat(chat);
                      }}
                    />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Delete data={chat} open={deleteModal} onClose={toggleDeleteModal} />
    </>
  );
};
