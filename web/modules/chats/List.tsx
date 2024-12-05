import { ChatItem } from "@/components/chat/ChatItem";
import { apixClient } from "@/clients/axios";
import { socket } from "@/clients/socket";
import { RootState } from "@/store";
import { setActiveId, setChatBoxOpen, setChatModal } from "@/store/slices/chat";
import React, { useContext, useEffect, useState } from "react";
import { MdAddCircle, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { apixURL } from "@/clients/utils";
import { AppContext } from "@/context/AppContext";
import { SearchBox } from "@/components/search/SearchBox";

export const List = () => {
  const state = useSelector((state: RootState) => state.app);
  const { track } = useContext(AppContext);
  const dispatch = useDispatch();
  const [searchedName, setSearchedName] = useState("");
  const [chatsData, setChatsData] = useState<any[]>([]);

  const getUserChats = async () => {
    let data: any[] = [];
    apixClient
      .post('/user/chats', {
        user_id: state.authUserIdPk,
        name: searchedName,
        last: 50,
      })
      .then((response) => {
        response.data.forEach((obj:any) => {
          data.push({
            id: obj.id,
            name: obj.name,
            pic: obj.pic,
            pic1: obj.pic1,
            pic2: obj.pic2,
            is_private: obj.is_private,
            last_content: obj.last_content,
            starter_id: obj.starter_id,
            created_at: obj.created_at,
            modified_at: obj.modified_at,
          })
        })
        setChatsData(data);
      })
      .catch((e: any) => {
        track("no data", e);
      });
  };

  const openShowModal = (id: any) => {
    dispatch(setActiveId(id));
    dispatch(setChatModal(3));
  };

  const handleSearch = (search: string) => {
    setSearchedName(search);
    getUserChats();
  };

  const handleAddChat = (modal: number, e: any) => {
    dispatch(setChatModal(modal));
  };

  const closeChatBox = () => {
    dispatch(setChatBoxOpen(false));
  };

  useEffect(() => {
    getUserChats();
    socket.on("chats update", (data: any) => {
      getUserChats();
      const sortedData = chatsData.sort((a,b) => {
        return a.modified_at.getTime() - b.modified_at.getTime();
      });
      setChatsData(sortedData);
      console.log('chat updated at ', data['content'])
      console.log('chats: ', chatsData)
      console.log('sorted: ', sortedData)
    });
  }, []);

  const imageSelect = (
    isPrivate: boolean,
    pic: string,
    pic1: string,
    pic2: string,
    starterId: string
  ) => {
    if (isPrivate === false && pic) {
      return `${apixURL}/static/uploads/chats/${pic}`;
    } else if (isPrivate === true && starterId === state.authUserIdPk  && pic2) {
      return `${apixURL}/static/uploads/chats/${pic2}`;
    } else if (isPrivate === true && starterId !== state.authUserIdPk  && pic1) {
      return `${apixURL}/static/uploads/chats/${pic1}`;
    } else return `${apixURL}/static/uploads/chats/user.svg`;
  };

  return (
    <>
      <div className="chats-header">
        <div className="flex md:flex md:flex-grow flex-row justify-end space-x-2">
          <button onClick={closeChatBox}>
            <MdClose size={25} />
          </button>
          <button onClick={(e: any) => handleAddChat(2, e)}>
            <MdAddCircle size={25} />
          </button>
        </div>
      </div>
      <div className="chats-body">
        <div className="py-2">
          <SearchBox placeholder="Search chat names!" doSearch={handleSearch} />
        </div>
        {chatsData.map((chat, i) => (
          <ChatItem
            key={i}
            chatName={chat.name}
            imageSource={imageSelect(
              chat.is_private,
              chat.pic,
              chat.pic1,
              chat.pic2,
              chat.starter_id
            )}
            lastContent={chat.last_content}
            createdAt={chat.created_at}
            onChatClick={() => openShowModal(chat.id)}
          />
        ))}
      </div>
    </>
  );
};
