import { Screen } from '@app/components/Screen';
import React from 'react';
import { List } from '@app/modules/helpcategories/List';
import { Show } from '@app/modules/helpcategories/Show';

export const HelpCategoriesScreen = () => {
  return (
    <Screen>
      <List />
    </Screen>
  );
};

export const HelpCategoryScreen = ({ route }: any) => {
  const { slug } = route.params;
  return <Screen>{slug && <Show slug={slug} />}</Screen>;
};
