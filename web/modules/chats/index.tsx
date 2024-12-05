import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { List } from "./List";
import { Create } from "./Create";
import { Show } from "./Show";
import { Info } from "./Info";
import { Update } from "./Update";
import { AddParticipant } from "./AddParticipant";
import { Welcome } from "./Welcome";
import { setChatBoxOpen } from "@/store/slices/chat";
import { setHelpBoxOpen } from "@/store/slices/help";
import { UpdatePic } from "./UpdatePic";
import { ActivateAssist } from "./ActivateAssist";

const Chatbox = () => {
  const chatState = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const toggleChatBox = () => {
    if (chatState.chatBoxOpen === false) {
      dispatch(setHelpBoxOpen(false));
      dispatch(setChatBoxOpen(true));
      // console.log('chatbox opened')
    } else {
      dispatch(setChatBoxOpen(false));
      console.log('chatbox closed');
    }
  };

  const closeChatBox = () => {
    dispatch(setChatBoxOpen(false));
  };

  return (
    <div className="border-none fixed z-50  bottom-10 border bg-black text-white rounded-full right-0 text-4xl outline-none ml-0 mr-3 md:mr-5">
      <div className="chatbox">
        <div
          className={
            chatState.chatBoxOpen === false
              ? "chatbox-modal-closed"
              : "chatbox-modal"
          }
        >
          <div className="chats">
            {chatState.chatModal === 0 && <Welcome />}
            {chatState.chatModal === 1 && <List />}
            {chatState.chatModal === 2 && <Create />}
            {chatState.chatModal === 3 && <Show />}
            {chatState.chatModal === 4 && <Info />}
            {chatState.chatModal === 5 && <Update />}
            {chatState.chatModal === 6 && <UpdatePic />}
            {chatState.chatModal === 7 && <AddParticipant />}
            {chatState.chatModal === 8 && <ActivateAssist />}
          </div>
        </div>
        <div className="chatbox-button">
          <svg
            onClick={() => toggleChatBox()}
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
