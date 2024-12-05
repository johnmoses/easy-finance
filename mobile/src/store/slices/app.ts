import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  isOffline: boolean;
  isLoading: boolean;
  appTheme: any;
  otpCode: any;
  authToken: any;
  authUserIdPk: any;
  authUserId: any;
  authUserName: any;
  authUserAvatar: any;
  currentRoute: any;
  isAuth: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  isSuperuser: boolean;
  hasAssist: boolean;
}

export const initialState: IAppState = {
  isOffline: false,
  isLoading: true,
  appTheme: 'dark',
  otpCode: null,
  authToken: null,
  authUserIdPk: '',
  authUserId: '',
  authUserName: '',
  authUserAvatar: '',
  currentRoute: '',
  isAuth: false,
  isVerified: false,
  isAdmin: false,
  isSuperuser: false,
  hasAssist: false,
};

// Slice
export const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    flipOffline(state, action: PayloadAction<boolean>) {
      state.isOffline = action.payload;
      // console.log('is offline', state.isOffline);
    },
    flipLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      // console.log('is loading', state.isLoading);
    },
    setTheme(state, action: PayloadAction<any>) {
      state.appTheme = action.payload;
    },
    setOtpCode(state, action: PayloadAction<any>) {
      state.otpCode = action.payload;
      // console.log("otp code: ", state.otpCode);
    },
    setToken(state, action: PayloadAction<any>) {
      state.authToken = action.payload;
    },
    setUserIdPk(state, action: PayloadAction<any>) {
      state.authUserIdPk = action.payload;
      // console.log('auth user pk: ', state.authUserIdPk);
    },
    setUserId(state, action: PayloadAction<any>) {
      state.authUserId = action.payload;
      // console.log('auth user: ', state.authUserId);
    },
    setUserName(state, action: PayloadAction<any>) {
      state.authUserName = action.payload;
      // console.log('auth username: ', state.authUserName);
    },
    setUserAvatar(state, action: PayloadAction<any>) {
      state.authUserAvatar = action.payload;
      // console.log('auth avatar: ', state.authUserAvatar);
    },
    setCurrentRoute(state, action: PayloadAction<any>) {
      state.currentRoute = action.payload;
      // console.log('current route: ', state.currentRoute);
    },
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
      // console.log('isAuth: ', state.isAuth);
    },
    setVerified(state, action: PayloadAction<boolean>) {
      state.isVerified = action.payload;
      // console.log('isVerified: ', state.isVerified);
    },
    setAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
      // console.log('isAdmin: ', state.isAdmin);
    },
    setSuperuser(state, action: PayloadAction<boolean>) {
      state.isSuperuser = action.payload;
      // console.log('isSuperuser: ', state.isSuperuser);
    },
    setHasAssist(state, action: PayloadAction<boolean>) {
      state.hasAssist = action.payload;
      // console.log('Has Assist: ', state.hasAssist);
    },
    setSignout(state) {
      state.isAuth = false;
      state.isAdmin = false;
      state.isSuperuser = false;
    },
  },
});

export const {
  flipOffline,
  flipLoading,
  setTheme,
  setOtpCode,
  setToken,
  setUserIdPk,
  setUserId,
  setUserName,
  setUserAvatar,
  setCurrentRoute,
  setAuth,
  setVerified,
  setAdmin,
  setSuperuser,
  setHasAssist,
  setSignout,
} = AppSlice.actions;

// Thunks
export default AppSlice.reducer;
