import Realm from 'realm';
import { Chat, Message } from './schema/Chat';

import { createRealmContext } from '@realm/react';
import { User } from './schema/User';
import { Analytic } from './schema/Analytic';
import { Setting } from './schema/Setting';

export const realmConfig: Realm.Configuration = {
  schema: [
    Setting,
    Analytic,
    User,
    Chat,
    Message,
  ],
  schemaVersion: 17, //17 is next
};

export const realmContext = createRealmContext(realmConfig);

export const { RealmProvider, useRealm, useQuery, useObject } = realmContext;

export const generateId = (userPK: any) => {
  const utime = Math.floor(Date.now() / 1000).toString();
  const globalId = userPK + utime;
  return globalId;
};
