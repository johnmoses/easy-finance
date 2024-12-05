import { PageLoading } from '@app/components/PageLoading';
import {
  BannerListDocument,
  BannerListQuery,
} from '@app/gql/schemas';
import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import { Show as ShowBanner } from '../banners/Show';
import { apixURL } from '@app/clients/utils';
import { useApolloClient } from '@apollo/client';
import Carousel from 'react-native-reanimated-carousel';
import moment from 'moment';

export const Welcome = () => {
  const client = useApolloClient();
  const [bannerModal, setBannerModal] = useState<boolean>(false);
  const [selectedBannerId, setSelectedBannerId] = useState();
  const [selectedTestimonyId, setSelecteTestimonyId] = useState();
  const [dataError, setDataError] = useState(false);
  const [bannerData, setBannerData] = useState<any[]>([]);

  function toggleBannerModal() {
    setBannerModal(!bannerModal);
  }

  const getBannerData = async () => {
    let data: any[] = [];
    try {
      const res = await client.query<BannerListQuery>({
        query: BannerListDocument,
        variables: {
          isDeleted: false,
          last: 5,
        },
      });
      if (res !== undefined) {
        const banners = res?.data?.banners?.edges;
        banners?.forEach(obj => {
          data.push({
            id: obj?.node?.id,
            title: obj?.node?.title,
            pic: obj?.node?.pic,
          });
        });
      } else {
        setDataError(true);
      }
      setBannerData(data);
    } catch (e) {
      console.log(e);
    }
  };


  React.useEffect(() => {
    getBannerData();
  }, []);

  const showBanner = (id: any) => {
    setSelectedBannerId(id);
    toggleBannerModal();
  };

  const showTestimony = (id: any) => {
    setSelecteTestimonyId(id);
  };

  const width = Dimensions.get('window').width;

  if (dataError) {
    return (
      <PageLoading>
        <Paragraph>No items</Paragraph>
      </PageLoading>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={true}
          data={bannerData}
          scrollAnimationDuration={1000}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => showBanner(item.id)}>
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: 'center',
                }}>
                <Image
                  source={{
                    uri: `${apixURL}/static/uploads/banners/${item.pic}`,
                  }}
                  style={{ height: width/2, width: width }} accessibilityLabel='Image'
                />
                <Text style={{ textAlign: 'center' }}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {selectedBannerId && (
        <ShowBanner
          id={selectedBannerId}
          open={bannerModal}
          close={toggleBannerModal}
        />
      )}
    </>
  );
};
