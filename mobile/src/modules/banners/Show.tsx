import { apixURL } from '@app/clients/utils';
import { PageLoading } from '@app/components/PageLoading';
import { useBannerSelectQuery } from '@app/gql/schemas';
import { styles } from '@app/styles';
import React from 'react';
import { Dimensions, Image, Modal, ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Paragraph,
  Text,
  useTheme,
} from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

interface ShowProps {
  id: any;
  open?: boolean;
  close?: () => void;
}

const windowWidth = Dimensions.get('window').width;

export const Show: React.FC<ShowProps> = props => {
  const { loading, data, error } = useBannerSelectQuery({
    variables: {
      id: props.id,
    },
  });

  const theme = useTheme();

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
      <View>
        <View>
          <Image
            source={{
              uri: (data?.banner?.pic as string)
                ? `${apixURL}/static/uploads/banners/${data?.banner?.pic}`
                : `${apixURL}/static/uploads/testimonies/testimony.png`,
            }}
            style={styles.largeImageStyle}
          />
        </View>
        <Text style={{ fontWeight: 'bold' }}>Title: {data?.banner?.title}</Text>
        <RenderHtml
          source={{ html: data?.banner?.content as string }}
          contentWidth={windowWidth * 0.9}
          tagsStyles={{
            p: { color: theme.colors.primary },
          }}
        />
      </View>
    );
  };

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
};
