import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

interface IProps {
  chatName?: string;
  imageSource?: any;
  lastContent?: any;
  createdAt?: any;
  onChatClick?: (data: any) => void;
}

export const ChatItem: React.FC<IProps> = ({
  chatName,
  imageSource,
  lastContent,
  createdAt,
  onChatClick,
}) => {
  return (
    <div
      className="flex flex-wrap"
      onClick={onChatClick}
      style={{ cursor: "pointer" }}
    >
      <Avatar>
        <AvatarImage src={imageSource} alt="@shadcn" />
        <AvatarFallback>{chatName}</AvatarFallback>
      </Avatar>
      <div className="p-2 space-y-1 font-medium dark:text-white">
        <div>{chatName}</div>
        <div className="text-sm">
          {lastContent} {moment(createdAt).format('lll')}
        </div>
      </div>
    </div>
  );
};
