import { ObjectSchema } from 'realm';
import Realm from 'realm';
import { User } from './User';

export class Chat extends Realm.Object {
  id!: string;
  name?: string;
  description?: string;
  pic?: string;
  pic1?: string;
  pic2?: string;
  isBot?: boolean;
  isPrivate?: boolean;
  lastContent?: string;
  unreadMessages?: number = 0;
  starterId?: string;
  createdAt?: Date;
  isModified?: boolean;
  modifiedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  restoredAt?: Date;
  messages?: Realm.List<Message>;
  participants?: Realm.List<User>;
  hasLocalContent?: boolean;
  isSynced?: boolean;
  static schema: ObjectSchema = {
    name: 'Chat',
    properties: {
      id: 'string',
      name: 'string?',
      description: 'string?',
      pic: 'string?',
      pic1: 'string?',
      pic2: 'string?',
      isBot: { type: 'bool', default: false },
      isPrivate: { type: 'bool', default: false },
      lastContent: 'string?',
      unreadMessages: { type: 'int', default:0 },
      starterId: 'string?',
      createdAt: 'date?',
      isModified: { type: 'bool', default: false },
      modifiedAt: 'date?',
      isDeleted: { type: 'bool', default: false },
      deletedAt: 'date?',
      restoredAt: 'date?',
      messages: 'Message[]',
      participants: 'User[]',
      hasLocalContent: { type: 'bool', default: false },
      isSynced: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };
}

export class Message extends Realm.Object {
  id!: string;
  pk?: string;
  content?: string;
  attachment?: string;
  chatId?: string;
  senderId?: string;
  senderUsername?: string;
  sender?: User;
  createdAt?: string;
  isRead?: boolean;
  readAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  restoredAt?: Date;
  hasLocalContent?: boolean;
  isSynced?: boolean;
  static schema: ObjectSchema = {
    name: 'Message',
    properties: {
      id: 'string',
      pk: 'string?',
      content: 'string?',
      attachment: 'string?',
      chatId: 'string?',
      senderId: 'string?',
      senderUsername: 'string?',
      chat: {
        type: 'linkingObjects',
        objectType: 'Chat',
        property: 'messages',
      },
      sender: 'User?',
      createdAt: 'date?',
      isRead: { type: 'bool', default: false },
      readAt: 'date?',
      isDeleted: { type: 'bool', default: false },
      deletedat: 'date?',
      restoredAt: 'date?',
      hasLocalContent: { type: 'bool', default: false },
      isSynced: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };
}
