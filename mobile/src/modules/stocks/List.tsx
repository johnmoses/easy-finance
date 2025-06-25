import { PageLoading } from '@app/components/PageLoading';
import { SearchBox } from '@app/components/SearchBox';
import { useHelpListQuery } from '@app/gql/schemas';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Paragraph } from 'react-native-paper';

interface ListProps {
  categoryId?: any;
}

export const List: React.FC<ListProps> = props => {
  const navigation = useNavigation<any>();
  const [after, setAfter] = useState<any>('');
  const { loading, data, error, refetch } = useHelpListQuery({
    variables: {
      categoryId: props.categoryId,
      isDeleted: false,
      first: 20,
      after: after,
    },
  });
  const hasLess = Boolean(data?.helps?.count! >= 20);
  const hasMore = Boolean(data?.helps?.pageInfo.hasNextPage);

  const handleSearch = (search: string) => {
    refetch({
      search: search,
      isDeleted: false,
    });
  };

  const loadLess = () => {
    setAfter('');
  };

  const loadMore = () => {
    setAfter(data?.helps?.pageInfo.endCursor);
  };

  const goTo = (id: any) => {
    navigation.navigate('HelpScreen', { id });
  };

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

  return (
    <>
      <SearchBox doSearch={handleSearch} />
      <FlatList
        data={data?.helps?.edges}
        keyExtractor={item => item?.node?.id as string}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => goTo(item?.node?.id)}>
              <Card>
                <Card.Title title={item?.node?.title} />
                <Card.Content>
                  <Paragraph>{item?.node?.content}</Paragraph>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {hasLess && (
              <Button onPress={loadLess}>
                {loading ? 'Loading...' : 'Start'}
              </Button>
            )}
            {hasMore && (
              <Button onPress={loadMore}>
                {loading ? 'Loading...' : 'More...'}
              </Button>
            )}
          </View>
        }
      />
    </>
  );
};
