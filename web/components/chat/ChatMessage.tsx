import React, { useState } from "react";
import styles from "./ChatMessage.module.css";
import { apixURL } from "@/clients/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
// import { DotsHorizontalIcon } from "react-icons";

interface IProps {
  sender?: string;
  message?: string;
  attachment?: string;
  timestamp?: string;
  isRightAlign?: boolean;
  isDeleted?: boolean;
  deleteMessage: () => void;
}

export const ChatMessage = ({
  sender,
  message,
  attachment,
  timestamp,
  isRightAlign,
  isDeleted,
  deleteMessage,
}: IProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);

  const docSelect = (attachment: any) => {
    const ext = attachment.split('.').pop();
    if (ext === '') {
      return <div />;
    }
    else if (ext === 'png' || 'jpg' || 'jpeg') {
      return (
        <img
          src={`${apixURL}/static/uploads/chats/${attachment}`}
          height={100}
          width={150}
        />
      )
    }
    else if (ext === 'mp4') {
      return (
        <video
          src={`${apixURL}/static/uploads/chats/${attachment}`}
          height={'auto'}
          width={150}
          controls={true}
          autoPlay={true}
        />
      )
    }
    else return (
      <div>Attachment</div>
    )
  }
  return (
    <>
      <div className={styles.container}>
        <div className={isRightAlign ? styles.others : styles.me}>
          <div className={isRightAlign ? styles.others_data : styles.me_data}>
            {isDeleted ? (
              <div>Message deleted...</div>
            ) : (
              <div>
                <div>
                  <div className="float-right flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          {/* <DotsHorizontalIcon className="h-4 w-4" /> */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          deleteMessage()
                          toggleVisible()
                        }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>{sender}</div>
                </div>
                <div>
                  {message}
                  {attachment && docSelect(attachment)}
                  <div>{timestamp}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
