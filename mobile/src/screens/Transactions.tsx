import { Screen } from '@app/components/Screen';
import React from 'react';
import { List } from '@app/modules/helps/List';
import { Show } from '@app/modules/helps/Show';

export const TransactionsScreen = () => {
  return (
    <Screen>
      <List />
    </Screen>
  );
};

export const TransactionScreen = ({ route }: any) => {
  const { id } = route.params;
  return <Screen>{id && <Show id={id} />}</Screen>;
};
