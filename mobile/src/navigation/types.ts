import { ChatRoom } from '../types';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: { room: ChatRoom };
};

export type MainTabParamList = {
  Home: undefined;
  Finance: undefined;
  Wealth: undefined;
  Planning: undefined;
  Blockchain: undefined;
  Chat: undefined;
};
