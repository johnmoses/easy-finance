import { PageLoading } from '@app/components/PageLoading';
import { useHelpSelectQuery } from '@app/gql/schemas';
import { styles } from '@app/styles';
import moment from 'moment';
import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  Text,
  useTheme,
} from 'react-native-paper';

interface ShowProps {
  id: any;
  isModal?: boolean;
  open?: boolean;
  close?: () => void;
}

export const Show: React.FC<ShowProps> = props => {
  const theme = useTheme();
  const { loading, data, error } = useHelpSelectQuery({
    variables: {
      id: props.id,
    },
  });

  if (loading) {
    return (
      <PageLoading>
        <ActivityIndicator animating={true} />
      </PageLoading>
    );
  }

  if (error) {
    return (
      <PageLoading>
        <Paragraph>No items</Paragraph>
      </PageLoading>
    );
  }

  const ShowContent: React.FC = () => {
    return (
      <>
        <Text>{data?.help?.title}</Text>
        <Paragraph>{data?.help?.content}</Paragraph>
        <Text>Date Added: {moment(data?.help?.createdAt).format('llll')}</Text>
      </>
    );
  };

  if (props.isModal) {
    return (
      <Modal visible={props.open}>
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Button onPress={props.close}>Close</Button>
            </View>
            <ShowContent />
          </View>
        </ScrollView>
      </Modal>
    );
  }

  return (
    <Card>
      <Card.Title title={data?.help?.title} />
      <Card.Content>
        <ShowContent />
      </Card.Content>
    </Card>
  );
};
