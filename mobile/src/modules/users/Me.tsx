import { useMeQueryQuery } from '@app/gql/schemas';
import React from 'react';
import { Card, Paragraph, Text } from 'react-native-paper';

export const Me = () => {
  const { data } = useMeQueryQuery();

  return (
    <>
      <Card>
        <Card.Title title={data?.me?.username} />
        <Card.Content>
          <Paragraph>{data?.me?.email}</Paragraph>
          <Text>{data?.me?.firstName}</Text>
        </Card.Content>
      </Card>
    </>
  );
};
