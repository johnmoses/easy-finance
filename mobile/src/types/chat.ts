export interface IChat {
    id: string;
    name: string;
    description: string;
    pic: string;
    pic1: string;
    pic2: string;
    isBot: boolean;
    isPrivate: boolean;
    lastContent: string;
    unreadMessages: number;
    starterId: string;
    createdAt: string;
    modifiedAt: string;
    isDeleted: boolean;
    deletedAt: string;
    hasLocalContent: boolean;
    isSynced: boolean;
  };