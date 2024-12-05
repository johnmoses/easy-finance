import { Button } from "@/components/ui/button";
import { setChatBoxOpen, setChatModal } from "@/store/slices/chat";
import Link from "next/link";
import React from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

export const Welcome = () => {
  const dispatch = useDispatch();

  const openAssistModal = () => {
    dispatch(setChatModal(8));
  };

  const closeChatBox = () => {
    dispatch(setChatBoxOpen(false));
  };

  return (
    <>
      <div className="chats-header">
        <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1">
          <button onClick={closeChatBox}>
            <MdClose size={25} />
          </button>
        </div>
      </div>
      <div className="chats-body">
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="p-2">Welcome</div>
          <div className="p-2">
            <Link href="/auth/signin">Sign in to chat</Link>
          </div>
          <div className="p-1">
            <Button
              className="m-2 border-red bg-sky-500"
              color="gray"
              onClick={() => openAssistModal()}
            >
              Start conversation with AI Assistant
            </Button>
          </div>
        </div>
      </div>
      <div className="chats-footer"></div>
    </>
  );
};
