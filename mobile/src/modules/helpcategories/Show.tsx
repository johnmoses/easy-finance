import { PageLoading } from '@app/components/PageLoading';
import { useCategorySelectQuery } from '@app/gql/schemas';
import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import { List } from '../helps/List';
import { styles } from '@app/styles';

interface ShowProps {
  slug: any;
  isModal?: boolean;
  open?: boolean;
  close?: () => void;
}

export const Show: React.FC<ShowProps> = props => {
  const theme = useTheme();
  const { loading, data, error } = useCategorySelectQuery({
    variables: {
      slug: props.slug,
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
        <Paragraph>{data?.category?.description}</Paragraph>
        {/* <Text>
          Date Added: {moment(data?.category?.createdAt).format('llll')}
        </Text> */}
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
    <>
      <Card>
        <Card.Title title={data?.category?.name} />
        <Card.Content>
          <ShowContent />
        </Card.Content>
      </Card>
      <List categoryId={data?.category?.id} />
    </>
  );
};
