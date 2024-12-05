import { StyleProp, TextStyle } from 'react-native';

export interface IconProps {
  style?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  children?: never;
}

type StackParamList = {
  default: undefined;
  DrawerNavigator: undefined;
};

export type DrawerParamList = {
  default: undefined;
};

export type DrawerNavigationProps<T extends keyof DrawerParamList = 'default'> =
  DrawerNavigationProp<DrawerParamList, T>;

export type DefaultDrawerNavigationProps<T extends keyof StackParamList> =
  DrawerNavigationProp<StackParamList, T>;

export type AuthStackParamList = {
  EmailSignupScreen: undefined;
  MobileSignupScreen: undefined;
  SignupVerifyScreen: { mode: any } | undefined;
  EmailSignupVerifyResendScreen: undefined;
  MobileSignupVerifyResendScreen: undefined;
  SigninScreen: undefined;
  PasswordChangeScreen: undefined;
  EmailPasswordResetScreen: undefined;
  MobilePasswordResetScreen: undefined;
  PasswordResetVerifyScreen: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  HelpCategoriesScreen: undefined;
  HelpCategoryScreen: { slug: any } | undefined;
  HelpsScreen: undefined;
  HelpScreen: { id: any } | undefined;
  AboutScreen: undefined;
};

export type TestimoniesStackParamList = {
  TestimoniesScreen: undefined;
  TestimonyScreen: { id: any } | undefined;
};

export type ListsStackParamList = {
  ListsScreen: undefined;
  TestimonyOfflineScreen: { id: any } | undefined;
  LocationOfflineScreen: { id: any } | undefined;
  LocationTestimoniesOfflineTableScreen: { id: any } | undefined;
  LocationCountingsOfflineTableScreen: { id: any } | undefined;
  LocationGivingsOfflineTableScreen: { id: any } | undefined;
  GroupOfflineScreen: { id: any } | undefined;
  GroupTestimoniesOfflineTableScreen: { id: any } | undefined;
  GroupCountingsOfflineTableScreen: { id: any } | undefined;
  GroupGivingsOfflineTableScreen: { id: any } | undefined;
  RegionOfflineScreen: { id: any } | undefined;
  RegionTestimoniesOfflineTableScreen: { id: any } | undefined;
  RegionCountingsOfflineTableScreen: { id: any } | undefined;
  RegionGivingsOfflineTableScreen: { id: any } | undefined;
  CountryStateOfflineScreen: { id: any } | undefined;
  CountryStateTestimoniesOfflineTableScreen: { id: any } | undefined;
  CountryStateCountingsOfflineTableScreen: { id: any } | undefined;
  CountryStateGivingsOfflineTableScreen: { id: any } | undefined;
  ZoneOfflineScreen: { id: any } | undefined;
  ZoneTestimoniesOfflineTableScreen: { id: any } | undefined;
  ZoneCountingsOfflineTableScreen: { id: any } | undefined;
  ZoneGivingsOfflineTableScreen: { id: any } | undefined;
};

export type ChatsStackParamList = {
  ChatsScreen: undefined;
  ChatScreen: { id: any } | undefined;
  ChatInfoScreen: undefined;
};

export type MeStackParamList = {
  MeScreen: undefined;
  MyDashboardScreen: undefined;
  UsersScreen: undefined;
  UserScreen: { id: any } | undefined;
};

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Date: any;
  GenericScalar: any;
};

export type SelectorObject = {
  key: any;
  value: any;
};
