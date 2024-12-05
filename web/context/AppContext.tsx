import { useApolloClient } from "@apollo/client";
import {
  MeQueryDocument,
  MeQueryQuery,
  UserDeleteDocument,
  UserDeleteMutation,
  useAnalyticCreateMutation,
} from "@/gql/schemas";
import React from "react";
import { createContext } from "react";
import { log } from "@/utils/logs";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdmin,
  setAuth,
  setHasAssist,
  setSignout,
  setSuperuser,
  setUserAvatar,
  setUserId,
  setUserIdPk,
  setUserName,
  setVerified,
} from "@/store/slices/app";
import { useRouter } from "next/router";
import { socket } from "@/clients/socket";
import { Base64 } from "js-base64";
import { setChatBoxOpen, setChatModal } from "@/store/slices/chat";
import {
  setActiveCategoryId,
  setActiveId,
  setHelpBoxOpen,
  setHelpModal,
} from "@/store/slices/help";
import { analytics } from "@/utils/analytics";
import { RootState } from "@/store";

interface IAppContext {
  showhelp: (id: any) => void;
  showhelps: (id: any) => void;
  showhelpcats: () => void;
  showchat: () => void;
  setup: () => void;
  track: (event: string, eventItems: string) => void;
  signout: () => void;
  close: () => void;
}

interface Props {
  children: React.ReactNode;
}

const AppContext = createContext<IAppContext>({
  showhelp: () => {},
  showhelps: () => {},
  showhelpcats: () => {},
  showchat: () => {},
  setup: () => {},
  track: () => {},
  signout: () => {},
  close: () => {},
});

const AppProvider = ({ children }: Props) => {
  const location = useRouter();
  const client = useApolloClient();
  const state = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [analyticCreate] = useAnalyticCreateMutation();

  const showhelp = (id: any) => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(2));
    dispatch(setActiveId(id));
  };

  const showhelps = (id: any) => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(1));
    dispatch(setActiveCategoryId(id));
  };

  const showhelpcats = () => {
    dispatch(setChatBoxOpen(false));
    dispatch(setHelpBoxOpen(true));
    dispatch(setHelpModal(0));
  };

  const showchat = () => {
    dispatch(setHelpBoxOpen(false));
    dispatch(setChatBoxOpen(true));
  };

  const setAppTheme = (appTheme: any) => {
    localStorage.setItem("appTheme", appTheme);
    // dispatch(setTheme(appTheme));
  };

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      const authToken = localStorage.getItem("authToken");
      const authUserIdPk: any = localStorage.getItem("authUserIdPk");
      const authUserId: any = localStorage.getItem("authUserId");
      const authUserName: any = localStorage.getItem("authUserName");
      const authUserAvatar: any = localStorage.getItem("authUserAvatar");
      // const isVerified = localStorage.getItem('isVerified');
      const isAdmin = localStorage.getItem("isAdmin");
      const isSuperuser = localStorage.getItem("isSuperuser");
      const theme: any = localStorage.getItem("appTheme");
      if (authToken) {
        setup();
      }
      // if (isVerified) {
      //   dispatch(setVerified(true))
      // }
      if (authUserIdPk) {
        dispatch(setUserIdPk(authUserIdPk));
        // dispatch(setChatModal(1));
      }
      if (authUserId) {
        dispatch(setUserId(authUserId));
      }
      if (authUserName) {
        dispatch(setUserName(authUserName));
      }
      if (authUserAvatar) {
        dispatch(setUserAvatar(authUserAvatar));
      }
      if (isAdmin) {
        dispatch(setAdmin(true));
      }
      if (isSuperuser) {
        dispatch(setSuperuser(true));
      }
      // if (theme) {
      //   dispatch(setTheme(theme));
      // }
      else {
        signout();
        // dispatch(setAuth(false));
        log("user has disconnected");
      }
    };
    bootstrapAsync();

    // socket.on("connect", (data: any) => {
    //   console.log("user connected: ", data);
    // });

    socket.on("disconnect", (data: any) => {
      console.log("user disconnected: ", data);
    });
  }, [socket]);

  const setup = async () => {
    const res = await client.query<MeQueryQuery>({
      query: MeQueryDocument,
    });
    if (res.data.me?.isVerified === true && res.data.me.isDeleted === false) {
      socket.connect();
      const me = res?.data?.me;
      const xid: any = res.data.me?.id;
      const idDecodedId = Base64.decode(xid);
      const [idType, idPk] = idDecodedId.split(":");
      dispatch(setAuth(true));
      dispatch(setVerified(true));
      dispatch(setAdmin(me?.isAdmin || false));
      dispatch(setHasAssist(me?.hasAssist || false));
      dispatch(setUserIdPk(idPk));
      dispatch(setUserId(me?.id || ""));
      dispatch(setUserName(me?.username || ""));
      dispatch(setUserAvatar(me?.avatar || ""));
      dispatch(setChatModal(1));
      localStorage.setItem("isAuth", JSON.stringify(true));
      localStorage.setItem("isVerified", JSON.stringify(me?.isVerified));
      localStorage.setItem("isAdmin", JSON.stringify(me?.isAdmin));
      localStorage.setItem("hasAssist", JSON.stringify(me?.hasAssist));
      localStorage.setItem("authUserIdPk", idPk || "");
      localStorage.setItem("authUserId", me?.id || "");
      localStorage.setItem("authUserName", me?.username || "");
      localStorage.setItem("authUserAvatar", me?.avatar || "");
      localStorage.setItem("appTheme", "dark");
    } else {
      signout();
      log("Could not complete setup this time");
    }
  };

  const track = async (event: string, eventItems: string) => {
    const authUserId: any = localStorage.getItem("authUserId");
    analytics
      .track(event, {
        items: eventItems,
      })
      .then(() => {
        analyticCreate({
          variables: {
            anonymousId: authUserId,
            userId: authUserId,
            userTraits: "",
            path: location.pathname,
            url: location.route,
            channel: "web",
            event: event,
            eventItems: eventItems,
          },
        });
      });
  };

  const signout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("hasAssist");
    localStorage.removeItem("authUserIdPk");
    localStorage.removeItem("authUserId");
    localStorage.removeItem("authUserName");
    localStorage.removeItem("authUserAvatar");
    localStorage.removeItem("appTheme");
    dispatch(setAuth(false));
    dispatch(setVerified(false));
    dispatch(setAdmin(false));
    dispatch(setHasAssist(false));
    dispatch(setUserIdPk(""));
    dispatch(setUserId(""));
    dispatch(setUserName(""));
    dispatch(setUserAvatar(""));
    dispatch(setChatModal(0));
    dispatch(setSignout());
    await client.clearStore();
    location.push("/");
    socket.disconnect();
    log("User signed out");
  };

  const close = async () => {
    const authUserId: any = localStorage.getItem("authUserId");
    const res = await client.mutate<UserDeleteMutation>({
      mutation: UserDeleteDocument,
      variables: {
        id: authUserId,
        isDeleted: true,
      },
    });
    signout();
  };

  return (
    <AppContext.Provider
      value={{
        showhelp,
        showhelps,
        showhelpcats,
        showchat,
        setup,
        track,
        signout,
        close,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
