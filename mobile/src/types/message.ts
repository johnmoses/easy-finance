export interface IMessage {
    id: string;
    pk: string
    content: string;
    attachment: string;
    chatId: string;
    senderId: string;
    senderUsername: string;
    createdAt: string;
    isRead: boolean;
    readAt: string;
    isDeleted: boolean;
    deletedAt: string;
    hasLocalContent: boolean;
    isSynced: boolean;
  };