import React from 'react';
import { Screen } from '@app/components/Screen';
import { List } from '@app/modules/chats/List';
import { Show } from '@app/modules/chats/Show';
import { Info } from '@app/modules/chats/Info';

export const ChatsScreen = () => {

  return (
    <Screen>
      <List />
    </Screen>
  );
};

export const ChatScreen = ({ route }: any) => {
  const { id } = route.params;
  return <Screen>{id && <Show />}</Screen>;
};

export const ChatInfoScreen = () => {
  return (
    <Screen>
      <Info />
    </Screen>
  );
};
