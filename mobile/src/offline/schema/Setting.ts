import { ObjectSchema } from 'realm';
import Realm from 'realm'

export class Setting extends Realm.Object<Setting> {
  id!: string;
  name?: string;
  value?: string;
  numValue?: string
  boolValue?: boolean;
  other?: string;
  static schema: ObjectSchema = {
    name: 'Setting',
    properties: {
      id: 'string',
      name: 'string?',
      prop: 'string?',
      value: 'string?',
      numValue: { type: 'float', default: 0 },
      boolValue: { type: 'bool', default: false },
      other: 'string?',
    },
    primaryKey: 'id',
  };
}

  /* Preferences codes
   * 100 - appLocale
   * 200 - authToken
   * 201 - appUserId
   * 202 - appUserName
   * 203 - appUserPk
   * 300 - isOffline
   * 400 - appTheme
   * 500 - dbSync
   * 600 - fontSize
   * 700 - playerSpeed
   */
  