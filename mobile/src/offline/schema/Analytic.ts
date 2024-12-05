import { ObjectSchema } from 'realm';
import Realm from 'realm';

export class Analytic extends Realm.Object<Analytic> {
  id!: string;
  anonymousId?: string;
  userId?: string;
  userTraits?: string;
  path?: string;
  url?: string;
  channel?: string;
  event?: string;
  eventItems?: string;
  createdAt?: Date;
  hasLocalContent?: boolean;
  isSynced?: boolean;
  static schema: ObjectSchema = {
    name: 'Analytic',
    properties: {
      id: 'string',
      anonymousId: 'string?',
      userId: 'string?',
      userTraits: 'string?',
      path: 'string?',
      url: 'string?',
      channel: 'string?',
      event: 'string?',
      eventItems: 'string?',
      createdAt: {
        type: 'date',
        default: () => new Date().toJSON(),
      },
      isSynced: { type: 'bool', default: false },
    },
    primaryKey: 'id',
  };
}
