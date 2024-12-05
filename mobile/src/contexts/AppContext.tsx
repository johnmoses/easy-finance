import React, { createContext } from 'react';
import { useApolloClient } from '@apollo/client';
import { log } from '@app/utils/logs';
import {
  MeQueryDocument,
  MeQueryQuery,
  UserDeleteDocument,
  UserDeleteMutation,
  useAnalyticUpsertMutation,
} from '@app/gql/schemas';
import { useDispatch, useSelector } from 'react-redux';
import {
  flipLoading,
  flipOffline,
  setAdmin,
  setAuth,
  setHasAssist,
  setSignout,
  setUserAvatar,
  setUserId,
  setUserIdPk,
  setUserName,
  setVerified,
} from '@app/store/slices/app';
import { socket } from '@app/clients/socket';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, persistor } from '@app/store';
import { useObject, useRealm } from '@app/offline';
import { generateId } from '@app/offline';
import { User } from '@app/offline/schema/User';
import moment from 'moment';
import { useNetInfo } from '@react-native-community/netinfo';

interface IAppContext {
  setup: () => void;
  track: (event: string, eventItems: string) => void;
  signout: () => void;
  close: () => void;
}

interface Props {
  children: JSX.Element;
}

const AppContext = createContext<IAppContext>({
  setup: () => { },
  track: () => { },
  signout: () => { },
  close: () => { },
});

const AppContextProvider = ({ children }: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);
  const realm = useRealm();
  const meData = useObject(User, state.authUserId);
  const netInfo = useNetInfo();
  const [analyticUpsert] = useAnalyticUpsertMutation();

  React.useEffect(() => {
    dispatch(flipLoading(true));
    setTimeout(() => {
      dispatch(flipLoading(false));
      log('flipped loading')
    }, 3000) // 3 seconds delay

    const bootstrapAsync = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        setup();
      }
      if (netInfo.isConnected) {
        dispatch(flipOffline(false));
      }
      if (!netInfo.isConnected) {
        dispatch(flipOffline(true));
      }
      // if(state.joinedReportBot === false) {
      //   checkbot()
      // }
    };
    bootstrapAsync();

    socket.on('connect', () => {
      log('user connected: '+ socket.id as string);
      socket.emit('client connected ', socket.id);
    });

    socket.on('disconnect', (data: any) => {
      log('user disconnected'+ data);
      socket.emit('client disconnected ', socket.id);
    });
  }, [socket, netInfo]);

  const setup = async () => {
    if (state.isOffline === true) {
      socket.disconnect()
      if (meData) {
        const xid: any = meData.id;
        const idDecodedId = base64.decode(xid);
        const [idType, idPk] = idDecodedId.split(':');
        dispatch(setAuth(true));
        dispatch(setVerified(true));
        dispatch(setAdmin(meData?.isAdmin || false));
        dispatch(setHasAssist(meData?.hasAssist || false));
        dispatch(setUserIdPk(idPk));
        dispatch(setUserId(meData?.id || ''));
        dispatch(setUserName(meData?.username || ''));
        dispatch(setUserAvatar(meData?.avatar || ''));
      }
    } else {
      const res = await client.query<MeQueryQuery>({
        query: MeQueryDocument,
      });
      if (res.data.me?.isVerified === true && res.data.me.isDeleted === false) {
        socket.connect();
        const me = res.data.me;
        const xid: any = res.data.me?.id;
        const idDecodedId = base64.decode(xid);
        const [idType, idPk] = idDecodedId.split(':');
        dispatch(setAuth(true));
        dispatch(setVerified(true));
        dispatch(setAdmin(me?.isAdmin || false));
        // dispatch(setHasAssist(me?.hasAssist || false));
        dispatch(setUserIdPk(idPk));
        dispatch(setUserId(me?.id || ''));
        dispatch(setUserName(me?.username || ''));
        dispatch(setUserAvatar(me?.avatar || ''));
      } else {
        signout();
        log('Could not complete setup this time');
      }
    }
  };

  const track = (event: string, eventItems: string) => {
    if (state.isOffline) {
      try {
        realm.write(() => {
          realm.create('Analytic', {
            id: generateId(state.authUserIdPk).toString(),
            anonymousId: state.authUserId,
            userId: state.authUserId,
            userTraits: '',
            path: state.currentRoute,
            url: '',
            channel: 'mobile',
            event: event,
            eventItems: eventItems,
          });
        });
        log('Tracked offline: ' + event);
      } catch (e) {
        log(e);
      }
      // log(event + ': tracked offline...')
    }
    else {
      analyticUpsert({
        variables: {
          id: generateId(state.authUserIdPk).toString(),
          anonymousId: state.authUserId,
          userId: state.authUserId,
          userTraits: '',
          path: state.currentRoute,
          url: '',
          channel: 'mobile',
          event: event,
          eventItems: eventItems,
          createdAt: moment().format(),
        },
      }).then(() => {
        log('Tracked online: ' + event);
      });
      // log(event + ': tracked online...')
    }
  };

  const signout = async () => {
    AsyncStorage.clear();
    dispatch(setAuth(false));
    dispatch(setVerified(false));
    dispatch(setAdmin(false));
    dispatch(setHasAssist(false));
    dispatch(setUserIdPk(''));
    dispatch(setUserId(''));
    dispatch(setUserName(''));
    dispatch(setUserAvatar(''));
    dispatch(setSignout());
    dispatch({ type: 'LOGOUT' });
    persistor.purge();
    await client
      .clearStore()
      .then(() => {
        client.resetStore();
      })
      .catch(() => {
        log('Cannot reset cache now');
      });
    socket.disconnect();
    realm.write(() => {
      realm.deleteAll();
    });
    log('User signed out');
  };

  const close = async () => {
    const authUserId: any = AsyncStorage.getItem('authUserId');
    const res = await client.mutate<UserDeleteMutation>({
      mutation: UserDeleteDocument,
      variables: {
        id: authUserId,
        isDeleted: true,
      },
    });
    realm.write(() => {
      realm.deleteAll();
    });
    signout();
  };

  return (
    <AppContext.Provider
      value={{
        setup,
        track,
        signout,
        close,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
