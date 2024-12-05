import { PageLoading } from '@app/components/PageLoading';
import { SearchBox } from '@app/components/SearchBox';
import { useCategoryListQuery } from '@app/gql/schemas';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Paragraph } from 'react-native-paper';

interface ListProps {
  isDeleted?: boolean;
}

export const List: React.FC<ListProps> = props => {
  const navigation = useNavigation<any>();
  const [after, setAfter] = useState<any>('');
  const { loading, data, error, refetch } = useCategoryListQuery({
    variables: { slug: '', isDeleted: false, first: 20, after: after },
  });

  const hasLess = Boolean(data?.categories?.count! >= 20);
  const hasMore = Boolean(data?.categories?.pageInfo.hasNextPage);

  const handleSearch = (search: string) => {
    refetch({ search: search, isDeleted: false });
  };

  const loadLess = () => {
    setAfter('');
  };

  const loadMore = () => {
    setAfter(data?.categories?.pageInfo.endCursor);
  };

  const goTo = (slug: any) => {
    navigation.navigate('HelpCategoryScreen', { slug });
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
        data={data?.categories?.edges}
        keyExtractor={item => item?.node?.id as string}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => goTo(item?.node?.slug)}>
              <Card>
                <Card.Title title={item?.node?.name} />
                <Card.Content>
                  <Paragraph>{item?.node?.description}</Paragraph>
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
