import React, { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { socket } from "@/clients/socket";
import { apixClient } from "@/clients/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { apixURL } from "@/clients/utils";
import { AppContext } from "@/context/AppContext";

export const Show = () => {
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const { track } = useContext(AppContext);
  const [chat, setChat] = useState<any>("");
  const [messageData, setMessageData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const endOfMessagesRef = useRef<any>(null);


  const getChat = async () => {
    apixClient
      .get(`/chat/${chatState.activeId}`)
      .then((response) => {
        setChat(response.data);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  const getPrevious = async () => {
    let data: any[] = [];
    apixClient
      .post('/chat/messages', {
        chat_id: chatState.activeId,
        content: '',
        last: 50,
      })
      .then((response) => {
        response.data.forEach((obj:any) => {
          data.push({
            // id: obj.id,
            content: obj.content,
            attachment: obj.attachment,
            chat_id: obj.chat_id,
            sender_id: obj.sender.id,
            sender_username: obj.sender.username,
            // created_at: obj.created_at,
            is_deleted: obj.is_deleted,
            // deleted_at: obj.deleted_at,
          })
        })
        setMessageData(data);
      })
      .catch((e: any) => {
        track("no data", e);
      });
  };

  const handleCreateMessage = (content: string) => {
    socket.emit("send message", {
      content: content,
      attachment: "",
      chat_id: chat.id,
      sender_id: state.authUserIdPk,
      sender_username: state.authUserName,
      is_private: chat.is_private,
      is_bot: chat.is_bot,
      starter_id: chat.starter_id,
    });
    socket.emit("update chats", {
      chat_id: chat.id, 
    })
    track("Sent message", content);
  };

  const handleDeleteMessage = (id: any) => {
    track("deleting...", id);
    socket.emit("delete message", {
      id: id,
    });
  };

  const openListModal = () => {
    dispatch(setChatModal(1));
  };

  const openInfoModal = () => {
    dispatch(setChatModal(4));
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  React.useEffect(() => {
    getChat();
    getPrevious();

    socket.on('join', (data: any) => {
      const mData: any[] = [];
      mData.push({
        content: data['content'],
        attachment: data['attachment'],
        chat_id: data['chat_id'],
        sender_id: data['sender_id'],
        sender_username: data['sender_username'],
      })
      setMessageData((messageData) => [...messageData, ...mData])
      console.log('user joined: ', data['user_ids'])
    })

    socket.on('leave', (data: any) => {
      messageData.push({
        'sender': data['sender'],
        'message': data['message'],
        'attachment': data['attachment'],
      })
      console.log('user left: ', data['user_ids'])
    })

    socket.on("send response", (data: any) => {
      const mData: any[] = [];
      try {
        mData.push({
          content: data['content'],
          attachment: data['attachment'],
          chat_id: data['chat_id'],
          sender_id: data['sender_id'],
          sender_username: data['sender_username'],
        })
        setMessageData((messageData) => [...messageData, ...mData])
        console.log('message data: ', messageData)
      } catch (e: any) {
        track("no message", e);
      }
    });

    socket.on("announce delete", () => {
      try {
        getPrevious();
      } catch (e: any) {
        track("no delete", e);
      }
    });
  }, []);

  React.useEffect(() => {
    scrollToBottom()
  }, [messageData]);

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
        <div className="py-2">
          <svg
            onClick={(e) => openListModal()}
            style={{ cursor: "pointer" }}
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 8 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
            />
          </svg>
        </div>
        <div
          className="flex"
          onClick={(e) => openInfoModal()}
          style={{ cursor: "pointer" }}
        >
          <Avatar>
            <AvatarImage
              src={imageSelect(
                chat.is_private,
                chat.pic,
                chat.pic1,
                chat.pic2,
                chat.starter_id
              )}
              alt="@shadcn"
            />
            <AvatarFallback>{chat.name}</AvatarFallback>
          </Avatar>
          <div className="p-2 space-y-1 font-medium dark:text-white">
            <div>{chat.name}</div>
          </div>
        </div>
      </div>
      <div className="chats-body">
        {messageData.map((message, i) => (
          <div key={i}>
            <ChatMessage
              sender={message.sender_username}
              message={message.content}
              attachment={message.attachment}
              timestamp={moment(message.created_at).format("lll")}
              isRightAlign={message.sender_id != state.authUserIdPk}
              isDeleted={message.is_deleted}
              deleteMessage={() => handleDeleteMessage(message.id)}
            />
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="chats-footer">
        <ChatInput onSendClick={handleCreateMessage} />
      </div>
    </>
  );
};
