import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { socket } from "@/clients/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MdAdd } from "react-icons/md";
import { Textarea } from "../ui/textarea";

interface IProps {
  onSendClick: (content: string, attachment: string) => void;
}

export const ChatInput = ({ onSendClick }: IProps) => {
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const inputRef = useRef(null);

  const getAttachment = async (e: any) => {
    e.preventDefault();
    const { value: file } = await Swal.fire({
      title: "Select file",
      input: "file",
      inputAttributes: {
        accept: "image/*,video/*,audio/*,application/pdf,application/msword",
        "area-label": "Upload attachment",
      },
    });

    if (file) {
      if (file.size > 2100000) {
        Swal.fire(
          "Can't proceed",
          "File too large! (Only up to 2MB acceptable)",
          "error"
        );
        console.log("file too big");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit("upload file", {
          content: content,
          attachment: file.name.split(/[^a-zA-Z0-9\-\_\.]/gi).join("_"),
          file: file,
          chat_id: chatState.activeId,
          sender_id: state.authUserIdPk,
        });
        setContent("");
        setAttachment("");
        Swal.fire({
          title: "Done",
          text: "Your file was successfully uploaded!",
          timer: 1500,
        });
      };
      reader.readAsDataURL(file);
      console.log("got file");
    }
  };

  return (
    <div className="flex my-1">
      <button onClick={(e) => getAttachment(e)}>
        <MdAdd size={20} />
      </button>
      <div className="flex-initial w-60">
        <Textarea
          className="text-white"
          value={content}
          ref={inputRef} rows={1}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSendClick(content, attachment);
              setContent("");
              setAttachment("");
            }
          }}
          placeholder="Type here..."
        />
      </div>
      <div className="flex-none w-7">
        <svg
          onClick={() => {
            onSendClick(content, attachment);
            setContent("");
            setAttachment("");
          }}
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 10 16"
        >
          <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z" />
        </svg>
      </div>
    </div>
  );
};
