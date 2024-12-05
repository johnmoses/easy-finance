import { ObjectSchema } from 'realm';
import Realm from 'realm';

export class User extends Realm.Object<User> {
  id!: string;
  pk?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  avatar?: string;
  gender?: string;
  bio?: string;
  address?: string;
  birthDate?: string;
  isBot?: boolean;
  isVerified?: boolean;
  isUsed?: boolean;
  isAdmin?: boolean;
  isSuperuser?: boolean;
  isStaff?: boolean;
  isActive?: boolean;
  hasAssist?: boolean;
  dateJoined?: Date;
  isModified?: boolean;
  modifiedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  hasLocalContent?: boolean;
  isSynced?: boolean;
  static schema: ObjectSchema = {
    name: 'User',
    properties: {
      id: 'string',
      pk: 'string?',
      username: 'string',
      password: 'string?',
      firstName: 'string?',
      lastName: 'string?',
      mobile: 'string?',
      email: 'string?',
      avatar: 'string?',
      gender: 'string?',
      bio: 'string?',
      address: 'string?',
      birthDate: 'string?',
      isBot: { type: 'bool', default: false },
      isVerified: { type: 'bool', default: false },
      isUsed: { type: 'bool', default: false },
      isAdmin: { type: 'bool', default: false },
      isSuperuser: { type: 'bool', default: false },
      isStaff: { type: 'bool', default: false },
      isActive: { type: 'bool', default: false },
      hasAssist: { type: 'bool', default: false },
      dateJoined: 'date?',
      isModified: { type: 'bool', default: false },
      modifiedAt: 'date?',
      isDeleted: { type: 'bool', default: false },
      deletedAt: 'date?',
      restoredAt: 'date?',
      hasLocalContent: { type: 'bool', default: false },
      isSynced: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };
}
