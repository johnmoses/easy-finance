import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
};

export type AccountCategoryCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AccountCategoryCreatePayload = {
  __typename?: 'AccountCategoryCreatePayload';
  category?: Maybe<AccountCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountCategoryDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCategoryDeletePayload = {
  __typename?: 'AccountCategoryDeletePayload';
  category?: Maybe<AccountCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountCategoryRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AccountCategoryRemovePayload = {
  __typename?: 'AccountCategoryRemovePayload';
  category?: Maybe<AccountCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountCategoryType = Node & {
  __typename?: 'AccountCategoryType';
  categoryAccounts: AccountTypeConnection;
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};


export type AccountCategoryTypeCategoryAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AccountCategoryTypeConnection = {
  __typename?: 'AccountCategoryTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AccountCategoryTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AccountCategoryType` and its cursor. */
export type AccountCategoryTypeEdge = {
  __typename?: 'AccountCategoryTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AccountCategoryType>;
};

export type AccountCategoryUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AccountCategoryUpdatePayload = {
  __typename?: 'AccountCategoryUpdatePayload';
  category?: Maybe<AccountCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountCreateInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
};

export type AccountCreatePayload = {
  __typename?: 'AccountCreatePayload';
  account?: Maybe<AccountType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountDeletePayload = {
  __typename?: 'AccountDeletePayload';
  account?: Maybe<AccountType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AccountRemovePayload = {
  __typename?: 'AccountRemovePayload';
  account?: Maybe<AccountType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AccountType = Node & {
  __typename?: 'AccountType';
  accountOrders: OrderTypeConnection;
  accountTransactions: TransactionTypeConnection;
  balance?: Maybe<Scalars['Float']['output']>;
  category: AccountCategoryType;
  createdAt: Scalars['DateTime']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  deletedAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  modifiedAt: Scalars['DateTime']['output'];
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  user: UserType;
};


export type AccountTypeAccountOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type AccountTypeAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AccountTypeConnection = {
  __typename?: 'AccountTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AccountTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AccountType` and its cursor. */
export type AccountTypeEdge = {
  __typename?: 'AccountTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AccountType>;
};

export type AccountUpdateInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AccountUpdatePayload = {
  __typename?: 'AccountUpdatePayload';
  account?: Maybe<AccountType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ActiveToggleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ActiveTogglePayload = {
  __typename?: 'ActiveTogglePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type AdminToggleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AdminTogglePayload = {
  __typename?: 'AdminTogglePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type AnalyticCreateInput = {
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
};

export type AnalyticCreatePayload = {
  __typename?: 'AnalyticCreatePayload';
  analytic?: Maybe<AnalyticType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AnalyticInput = {
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
};

export type AnalyticType = Node & {
  __typename?: 'AnalyticType';
  anonymousId?: Maybe<Scalars['String']['output']>;
  channel?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  event?: Maybe<Scalars['String']['output']>;
  eventItems?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  path?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  userTraits?: Maybe<Scalars['String']['output']>;
};

export type AnalyticTypeConnection = {
  __typename?: 'AnalyticTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AnalyticTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `AnalyticType` and its cursor. */
export type AnalyticTypeEdge = {
  __typename?: 'AnalyticTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AnalyticType>;
};

export type AnalyticUpdateInput = {
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
};

export type AnalyticUpdatePayload = {
  __typename?: 'AnalyticUpdatePayload';
  analytic?: Maybe<AnalyticType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AnalyticUpsertBulkInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Array<InputMaybe<AnalyticInput>>>;
};

export type AnalyticUpsertBulkPayload = {
  __typename?: 'AnalyticUpsertBulkPayload';
  analytics?: Maybe<Array<Maybe<AnalyticType>>>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AnalyticUpsertInput = {
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
};

export type AnalyticUpsertPayload = {
  __typename?: 'AnalyticUpsertPayload';
  analytic?: Maybe<AnalyticType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type BannerCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BannerCreatePayload = {
  __typename?: 'BannerCreatePayload';
  banner?: Maybe<BannerType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type BannerDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BannerDeletePayload = {
  __typename?: 'BannerDeletePayload';
  banner?: Maybe<BannerType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type BannerRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type BannerRemovePayload = {
  __typename?: 'BannerRemovePayload';
  banner?: Maybe<BannerType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type BannerType = Node & {
  __typename?: 'BannerType';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['DateTime']['output']>;
  pic?: Maybe<Scalars['String']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BannerTypeConnection = {
  __typename?: 'BannerTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BannerTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `BannerType` and its cursor. */
export type BannerTypeEdge = {
  __typename?: 'BannerTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<BannerType>;
};

export type BannerUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BannerUpdatePayload = {
  __typename?: 'BannerUpdatePayload';
  banner?: Maybe<BannerType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ChatType = Node & {
  __typename?: 'ChatType';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isBot: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  isPrivate: Scalars['Boolean']['output'];
  lastContent?: Maybe<Scalars['String']['output']>;
  modifiedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  pic?: Maybe<Scalars['String']['output']>;
  pic1?: Maybe<Scalars['String']['output']>;
  pic2?: Maybe<Scalars['String']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  starterId: Scalars['Int']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
  unreadMessages: Scalars['Int']['output'];
};

export type ChatTypeConnection = {
  __typename?: 'ChatTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChatTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ChatType` and its cursor. */
export type ChatTypeEdge = {
  __typename?: 'ChatTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ChatType>;
};

export type HelpCategoryCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
};

export type HelpCategoryCreatePayload = {
  __typename?: 'HelpCategoryCreatePayload';
  category?: Maybe<HelpCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type HelpCategoryDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HelpCategoryDeletePayload = {
  __typename?: 'HelpCategoryDeletePayload';
  category?: Maybe<HelpCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type HelpCategoryRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type HelpCategoryRemovePayload = {
  __typename?: 'HelpCategoryRemovePayload';
  category?: Maybe<HelpCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type HelpCategoryType = Node & {
  __typename?: 'HelpCategoryType';
  categoryHelps: HelpTypeConnection;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  pic?: Maybe<Scalars['String']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
};


export type HelpCategoryTypeCategoryHelpsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  content_Icontains?: InputMaybe<Scalars['String']['input']>;
  content_Iendswith?: InputMaybe<Scalars['String']['input']>;
  content_Istartswith?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Iendswith?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type HelpCategoryTypeConnection = {
  __typename?: 'HelpCategoryTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<HelpCategoryTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `HelpCategoryType` and its cursor. */
export type HelpCategoryTypeEdge = {
  __typename?: 'HelpCategoryTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<HelpCategoryType>;
};

export type HelpCategoryUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
};

export type HelpCategoryUpdatePayload = {
  __typename?: 'HelpCategoryUpdatePayload';
  category?: Maybe<HelpCategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type HelpCreateInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type HelpCreatePayload = {
  __typename?: 'HelpCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  help?: Maybe<HelpType>;
};

export type HelpDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HelpDeletePayload = {
  __typename?: 'HelpDeletePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  help?: Maybe<HelpType>;
};

export type HelpRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type HelpRemovePayload = {
  __typename?: 'HelpRemovePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  help?: Maybe<HelpType>;
};

export type HelpType = Node & {
  __typename?: 'HelpType';
  category?: Maybe<HelpCategoryType>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['DateTime']['output']>;
  pic?: Maybe<Scalars['String']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type HelpTypeConnection = {
  __typename?: 'HelpTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<HelpTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `HelpType` and its cursor. */
export type HelpTypeEdge = {
  __typename?: 'HelpTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<HelpType>;
};

export type HelpUpdateInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type HelpUpdatePayload = {
  __typename?: 'HelpUpdatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  help?: Maybe<HelpType>;
};

export type MessageType = Node & {
  __typename?: 'MessageType';
  attachment?: Maybe<Scalars['String']['output']>;
  chatId: Scalars['Int']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  idx?: Maybe<Scalars['String']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  senderId: Scalars['Int']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type MessageTypeConnection = {
  __typename?: 'MessageTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MessageTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `MessageType` and its cursor. */
export type MessageTypeEdge = {
  __typename?: 'MessageTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<MessageType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  accountCategoryCreate?: Maybe<AccountCategoryCreatePayload>;
  accountCategoryDelete?: Maybe<AccountCategoryDeletePayload>;
  accountCategoryRemove?: Maybe<AccountCategoryRemovePayload>;
  accountCategoryUpdate?: Maybe<AccountCategoryUpdatePayload>;
  accountCreate?: Maybe<AccountCreatePayload>;
  accountDelete?: Maybe<AccountDeletePayload>;
  accountRemove?: Maybe<AccountRemovePayload>;
  accountUpdate?: Maybe<AccountUpdatePayload>;
  activeToggle?: Maybe<ActiveTogglePayload>;
  adminToggle?: Maybe<AdminTogglePayload>;
  analyticCreate?: Maybe<AnalyticCreatePayload>;
  analyticUpdate?: Maybe<AnalyticUpdatePayload>;
  analyticUpsert?: Maybe<AnalyticUpsertPayload>;
  analyticUpsertbulk?: Maybe<AnalyticUpsertBulkPayload>;
  avatarUpdate?: Maybe<UserAvatarUpdate>;
  bannerCreate?: Maybe<BannerCreatePayload>;
  bannerDelete?: Maybe<BannerDeletePayload>;
  bannerRemove?: Maybe<BannerRemovePayload>;
  bannerUpdate?: Maybe<BannerUpdatePayload>;
  birthdayUpdate?: Maybe<UserBirthDayUpdate>;
  emailUpdate?: Maybe<UserEmailUpdate>;
  genderUpdate?: Maybe<UserGenderUpdate>;
  helpCategoryCreate?: Maybe<HelpCategoryCreatePayload>;
  helpCategoryDelete?: Maybe<HelpCategoryDeletePayload>;
  helpCategoryRemove?: Maybe<HelpCategoryRemovePayload>;
  helpCategoryUpdate?: Maybe<HelpCategoryUpdatePayload>;
  helpCreate?: Maybe<HelpCreatePayload>;
  helpDelete?: Maybe<HelpDeletePayload>;
  helpRemove?: Maybe<HelpRemovePayload>;
  helpUpdate?: Maybe<HelpUpdatePayload>;
  orderCreate?: Maybe<OrderCreatePayload>;
  orderDelete?: Maybe<OrderDeletePayload>;
  orderRemove?: Maybe<OrderRemovePayload>;
  passwordReset?: Maybe<PasswordReset>;
  portfolioAdd?: Maybe<PortfolioAdd>;
  portfolioRemove?: Maybe<PortfolioRemovePayload>;
  refreshToken?: Maybe<Refresh>;
  reviewCreate?: Maybe<ReviewCreatePayload>;
  reviewDelete?: Maybe<ReviewDeletePayload>;
  reviewRemove?: Maybe<ReviewRemovePayload>;
  stockCreate?: Maybe<StockCreatePayload>;
  stockDelete?: Maybe<StockDeletePayload>;
  stockRemove?: Maybe<StockRemovePayload>;
  stockUpdate?: Maybe<StockUpdatePayload>;
  stockpriceCreate?: Maybe<StockPriceCreatePayload>;
  strategyCreate?: Maybe<StrategyCreatePayload>;
  superToggle?: Maybe<SupperTogglePayload>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  transactionCreate?: Maybe<TransactionCreatePayload>;
  userCreate?: Maybe<UserCreate>;
  userDelete?: Maybe<UserDeletePayload>;
  userDeletefinal?: Maybe<UserDeleteFinalPayload>;
  userUpdate?: Maybe<UserUpdate>;
  verifyToken?: Maybe<Verify>;
};


export type MutationAccountCategoryCreateArgs = {
  input: AccountCategoryCreateInput;
};


export type MutationAccountCategoryDeleteArgs = {
  input: AccountCategoryDeleteInput;
};


export type MutationAccountCategoryRemoveArgs = {
  input: AccountCategoryRemoveInput;
};


export type MutationAccountCategoryUpdateArgs = {
  input: AccountCategoryUpdateInput;
};


export type MutationAccountCreateArgs = {
  input: AccountCreateInput;
};


export type MutationAccountDeleteArgs = {
  input: AccountDeleteInput;
};


export type MutationAccountRemoveArgs = {
  input: AccountRemoveInput;
};


export type MutationAccountUpdateArgs = {
  input: AccountUpdateInput;
};


export type MutationActiveToggleArgs = {
  input: ActiveToggleInput;
};


export type MutationAdminToggleArgs = {
  input: AdminToggleInput;
};


export type MutationAnalyticCreateArgs = {
  input: AnalyticCreateInput;
};


export type MutationAnalyticUpdateArgs = {
  input: AnalyticUpdateInput;
};


export type MutationAnalyticUpsertArgs = {
  input: AnalyticUpsertInput;
};


export type MutationAnalyticUpsertbulkArgs = {
  input: AnalyticUpsertBulkInput;
};


export type MutationAvatarUpdateArgs = {
  avatar?: InputMaybe<Scalars['String']['input']>;
};


export type MutationBannerCreateArgs = {
  input: BannerCreateInput;
};


export type MutationBannerDeleteArgs = {
  input: BannerDeleteInput;
};


export type MutationBannerRemoveArgs = {
  input: BannerRemoveInput;
};


export type MutationBannerUpdateArgs = {
  input: BannerUpdateInput;
};


export type MutationBirthdayUpdateArgs = {
  birthDate: Scalars['String']['input'];
};


export type MutationEmailUpdateArgs = {
  email: Scalars['String']['input'];
};


export type MutationGenderUpdateArgs = {
  gender: Scalars['String']['input'];
};


export type MutationHelpCategoryCreateArgs = {
  input: HelpCategoryCreateInput;
};


export type MutationHelpCategoryDeleteArgs = {
  input: HelpCategoryDeleteInput;
};


export type MutationHelpCategoryRemoveArgs = {
  input: HelpCategoryRemoveInput;
};


export type MutationHelpCategoryUpdateArgs = {
  input: HelpCategoryUpdateInput;
};


export type MutationHelpCreateArgs = {
  input: HelpCreateInput;
};


export type MutationHelpDeleteArgs = {
  input: HelpDeleteInput;
};


export type MutationHelpRemoveArgs = {
  input: HelpRemoveInput;
};


export type MutationHelpUpdateArgs = {
  input: HelpUpdateInput;
};


export type MutationOrderCreateArgs = {
  input: OrderCreateInput;
};


export type MutationOrderDeleteArgs = {
  input: OrderDeleteInput;
};


export type MutationOrderRemoveArgs = {
  input: OrderRemoveInput;
};


export type MutationPasswordResetArgs = {
  password: Scalars['String']['input'];
};


export type MutationPortfolioAddArgs = {
  stockids: Scalars['String']['input'];
};


export type MutationPortfolioRemoveArgs = {
  input: PortfolioRemoveInput;
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReviewCreateArgs = {
  input: ReviewCreateInput;
};


export type MutationReviewDeleteArgs = {
  input: ReviewDeleteInput;
};


export type MutationReviewRemoveArgs = {
  input: ReviewRemoveInput;
};


export type MutationStockCreateArgs = {
  input: StockCreateInput;
};


export type MutationStockDeleteArgs = {
  input: StockDeleteInput;
};


export type MutationStockRemoveArgs = {
  input: StockRemoveInput;
};


export type MutationStockUpdateArgs = {
  input: StockUpdateInput;
};


export type MutationStockpriceCreateArgs = {
  input: StockPriceCreateInput;
};


export type MutationStrategyCreateArgs = {
  input: StrategyCreateInput;
};


export type MutationSuperToggleArgs = {
  input: SupperToggleInput;
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationTransactionCreateArgs = {
  input: TransactionCreateInput;
};


export type MutationUserCreateArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUserDeleteArgs = {
  input: UserDeleteInput;
};


export type MutationUserDeletefinalArgs = {
  input: UserDeleteFinalInput;
};


export type MutationUserUpdateArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type OrderCreateInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  buyPrice?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  sellPrice?: InputMaybe<Scalars['Float']['input']>;
  stockId?: InputMaybe<Scalars['ID']['input']>;
  strategyId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderCreatePayload = {
  __typename?: 'OrderCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order?: Maybe<OrderType>;
};

export type OrderDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OrderDeletePayload = {
  __typename?: 'OrderDeletePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order?: Maybe<OrderType>;
};

export type OrderRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderRemovePayload = {
  __typename?: 'OrderRemovePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order?: Maybe<OrderType>;
};

export type OrderType = Node & {
  __typename?: 'OrderType';
  account?: Maybe<AccountType>;
  active: Scalars['Boolean']['output'];
  buyIndicator?: Maybe<Scalars['String']['output']>;
  buyPrice?: Maybe<Scalars['Float']['output']>;
  buyTime?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  sellIndicator?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Float']['output']>;
  sellTime?: Maybe<Scalars['DateTime']['output']>;
  short: Scalars['Boolean']['output'];
  stock?: Maybe<StockType>;
  strategy?: Maybe<StrategyType>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  user: UserType;
};

export type OrderTypeConnection = {
  __typename?: 'OrderTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrderTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OrderType` and its cursor. */
export type OrderTypeEdge = {
  __typename?: 'OrderTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<OrderType>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PasswordReset = {
  __typename?: 'PasswordReset';
  user?: Maybe<UserType>;
};

export type PortfolioAdd = {
  __typename?: 'PortfolioAdd';
  user?: Maybe<UserType>;
};

export type PortfolioRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  stockId?: InputMaybe<Scalars['ID']['input']>;
};

export type PortfolioRemovePayload = {
  __typename?: 'PortfolioRemovePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type PortfolioType = Node & {
  __typename?: 'PortfolioType';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  stocks: StockTypeConnection;
  user: UserType;
};


export type PortfolioTypeStocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PortfolioTypeConnection = {
  __typename?: 'PortfolioTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PortfolioTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PortfolioType` and its cursor. */
export type PortfolioTypeEdge = {
  __typename?: 'PortfolioTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<PortfolioType>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<AccountType>;
  accountcategories?: Maybe<AccountCategoryTypeConnection>;
  accountcategory?: Maybe<AccountCategoryType>;
  accounts?: Maybe<AccountTypeConnection>;
  analytic?: Maybe<AnalyticType>;
  analytics?: Maybe<AnalyticTypeConnection>;
  banner?: Maybe<BannerType>;
  banners?: Maybe<BannerTypeConnection>;
  chat?: Maybe<ChatType>;
  chats?: Maybe<ChatTypeConnection>;
  help?: Maybe<HelpType>;
  helpCategories?: Maybe<HelpCategoryTypeConnection>;
  helpCategory?: Maybe<HelpCategoryType>;
  helps?: Maybe<HelpTypeConnection>;
  me?: Maybe<UserType>;
  messages?: Maybe<MessageTypeConnection>;
  order?: Maybe<OrderType>;
  orders?: Maybe<OrderTypeConnection>;
  portfolio?: Maybe<Array<Maybe<PortfolioType>>>;
  review?: Maybe<ReviewType>;
  reviews?: Maybe<ReviewTypeConnection>;
  stock?: Maybe<StockType>;
  stockprice?: Maybe<StockPriceType>;
  stockprices?: Maybe<StockPriceTypeConnection>;
  stocks?: Maybe<StockTypeConnection>;
  strategies?: Maybe<StrategyTypeConnection>;
  strategy?: Maybe<StrategyType>;
  transaction?: Maybe<TransactionType>;
  transactions?: Maybe<TransactionTypeConnection>;
  user?: Maybe<UserType>;
  users?: Maybe<UserTypeConnection>;
};


export type QueryAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountcategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  name_Iendswith?: InputMaybe<Scalars['String']['input']>;
  name_Istartswith?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountcategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalyticArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAnalyticsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBannerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBannersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isActive_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryChatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryHelpArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHelpCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  name_Iendswith?: InputMaybe<Scalars['String']['input']>;
  name_Istartswith?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_Icontains?: InputMaybe<Scalars['String']['input']>;
  slug_Iendswith?: InputMaybe<Scalars['String']['input']>;
  slug_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryHelpCategoryArgs = {
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryHelpsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  content_Icontains?: InputMaybe<Scalars['String']['input']>;
  content_Iendswith?: InputMaybe<Scalars['String']['input']>;
  content_Istartswith?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Iendswith?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReviewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryStockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockpriceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockpricesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStrategiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStrategyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  firstName_Icontains?: InputMaybe<Scalars['String']['input']>;
  firstName_Iendswith?: InputMaybe<Scalars['String']['input']>;
  firstName_Istartswith?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isVerified_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  lastName_Icontains?: InputMaybe<Scalars['String']['input']>;
  lastName_Iendswith?: InputMaybe<Scalars['String']['input']>;
  lastName_Istartswith?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  username_Icontains?: InputMaybe<Scalars['String']['input']>;
  username_Iendswith?: InputMaybe<Scalars['String']['input']>;
  username_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type ReviewCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Float']['input']>;
};

export type ReviewCreatePayload = {
  __typename?: 'ReviewCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  review?: Maybe<ReviewType>;
};

export type ReviewDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReviewDeletePayload = {
  __typename?: 'ReviewDeletePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  review?: Maybe<ReviewType>;
};

export type ReviewRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type ReviewRemovePayload = {
  __typename?: 'ReviewRemovePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  review?: Maybe<ReviewType>;
};

export type ReviewType = Node & {
  __typename?: 'ReviewType';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isFlagged: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  itemId?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  modifiedAt?: Maybe<Scalars['DateTime']['output']>;
  rating: Scalars['Decimal']['output'];
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  user: UserType;
};

export type ReviewTypeConnection = {
  __typename?: 'ReviewTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ReviewTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ReviewType` and its cursor. */
export type ReviewTypeEdge = {
  __typename?: 'ReviewTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ReviewType>;
};

export type StockCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchange?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

export type StockCreatePayload = {
  __typename?: 'StockCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stock?: Maybe<StockType>;
};

export type StockDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StockDeletePayload = {
  __typename?: 'StockDeletePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stock?: Maybe<StockType>;
};

export type StockPriceCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  close?: InputMaybe<Scalars['Float']['input']>;
  high?: InputMaybe<Scalars['Float']['input']>;
  low?: InputMaybe<Scalars['Float']['input']>;
  open?: InputMaybe<Scalars['Float']['input']>;
  stockId?: InputMaybe<Scalars['ID']['input']>;
  volume?: InputMaybe<Scalars['Float']['input']>;
};

export type StockPriceCreatePayload = {
  __typename?: 'StockPriceCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stockprice?: Maybe<StockPriceType>;
};

export type StockPriceType = Node & {
  __typename?: 'StockPriceType';
  close?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  high?: Maybe<Scalars['Float']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  low?: Maybe<Scalars['Float']['output']>;
  open?: Maybe<Scalars['Float']['output']>;
  stock?: Maybe<StockType>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  volume?: Maybe<Scalars['Float']['output']>;
};

export type StockPriceTypeConnection = {
  __typename?: 'StockPriceTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StockPriceTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `StockPriceType` and its cursor. */
export type StockPriceTypeEdge = {
  __typename?: 'StockPriceTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<StockPriceType>;
};

export type StockRemoveInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type StockRemovePayload = {
  __typename?: 'StockRemovePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stock?: Maybe<StockType>;
};

export type StockType = Node & {
  __typename?: 'StockType';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  exchange?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  modifiedAt: Scalars['DateTime']['output'];
  name?: Maybe<Scalars['String']['output']>;
  portfolioStocks: PortfolioTypeConnection;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  stockOrders: OrderTypeConnection;
  stockPrices: StockPriceTypeConnection;
  symbol: Scalars['String']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};


export type StockTypePortfolioStocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type StockTypeStockOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type StockTypeStockPricesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type StockTypeConnection = {
  __typename?: 'StockTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StockTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `StockType` and its cursor. */
export type StockTypeEdge = {
  __typename?: 'StockTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<StockType>;
};

export type StockUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchange?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

export type StockUpdatePayload = {
  __typename?: 'StockUpdatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stock?: Maybe<StockType>;
};

export type StrategyCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type StrategyCreatePayload = {
  __typename?: 'StrategyCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  strategy?: Maybe<StrategyType>;
};

export type StrategyType = Node & {
  __typename?: 'StrategyType';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  maximumAllocation?: Maybe<Scalars['Float']['output']>;
  minimumAllocation?: Maybe<Scalars['Float']['output']>;
  modifiedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  performOrder: Scalars['Boolean']['output'];
  priority?: Maybe<Scalars['Int']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  strategyOrders: OrderTypeConnection;
  totalCount?: Maybe<Scalars['Int']['output']>;
};


export type StrategyTypeStrategyOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type StrategyTypeConnection = {
  __typename?: 'StrategyTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StrategyTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `StrategyType` and its cursor. */
export type StrategyTypeEdge = {
  __typename?: 'StrategyTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<StrategyType>;
};

export type SupperToggleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSuperuser?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SupperTogglePayload = {
  __typename?: 'SupperTogglePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type TransactionCreateInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
};

export type TransactionCreatePayload = {
  __typename?: 'TransactionCreatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  transaction?: Maybe<TransactionType>;
};

export type TransactionType = Node & {
  __typename?: 'TransactionType';
  account?: Maybe<AccountType>;
  amount?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type TransactionTypeConnection = {
  __typename?: 'TransactionTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TransactionTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `TransactionType` and its cursor. */
export type TransactionTypeEdge = {
  __typename?: 'TransactionTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<TransactionType>;
};

export type UserAvatarUpdate = {
  __typename?: 'UserAvatarUpdate';
  user?: Maybe<UserType>;
};

export type UserBirthDayUpdate = {
  __typename?: 'UserBirthDayUpdate';
  user?: Maybe<UserType>;
};

export type UserCreate = {
  __typename?: 'UserCreate';
  user?: Maybe<UserType>;
};

export type UserDeleteFinalInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UserDeleteFinalPayload = {
  __typename?: 'UserDeleteFinalPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type UserDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDeletePayload = {
  __typename?: 'UserDeletePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type UserEmailUpdate = {
  __typename?: 'UserEmailUpdate';
  user?: Maybe<UserType>;
};

export type UserGenderUpdate = {
  __typename?: 'UserGenderUpdate';
  user?: Maybe<UserType>;
};

export type UserType = Node & {
  __typename?: 'UserType';
  address?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['Date']['output']>;
  dateJoined: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isBot: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isModified: Scalars['Boolean']['output'];
  isStaff: Scalars['Boolean']['output'];
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean']['output'];
  isUsed: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mobile?: Maybe<Scalars['String']['output']>;
  modifiedAt: Scalars['DateTime']['output'];
  password: Scalars['String']['output'];
  portfolio?: Maybe<PortfolioType>;
  preferences?: Maybe<Scalars['JSONString']['output']>;
  restoredAt?: Maybe<Scalars['DateTime']['output']>;
  userAccounts: AccountTypeConnection;
  userOrders: OrderTypeConnection;
  userReviews: ReviewTypeConnection;
  username: Scalars['String']['output'];
};


export type UserTypeUserAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserTypeUserOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserTypeUserReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_Icontains?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted_Icontains?: InputMaybe<Scalars['Boolean']['input']>;
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UserTypeConnection = {
  __typename?: 'UserTypeConnection';
  count?: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `UserType` and its cursor. */
export type UserTypeEdge = {
  __typename?: 'UserTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<UserType>;
};

export type UserUpdate = {
  __typename?: 'UserUpdate';
  user?: Maybe<UserType>;
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};

export type UserListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type UserListQuery = { __typename?: 'Query', users?: { __typename?: 'UserTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'UserTypeEdge', cursor: string, node?: { __typename?: 'UserType', id: string, username: string, firstName?: string | null, lastName?: string | null, avatar?: string | null, mobile?: string | null, email?: string | null, gender?: string | null, bio?: string | null, address?: string | null, birthDate?: any | null, isVerified: boolean, isUsed: boolean, isBot: boolean, isStaff: boolean, isAdmin: boolean, isSuperuser: boolean, isActive: boolean, dateJoined: any, isModified: boolean, modifiedAt: any, isDeleted: boolean, deletedAt: any, restoredAt?: any | null, portfolio?: { __typename?: 'PortfolioType', stocks: { __typename?: 'StockTypeConnection', edges: Array<{ __typename?: 'StockTypeEdge', node?: { __typename?: 'StockType', id: string, symbol: string } | null } | null> } } | null, userAccounts: { __typename?: 'AccountTypeConnection', count?: number | null }, userOrders: { __typename?: 'OrderTypeConnection', count?: number | null }, userReviews: { __typename?: 'ReviewTypeConnection', count?: number | null } } | null } | null> } | null };

export type UserSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserSelectQuery = { __typename?: 'Query', user?: { __typename?: 'UserType', id: string, username: string, firstName?: string | null, lastName?: string | null, avatar?: string | null, mobile?: string | null, email?: string | null, gender?: string | null, bio?: string | null, address?: string | null, birthDate?: any | null, isVerified: boolean, isUsed: boolean, isBot: boolean, isStaff: boolean, isAdmin: boolean, isSuperuser: boolean, isActive: boolean, dateJoined: any, isModified: boolean, modifiedAt: any, isDeleted: boolean, deletedAt: any, restoredAt?: any | null, portfolio?: { __typename?: 'PortfolioType', stocks: { __typename?: 'StockTypeConnection', edges: Array<{ __typename?: 'StockTypeEdge', node?: { __typename?: 'StockType', id: string, symbol: string } | null } | null> } } | null, userAccounts: { __typename?: 'AccountTypeConnection', count?: number | null, edges: Array<{ __typename?: 'AccountTypeEdge', node?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null } | null> }, userOrders: { __typename?: 'OrderTypeConnection', count?: number | null, edges: Array<{ __typename?: 'OrderTypeEdge', node?: { __typename?: 'OrderType', id: string, quantity?: number | null } | null } | null> }, userReviews: { __typename?: 'ReviewTypeConnection', count?: number | null, edges: Array<{ __typename?: 'ReviewTypeEdge', node?: { __typename?: 'ReviewType', id: string, itemId?: string | null, itemType?: string | null } | null } | null> } } | null };

export type MeQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQueryQuery = { __typename?: 'Query', me?: { __typename?: 'UserType', id: string, username: string, firstName?: string | null, lastName?: string | null, avatar?: string | null, mobile?: string | null, email?: string | null, gender?: string | null, bio?: string | null, address?: string | null, birthDate?: any | null, isVerified: boolean, isUsed: boolean, isBot: boolean, isStaff: boolean, isAdmin: boolean, isSuperuser: boolean, isActive: boolean, dateJoined: any, isModified: boolean, modifiedAt: any, isDeleted: boolean, deletedAt: any, restoredAt?: any | null, portfolio?: { __typename?: 'PortfolioType', stocks: { __typename?: 'StockTypeConnection', edges: Array<{ __typename?: 'StockTypeEdge', node?: { __typename?: 'StockType', id: string, symbol: string } | null } | null> } } | null, userAccounts: { __typename?: 'AccountTypeConnection', count?: number | null, edges: Array<{ __typename?: 'AccountTypeEdge', node?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null } | null> }, userOrders: { __typename?: 'OrderTypeConnection', count?: number | null, edges: Array<{ __typename?: 'OrderTypeEdge', node?: { __typename?: 'OrderType', id: string, quantity?: number | null } | null } | null> }, userReviews: { __typename?: 'ReviewTypeConnection', count?: number | null, edges: Array<{ __typename?: 'ReviewTypeEdge', node?: { __typename?: 'ReviewType', id: string, itemId?: string | null, itemType?: string | null } | null } | null> } } | null };

export type UserCreateMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UserCreateMutation = { __typename?: 'Mutation', userCreate?: { __typename?: 'UserCreate', user?: { __typename?: 'UserType', id: string, username: string, password: string } | null } | null };

export type TokenAuthMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type TokenAuthMutation = { __typename?: 'Mutation', tokenAuth?: { __typename?: 'ObtainJSONWebToken', token: string } | null };

export type VerifyTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type VerifyTokenMutation = { __typename?: 'Mutation', verifyToken?: { __typename?: 'Verify', payload: any } | null };

export type UserUpdateMutationVariables = Exact<{
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type UserUpdateMutation = { __typename?: 'Mutation', userUpdate?: { __typename?: 'UserUpdate', user?: { __typename?: 'UserType', id: string, username: string, password: string } | null } | null };

export type EmailUpdateMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type EmailUpdateMutation = { __typename?: 'Mutation', emailUpdate?: { __typename?: 'UserEmailUpdate', user?: { __typename?: 'UserType', id: string, username: string, email?: string | null } | null } | null };

export type AvatarUpdateMutationVariables = Exact<{
  avatar: Scalars['String']['input'];
}>;


export type AvatarUpdateMutation = { __typename?: 'Mutation', avatarUpdate?: { __typename?: 'UserAvatarUpdate', user?: { __typename?: 'UserType', id: string, username: string, avatar?: string | null } | null } | null };

export type BirthdayUpdateMutationVariables = Exact<{
  birthDate: Scalars['String']['input'];
}>;


export type BirthdayUpdateMutation = { __typename?: 'Mutation', birthdayUpdate?: { __typename?: 'UserBirthDayUpdate', user?: { __typename?: 'UserType', id: string, username: string, birthDate?: any | null } | null } | null };

export type GenderUpdateMutationVariables = Exact<{
  gender: Scalars['String']['input'];
}>;


export type GenderUpdateMutation = { __typename?: 'Mutation', genderUpdate?: { __typename?: 'UserGenderUpdate', user?: { __typename?: 'UserType', id: string, username: string, gender?: string | null } | null } | null };

export type AdminToggleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AdminToggleMutation = { __typename?: 'Mutation', adminToggle?: { __typename?: 'AdminTogglePayload', clientMutationId?: string | null } | null };

export type SuperToggleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isSuperuser?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SuperToggleMutation = { __typename?: 'Mutation', superToggle?: { __typename?: 'SupperTogglePayload', clientMutationId?: string | null } | null };

export type ActiveToggleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ActiveToggleMutation = { __typename?: 'Mutation', activeToggle?: { __typename?: 'ActiveTogglePayload', clientMutationId?: string | null } | null };

export type UserDeleteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UserDeleteMutation = { __typename?: 'Mutation', userDelete?: { __typename?: 'UserDeletePayload', user?: { __typename?: 'UserType', id: string } | null } | null };

export type AnalyticListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type AnalyticListQuery = { __typename?: 'Query', analytics?: { __typename?: 'AnalyticTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'AnalyticTypeEdge', node?: { __typename?: 'AnalyticType', id: string, anonymousId?: string | null, userId?: string | null, userTraits?: string | null, path?: string | null, url?: string | null, channel?: string | null, event?: string | null, eventItems?: string | null, createdAt?: any | null } | null } | null> } | null };

export type AnalyticSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AnalyticSelectQuery = { __typename?: 'Query', analytic?: { __typename?: 'AnalyticType', anonymousId?: string | null, userId?: string | null, userTraits?: string | null, path?: string | null, url?: string | null, channel?: string | null, event?: string | null, eventItems?: string | null, createdAt?: any | null } | null };

export type AnalyticCreateMutationVariables = Exact<{
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
}>;


export type AnalyticCreateMutation = { __typename?: 'Mutation', analyticCreate?: { __typename?: 'AnalyticCreatePayload', analytic?: { __typename?: 'AnalyticType', id: string } | null } | null };

export type AnalyticUpsertMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
}>;


export type AnalyticUpsertMutation = { __typename?: 'Mutation', analyticUpsert?: { __typename?: 'AnalyticUpsertPayload', analytic?: { __typename?: 'AnalyticType', id: string } | null } | null };

export type AnalyticUpdateMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  anonymousId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userTraits?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  eventItems?: InputMaybe<Scalars['String']['input']>;
}>;


export type AnalyticUpdateMutation = { __typename?: 'Mutation', analyticUpdate?: { __typename?: 'AnalyticUpdatePayload', analytic?: { __typename?: 'AnalyticType', id: string } | null } | null };

export type BannerListQueryVariables = Exact<{
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type BannerListQuery = { __typename?: 'Query', banners?: { __typename?: 'BannerTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'BannerTypeEdge', node?: { __typename?: 'BannerType', id: string, title?: string | null, content?: string | null, pic?: string | null, isActive: boolean, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null } | null } | null> } | null };

export type BannerSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BannerSelectQuery = { __typename?: 'Query', banner?: { __typename?: 'BannerType', id: string, title?: string | null, content?: string | null, pic?: string | null, isActive: boolean, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null } | null };

export type BannerCreateMutationVariables = Exact<{
  title: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
}>;


export type BannerCreateMutation = { __typename?: 'Mutation', bannerCreate?: { __typename?: 'BannerCreatePayload', banner?: { __typename?: 'BannerType', id: string } | null } | null };

export type BannerUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type BannerUpdateMutation = { __typename?: 'Mutation', bannerUpdate?: { __typename?: 'BannerUpdatePayload', banner?: { __typename?: 'BannerType', id: string } | null } | null };

export type BannerDeleteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type BannerDeleteMutation = { __typename?: 'Mutation', bannerDelete?: { __typename?: 'BannerDeletePayload', banner?: { __typename?: 'BannerType', id: string } | null } | null };

export type BannerRemoveMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type BannerRemoveMutation = { __typename?: 'Mutation', bannerRemove?: { __typename?: 'BannerRemovePayload', banner?: { __typename?: 'BannerType', id: string } | null } | null };

export type AccountCategoryListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountCategoryListQuery = { __typename?: 'Query', accountcategories?: { __typename?: 'AccountCategoryTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'AccountCategoryTypeEdge', cursor: string, node?: { __typename?: 'AccountCategoryType', id: string, name: string, description?: string | null, categoryAccounts: { __typename?: 'AccountTypeConnection', count?: number | null } } | null } | null> } | null };

export type AccountCategorySelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountCategorySelectQuery = { __typename?: 'Query', accountcategory?: { __typename?: 'AccountCategoryType', id: string, name: string, description?: string | null, categoryAccounts: { __typename?: 'AccountTypeConnection', count?: number | null } } | null };

export type AccountCategoryCreateMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountCategoryCreateMutation = { __typename?: 'Mutation', accountCategoryCreate?: { __typename?: 'AccountCategoryCreatePayload', category?: { __typename?: 'AccountCategoryType', id: string } | null } | null };

export type AccountCategoryUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountCategoryUpdateMutation = { __typename?: 'Mutation', accountCategoryUpdate?: { __typename?: 'AccountCategoryUpdatePayload', category?: { __typename?: 'AccountCategoryType', id: string } | null } | null };

export type AccountCategoryDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AccountCategoryDeleteMutation = { __typename?: 'Mutation', accountCategoryDelete?: { __typename?: 'AccountCategoryDeletePayload', category?: { __typename?: 'AccountCategoryType', id: string } | null } | null };

export type AccountCategoryRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountCategoryRemoveMutation = { __typename?: 'Mutation', accountCategoryRemove?: { __typename?: 'AccountCategoryRemovePayload', category?: { __typename?: 'AccountCategoryType', id: string } | null } | null };

export type AccountListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountListQuery = { __typename?: 'Query', accounts?: { __typename?: 'AccountTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'AccountTypeEdge', cursor: string, node?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, createdAt: any, isModified: boolean, modifiedAt: any, isDeleted: boolean, deletedAt: any, restoredAt?: any | null, user: { __typename?: 'UserType', id: string, username: string }, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null } | null> } | null };

export type AccountSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountSelectQuery = { __typename?: 'Query', account?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, createdAt: any, isModified: boolean, modifiedAt: any, isDeleted: boolean, deletedAt: any, restoredAt?: any | null, user: { __typename?: 'UserType', id: string, username: string }, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null };

export type AccountCreateMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountCreateMutation = { __typename?: 'Mutation', accountCreate?: { __typename?: 'AccountCreatePayload', account?: { __typename?: 'AccountType', id: string } | null } | null };

export type AccountUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  categoryId: Scalars['ID']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountUpdateMutation = { __typename?: 'Mutation', accountUpdate?: { __typename?: 'AccountUpdatePayload', account?: { __typename?: 'AccountType', id: string } | null } | null };

export type AccountDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AccountDeleteMutation = { __typename?: 'Mutation', accountDelete?: { __typename?: 'AccountDeletePayload', account?: { __typename?: 'AccountType', id: string } | null } | null };

export type AccountRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountRemoveMutation = { __typename?: 'Mutation', accountRemove?: { __typename?: 'AccountRemovePayload', account?: { __typename?: 'AccountType', id: string } | null } | null };

export type TransactionListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type TransactionListQuery = { __typename?: 'Query', transactions?: { __typename?: 'TransactionTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'TransactionTypeEdge', cursor: string, node?: { __typename?: 'TransactionType', id: string, amount?: number | null, description: string, createdAt: any, account?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, user: { __typename?: 'UserType', id: string, username: string }, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null } | null } | null> } | null };

export type TransactionSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TransactionSelectQuery = { __typename?: 'Query', transaction?: { __typename?: 'TransactionType', id: string, amount?: number | null, description: string, createdAt: any, account?: { __typename?: 'AccountType', id: string, balance?: number | null, currency?: string | null, user: { __typename?: 'UserType', id: string, username: string }, category: { __typename?: 'AccountCategoryType', id: string, name: string } } | null } | null };

export type TransactionCreateMutationVariables = Exact<{
  accountId: Scalars['ID']['input'];
  amount?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type TransactionCreateMutation = { __typename?: 'Mutation', transactionCreate?: { __typename?: 'TransactionCreatePayload', transaction?: { __typename?: 'TransactionType', id: string } | null } | null };

export type HelpCategoryListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpCategoryListQuery = { __typename?: 'Query', helpCategories?: { __typename?: 'HelpCategoryTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'HelpCategoryTypeEdge', cursor: string, node?: { __typename?: 'HelpCategoryType', id: string, name: string, description: string, slug: string, pic?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null, categoryHelps: { __typename?: 'HelpTypeConnection', count?: number | null, edges: Array<{ __typename?: 'HelpTypeEdge', node?: { __typename?: 'HelpType', id: string, title?: string | null } | null } | null> } } | null } | null> } | null };

export type HelpCategorySelectQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type HelpCategorySelectQuery = { __typename?: 'Query', helpCategory?: { __typename?: 'HelpCategoryType', id: string, name: string, description: string, slug: string, pic?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null, categoryHelps: { __typename?: 'HelpTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'HelpTypeEdge', cursor: string, node?: { __typename?: 'HelpType', id: string, title?: string | null } | null } | null> } } | null };

export type HelpCategoryCreateMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpCategoryCreateMutation = { __typename?: 'Mutation', helpCategoryCreate?: { __typename?: 'HelpCategoryCreatePayload', category?: { __typename?: 'HelpCategoryType', id: string } | null } | null };

export type HelpCategoryUpdateMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpCategoryUpdateMutation = { __typename?: 'Mutation', helpCategoryUpdate?: { __typename?: 'HelpCategoryUpdatePayload', category?: { __typename?: 'HelpCategoryType', id: string } | null } | null };

export type HelpCategoryDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type HelpCategoryDeleteMutation = { __typename?: 'Mutation', helpCategoryDelete?: { __typename?: 'HelpCategoryDeletePayload', category?: { __typename?: 'HelpCategoryType', id: string } | null } | null };

export type HelpCategoryRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type HelpCategoryRemoveMutation = { __typename?: 'Mutation', helpCategoryRemove?: { __typename?: 'HelpCategoryRemovePayload', category?: { __typename?: 'HelpCategoryType', id: string } | null } | null };

export type HelpListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type HelpListQuery = { __typename?: 'Query', helps?: { __typename?: 'HelpTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'HelpTypeEdge', cursor: string, node?: { __typename?: 'HelpType', id: string, title?: string | null, content?: string | null, pic?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, deletedAt?: any | null, restoredAt?: any | null, isDeleted: boolean, category?: { __typename?: 'HelpCategoryType', id: string, name: string } | null } | null } | null> } | null };

export type HelpSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type HelpSelectQuery = { __typename?: 'Query', help?: { __typename?: 'HelpType', id: string, title?: string | null, content?: string | null, pic?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, deletedAt?: any | null, restoredAt?: any | null, isDeleted: boolean, category?: { __typename?: 'HelpCategoryType', id: string, name: string } | null } | null };

export type HelpCreateMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type HelpCreateMutation = { __typename?: 'Mutation', helpCreate?: { __typename?: 'HelpCreatePayload', help?: { __typename?: 'HelpType', id: string } | null } | null };

export type HelpUpdateMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  pic?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type HelpUpdateMutation = { __typename?: 'Mutation', helpUpdate?: { __typename?: 'HelpUpdatePayload', help?: { __typename?: 'HelpType', id: string } | null } | null };

export type HelpDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type HelpDeleteMutation = { __typename?: 'Mutation', helpDelete?: { __typename?: 'HelpDeletePayload', help?: { __typename?: 'HelpType', id: string } | null } | null };

export type HelpRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type HelpRemoveMutation = { __typename?: 'Mutation', helpRemove?: { __typename?: 'HelpRemovePayload', help?: { __typename?: 'HelpType', id: string } | null } | null };

export type ReviewListQueryVariables = Exact<{
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviewListQuery = { __typename?: 'Query', reviews?: { __typename?: 'ReviewTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'ReviewTypeEdge', node?: { __typename?: 'ReviewType', id: string, content?: string | null, rating: any, itemId?: string | null, itemType?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null, user: { __typename?: 'UserType', id: string, username: string } } | null } | null> } | null };

export type ReviewSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReviewSelectQuery = { __typename?: 'Query', review?: { __typename?: 'ReviewType', id: string, content?: string | null, rating: any, itemId?: string | null, itemType?: string | null, createdAt: any, isModified: boolean, modifiedAt?: any | null, isDeleted: boolean, deletedAt?: any | null, restoredAt?: any | null, user: { __typename?: 'UserType', id: string, username: string } } | null };

export type ReviewCreateMutationVariables = Exact<{
  content?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Float']['input']>;
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviewCreateMutation = { __typename?: 'Mutation', reviewCreate?: { __typename?: 'ReviewCreatePayload', review?: { __typename?: 'ReviewType', id: string } | null } | null };

export type ReviewDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ReviewDeleteMutation = { __typename?: 'Mutation', reviewDelete?: { __typename?: 'ReviewDeletePayload', clientMutationId?: string | null, review?: { __typename?: 'ReviewType', id: string } | null } | null };

export type ReviewRemoveMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ReviewRemoveMutation = { __typename?: 'Mutation', reviewRemove?: { __typename?: 'ReviewRemovePayload', review?: { __typename?: 'ReviewType', id: string } | null } | null };

export type StockListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type StockListQuery = { __typename?: 'Query', stocks?: { __typename?: 'StockTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'StockTypeEdge', cursor: string, node?: { __typename?: 'StockType', id: string, symbol: string, name?: string | null, description?: string | null, exchange?: string | null, createdAt: any } | null } | null> } | null };

export type StockSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StockSelectQuery = { __typename?: 'Query', stock?: { __typename?: 'StockType', id: string, symbol: string, name?: string | null, description?: string | null, exchange?: string | null, createdAt: any } | null };

export type StockCreateMutationVariables = Exact<{
  symbol?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchange?: InputMaybe<Scalars['String']['input']>;
}>;


export type StockCreateMutation = { __typename?: 'Mutation', stockCreate?: { __typename?: 'StockCreatePayload', stock?: { __typename?: 'StockType', id: string } | null } | null };

export type StockUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  symbol?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchange?: InputMaybe<Scalars['String']['input']>;
}>;


export type StockUpdateMutation = { __typename?: 'Mutation', stockUpdate?: { __typename?: 'StockUpdatePayload', stock?: { __typename?: 'StockType', id: string } | null } | null };

export type StockDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type StockDeleteMutation = { __typename?: 'Mutation', stockDelete?: { __typename?: 'StockDeletePayload', stock?: { __typename?: 'StockType', id: string } | null } | null };

export type StockRemoveMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StockRemoveMutation = { __typename?: 'Mutation', stockRemove?: { __typename?: 'StockRemovePayload', stock?: { __typename?: 'StockType', id: string } | null } | null };

export type StockpriceListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type StockpriceListQuery = { __typename?: 'Query', stockprices?: { __typename?: 'StockPriceTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'StockPriceTypeEdge', cursor: string, node?: { __typename?: 'StockPriceType', id: string, open?: number | null, high?: number | null, low?: number | null, close?: number | null, volume?: number | null, createdAt: any, stock?: { __typename?: 'StockType', id: string, symbol: string, name?: string | null } | null } | null } | null> } | null };

export type StockpriceSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StockpriceSelectQuery = { __typename?: 'Query', stockprice?: { __typename?: 'StockPriceType', id: string, open?: number | null, high?: number | null, low?: number | null, close?: number | null, volume?: number | null, createdAt: any, stock?: { __typename?: 'StockType', id: string, symbol: string, name?: string | null } | null } | null };

export type StockpriceCreateMutationVariables = Exact<{
  open?: InputMaybe<Scalars['Float']['input']>;
  high?: InputMaybe<Scalars['Float']['input']>;
  low?: InputMaybe<Scalars['Float']['input']>;
  close?: InputMaybe<Scalars['Float']['input']>;
  volume?: InputMaybe<Scalars['Float']['input']>;
  stockId: Scalars['ID']['input'];
}>;


export type StockpriceCreateMutation = { __typename?: 'Mutation', stockpriceCreate?: { __typename?: 'StockPriceCreatePayload', stockprice?: { __typename?: 'StockPriceType', id: string } | null } | null };

export type PortfolioAddMutationVariables = Exact<{
  stockids: Scalars['String']['input'];
}>;


export type PortfolioAddMutation = { __typename?: 'Mutation', portfolioAdd?: { __typename?: 'PortfolioAdd', user?: { __typename?: 'UserType', id: string } | null } | null };

export type PortfolioRemoveMutationVariables = Exact<{
  stockId: Scalars['ID']['input'];
}>;


export type PortfolioRemoveMutation = { __typename?: 'Mutation', portfolioRemove?: { __typename?: 'PortfolioRemovePayload', user?: { __typename?: 'UserType', id: string } | null } | null };

export type StrategyListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type StrategyListQuery = { __typename?: 'Query', strategies?: { __typename?: 'StrategyTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'StrategyTypeEdge', cursor: string, node?: { __typename?: 'StrategyType', id: string, name: string, performOrder: boolean, priority?: number | null, createdAt: any } | null } | null> } | null };

export type StrategySelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StrategySelectQuery = { __typename?: 'Query', strategy?: { __typename?: 'StrategyType', id: string, name: string, performOrder: boolean, priority?: number | null, createdAt: any } | null };

export type StrategyCreateMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type StrategyCreateMutation = { __typename?: 'Mutation', strategyCreate?: { __typename?: 'StrategyCreatePayload', strategy?: { __typename?: 'StrategyType', id: string } | null } | null };

export type OrderListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrderListQuery = { __typename?: 'Query', orders?: { __typename?: 'OrderTypeConnection', count?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'OrderTypeEdge', cursor: string, node?: { __typename?: 'OrderType', id: string, quantity?: number | null, active: boolean, short: boolean, buyPrice?: number | null, buyTime?: any | null, sellPrice?: number | null, sellTime?: any | null, createdAt: any, user: { __typename?: 'UserType', id: string, username: string }, strategy?: { __typename?: 'StrategyType', id: string, name: string } | null, account?: { __typename?: 'AccountType', id: string, balance?: number | null, user: { __typename?: 'UserType', id: string, username: string } } | null } | null } | null> } | null };

export type OrderSelectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrderSelectQuery = { __typename?: 'Query', order?: { __typename?: 'OrderType', id: string, quantity?: number | null, active: boolean, short: boolean, buyPrice?: number | null, buyTime?: any | null, sellPrice?: number | null, sellTime?: any | null, createdAt: any, user: { __typename?: 'UserType', id: string, username: string }, strategy?: { __typename?: 'StrategyType', id: string, name: string } | null, account?: { __typename?: 'AccountType', id: string, balance?: number | null } | null } | null };

export type OrderCreateMutationVariables = Exact<{
  accountId: Scalars['ID']['input'];
  strategyId: Scalars['ID']['input'];
  stockId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
  buyPrice?: InputMaybe<Scalars['Float']['input']>;
  sellPrice?: InputMaybe<Scalars['Float']['input']>;
}>;


export type OrderCreateMutation = { __typename?: 'Mutation', orderCreate?: { __typename?: 'OrderCreatePayload', order?: { __typename?: 'OrderType', id: string } | null } | null };


export const UserListDocument = gql`
    query userList($search: String, $isVerified: Boolean, $isDeleted: Boolean, $first: Int, $last: Int, $after: String, $before: String) {
  users(
    search: $search
    isVerified: $isVerified
    isDeleted: $isDeleted
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        username
        firstName
        lastName
        avatar
        mobile
        email
        gender
        bio
        address
        birthDate
        isVerified
        isUsed
        isBot
        isStaff
        isAdmin
        isSuperuser
        isActive
        dateJoined
        isModified
        modifiedAt
        isDeleted
        deletedAt
        restoredAt
        portfolio {
          stocks {
            edges {
              node {
                id
                symbol
              }
            }
          }
        }
        userAccounts {
          count
        }
        userOrders {
          count
        }
        userReviews {
          count
        }
      }
    }
  }
}
    `;

/**
 * __useUserListQuery__
 *
 * To run a query within a React component, call `useUserListQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      isVerified: // value for 'isVerified'
 *      isDeleted: // value for 'isDeleted'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useUserListQuery(baseOptions?: Apollo.QueryHookOptions<UserListQuery, UserListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserListQuery, UserListQueryVariables>(UserListDocument, options);
      }
export function useUserListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserListQuery, UserListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserListQuery, UserListQueryVariables>(UserListDocument, options);
        }
export type UserListQueryHookResult = ReturnType<typeof useUserListQuery>;
export type UserListLazyQueryHookResult = ReturnType<typeof useUserListLazyQuery>;
export type UserListQueryResult = Apollo.QueryResult<UserListQuery, UserListQueryVariables>;
export const UserSelectDocument = gql`
    query userSelect($id: ID!) {
  user(id: $id) {
    id
    username
    firstName
    lastName
    avatar
    mobile
    email
    gender
    bio
    address
    birthDate
    isVerified
    isUsed
    isBot
    isStaff
    isAdmin
    isSuperuser
    isActive
    dateJoined
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
    portfolio {
      stocks {
        edges {
          node {
            id
            symbol
          }
        }
      }
    }
    userAccounts {
      count
      edges {
        node {
          id
          balance
          currency
          category {
            id
            name
          }
        }
      }
    }
    userOrders {
      count
      edges {
        node {
          id
          quantity
        }
      }
    }
    userReviews {
      count
      edges {
        node {
          id
          itemId
          itemType
        }
      }
    }
  }
}
    `;

/**
 * __useUserSelectQuery__
 *
 * To run a query within a React component, call `useUserSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserSelectQuery(baseOptions: Apollo.QueryHookOptions<UserSelectQuery, UserSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserSelectQuery, UserSelectQueryVariables>(UserSelectDocument, options);
      }
export function useUserSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSelectQuery, UserSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserSelectQuery, UserSelectQueryVariables>(UserSelectDocument, options);
        }
export type UserSelectQueryHookResult = ReturnType<typeof useUserSelectQuery>;
export type UserSelectLazyQueryHookResult = ReturnType<typeof useUserSelectLazyQuery>;
export type UserSelectQueryResult = Apollo.QueryResult<UserSelectQuery, UserSelectQueryVariables>;
export const MeQueryDocument = gql`
    query meQuery {
  me {
    id
    username
    firstName
    lastName
    avatar
    mobile
    email
    gender
    bio
    address
    birthDate
    isVerified
    isUsed
    isBot
    isStaff
    isAdmin
    isSuperuser
    isActive
    dateJoined
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
    portfolio {
      stocks {
        edges {
          node {
            id
            symbol
          }
        }
      }
    }
    userAccounts {
      count
      edges {
        node {
          id
          balance
          currency
          category {
            id
            name
          }
        }
      }
    }
    userOrders {
      count
      edges {
        node {
          id
          quantity
        }
      }
    }
    userReviews {
      count
      edges {
        node {
          id
          itemId
          itemType
        }
      }
    }
  }
}
    `;

/**
 * __useMeQueryQuery__
 *
 * To run a query within a React component, call `useMeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQueryQuery(baseOptions?: Apollo.QueryHookOptions<MeQueryQuery, MeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQueryQuery, MeQueryQueryVariables>(MeQueryDocument, options);
      }
export function useMeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQueryQuery, MeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQueryQuery, MeQueryQueryVariables>(MeQueryDocument, options);
        }
export type MeQueryQueryHookResult = ReturnType<typeof useMeQueryQuery>;
export type MeQueryLazyQueryHookResult = ReturnType<typeof useMeQueryLazyQuery>;
export type MeQueryQueryResult = Apollo.QueryResult<MeQueryQuery, MeQueryQueryVariables>;
export const UserCreateDocument = gql`
    mutation userCreate($username: String!, $password: String!) {
  userCreate(username: $username, password: $password) {
    user {
      id
      username
      password
    }
  }
}
    `;
export type UserCreateMutationFn = Apollo.MutationFunction<UserCreateMutation, UserCreateMutationVariables>;

/**
 * __useUserCreateMutation__
 *
 * To run a mutation, you first call `useUserCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userCreateMutation, { data, loading, error }] = useUserCreateMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserCreateMutation(baseOptions?: Apollo.MutationHookOptions<UserCreateMutation, UserCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserCreateMutation, UserCreateMutationVariables>(UserCreateDocument, options);
      }
export type UserCreateMutationHookResult = ReturnType<typeof useUserCreateMutation>;
export type UserCreateMutationResult = Apollo.MutationResult<UserCreateMutation>;
export type UserCreateMutationOptions = Apollo.BaseMutationOptions<UserCreateMutation, UserCreateMutationVariables>;
export const TokenAuthDocument = gql`
    mutation tokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
  }
}
    `;
export type TokenAuthMutationFn = Apollo.MutationFunction<TokenAuthMutation, TokenAuthMutationVariables>;

/**
 * __useTokenAuthMutation__
 *
 * To run a mutation, you first call `useTokenAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTokenAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tokenAuthMutation, { data, loading, error }] = useTokenAuthMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useTokenAuthMutation(baseOptions?: Apollo.MutationHookOptions<TokenAuthMutation, TokenAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TokenAuthMutation, TokenAuthMutationVariables>(TokenAuthDocument, options);
      }
export type TokenAuthMutationHookResult = ReturnType<typeof useTokenAuthMutation>;
export type TokenAuthMutationResult = Apollo.MutationResult<TokenAuthMutation>;
export type TokenAuthMutationOptions = Apollo.BaseMutationOptions<TokenAuthMutation, TokenAuthMutationVariables>;
export const VerifyTokenDocument = gql`
    mutation verifyToken {
  verifyToken(
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE1NzI5NDg4MDQsIm9yaWdJYXQiOjE1NzI5NDg1MDR9.eZy4DNchj-K-QThICqZ8pmbBSVkQrnJvTOaTmfZh3tQ"
  ) {
    payload
  }
}
    `;
export type VerifyTokenMutationFn = Apollo.MutationFunction<VerifyTokenMutation, VerifyTokenMutationVariables>;

/**
 * __useVerifyTokenMutation__
 *
 * To run a mutation, you first call `useVerifyTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyTokenMutation, { data, loading, error }] = useVerifyTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useVerifyTokenMutation(baseOptions?: Apollo.MutationHookOptions<VerifyTokenMutation, VerifyTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyTokenMutation, VerifyTokenMutationVariables>(VerifyTokenDocument, options);
      }
export type VerifyTokenMutationHookResult = ReturnType<typeof useVerifyTokenMutation>;
export type VerifyTokenMutationResult = Apollo.MutationResult<VerifyTokenMutation>;
export type VerifyTokenMutationOptions = Apollo.BaseMutationOptions<VerifyTokenMutation, VerifyTokenMutationVariables>;
export const UserUpdateDocument = gql`
    mutation userUpdate($firstName: String, $lastName: String, $gender: String, $bio: String, $address: String) {
  userUpdate(
    firstName: $firstName
    lastName: $lastName
    gender: $gender
    bio: $bio
    address: $address
  ) {
    user {
      id
      username
      password
    }
  }
}
    `;
export type UserUpdateMutationFn = Apollo.MutationFunction<UserUpdateMutation, UserUpdateMutationVariables>;

/**
 * __useUserUpdateMutation__
 *
 * To run a mutation, you first call `useUserUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateMutation, { data, loading, error }] = useUserUpdateMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      gender: // value for 'gender'
 *      bio: // value for 'bio'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserUpdateMutation(baseOptions?: Apollo.MutationHookOptions<UserUpdateMutation, UserUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserUpdateMutation, UserUpdateMutationVariables>(UserUpdateDocument, options);
      }
export type UserUpdateMutationHookResult = ReturnType<typeof useUserUpdateMutation>;
export type UserUpdateMutationResult = Apollo.MutationResult<UserUpdateMutation>;
export type UserUpdateMutationOptions = Apollo.BaseMutationOptions<UserUpdateMutation, UserUpdateMutationVariables>;
export const EmailUpdateDocument = gql`
    mutation emailUpdate($email: String!) {
  emailUpdate(email: $email) {
    user {
      id
      username
      email
    }
  }
}
    `;
export type EmailUpdateMutationFn = Apollo.MutationFunction<EmailUpdateMutation, EmailUpdateMutationVariables>;

/**
 * __useEmailUpdateMutation__
 *
 * To run a mutation, you first call `useEmailUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailUpdateMutation, { data, loading, error }] = useEmailUpdateMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useEmailUpdateMutation(baseOptions?: Apollo.MutationHookOptions<EmailUpdateMutation, EmailUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailUpdateMutation, EmailUpdateMutationVariables>(EmailUpdateDocument, options);
      }
export type EmailUpdateMutationHookResult = ReturnType<typeof useEmailUpdateMutation>;
export type EmailUpdateMutationResult = Apollo.MutationResult<EmailUpdateMutation>;
export type EmailUpdateMutationOptions = Apollo.BaseMutationOptions<EmailUpdateMutation, EmailUpdateMutationVariables>;
export const AvatarUpdateDocument = gql`
    mutation avatarUpdate($avatar: String!) {
  avatarUpdate(avatar: $avatar) {
    user {
      id
      username
      avatar
    }
  }
}
    `;
export type AvatarUpdateMutationFn = Apollo.MutationFunction<AvatarUpdateMutation, AvatarUpdateMutationVariables>;

/**
 * __useAvatarUpdateMutation__
 *
 * To run a mutation, you first call `useAvatarUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAvatarUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [avatarUpdateMutation, { data, loading, error }] = useAvatarUpdateMutation({
 *   variables: {
 *      avatar: // value for 'avatar'
 *   },
 * });
 */
export function useAvatarUpdateMutation(baseOptions?: Apollo.MutationHookOptions<AvatarUpdateMutation, AvatarUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AvatarUpdateMutation, AvatarUpdateMutationVariables>(AvatarUpdateDocument, options);
      }
export type AvatarUpdateMutationHookResult = ReturnType<typeof useAvatarUpdateMutation>;
export type AvatarUpdateMutationResult = Apollo.MutationResult<AvatarUpdateMutation>;
export type AvatarUpdateMutationOptions = Apollo.BaseMutationOptions<AvatarUpdateMutation, AvatarUpdateMutationVariables>;
export const BirthdayUpdateDocument = gql`
    mutation birthdayUpdate($birthDate: String!) {
  birthdayUpdate(birthDate: $birthDate) {
    user {
      id
      username
      birthDate
    }
  }
}
    `;
export type BirthdayUpdateMutationFn = Apollo.MutationFunction<BirthdayUpdateMutation, BirthdayUpdateMutationVariables>;

/**
 * __useBirthdayUpdateMutation__
 *
 * To run a mutation, you first call `useBirthdayUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBirthdayUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [birthdayUpdateMutation, { data, loading, error }] = useBirthdayUpdateMutation({
 *   variables: {
 *      birthDate: // value for 'birthDate'
 *   },
 * });
 */
export function useBirthdayUpdateMutation(baseOptions?: Apollo.MutationHookOptions<BirthdayUpdateMutation, BirthdayUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BirthdayUpdateMutation, BirthdayUpdateMutationVariables>(BirthdayUpdateDocument, options);
      }
export type BirthdayUpdateMutationHookResult = ReturnType<typeof useBirthdayUpdateMutation>;
export type BirthdayUpdateMutationResult = Apollo.MutationResult<BirthdayUpdateMutation>;
export type BirthdayUpdateMutationOptions = Apollo.BaseMutationOptions<BirthdayUpdateMutation, BirthdayUpdateMutationVariables>;
export const GenderUpdateDocument = gql`
    mutation genderUpdate($gender: String!) {
  genderUpdate(gender: $gender) {
    user {
      id
      username
      gender
    }
  }
}
    `;
export type GenderUpdateMutationFn = Apollo.MutationFunction<GenderUpdateMutation, GenderUpdateMutationVariables>;

/**
 * __useGenderUpdateMutation__
 *
 * To run a mutation, you first call `useGenderUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenderUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [genderUpdateMutation, { data, loading, error }] = useGenderUpdateMutation({
 *   variables: {
 *      gender: // value for 'gender'
 *   },
 * });
 */
export function useGenderUpdateMutation(baseOptions?: Apollo.MutationHookOptions<GenderUpdateMutation, GenderUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenderUpdateMutation, GenderUpdateMutationVariables>(GenderUpdateDocument, options);
      }
export type GenderUpdateMutationHookResult = ReturnType<typeof useGenderUpdateMutation>;
export type GenderUpdateMutationResult = Apollo.MutationResult<GenderUpdateMutation>;
export type GenderUpdateMutationOptions = Apollo.BaseMutationOptions<GenderUpdateMutation, GenderUpdateMutationVariables>;
export const AdminToggleDocument = gql`
    mutation adminToggle($id: ID!, $isAdmin: Boolean) {
  adminToggle(input: {id: $id, isAdmin: $isAdmin}) {
    clientMutationId
  }
}
    `;
export type AdminToggleMutationFn = Apollo.MutationFunction<AdminToggleMutation, AdminToggleMutationVariables>;

/**
 * __useAdminToggleMutation__
 *
 * To run a mutation, you first call `useAdminToggleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminToggleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminToggleMutation, { data, loading, error }] = useAdminToggleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isAdmin: // value for 'isAdmin'
 *   },
 * });
 */
export function useAdminToggleMutation(baseOptions?: Apollo.MutationHookOptions<AdminToggleMutation, AdminToggleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminToggleMutation, AdminToggleMutationVariables>(AdminToggleDocument, options);
      }
export type AdminToggleMutationHookResult = ReturnType<typeof useAdminToggleMutation>;
export type AdminToggleMutationResult = Apollo.MutationResult<AdminToggleMutation>;
export type AdminToggleMutationOptions = Apollo.BaseMutationOptions<AdminToggleMutation, AdminToggleMutationVariables>;
export const SuperToggleDocument = gql`
    mutation superToggle($id: ID!, $isSuperuser: Boolean) {
  superToggle(input: {id: $id, isSuperuser: $isSuperuser}) {
    clientMutationId
  }
}
    `;
export type SuperToggleMutationFn = Apollo.MutationFunction<SuperToggleMutation, SuperToggleMutationVariables>;

/**
 * __useSuperToggleMutation__
 *
 * To run a mutation, you first call `useSuperToggleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSuperToggleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [superToggleMutation, { data, loading, error }] = useSuperToggleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isSuperuser: // value for 'isSuperuser'
 *   },
 * });
 */
export function useSuperToggleMutation(baseOptions?: Apollo.MutationHookOptions<SuperToggleMutation, SuperToggleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SuperToggleMutation, SuperToggleMutationVariables>(SuperToggleDocument, options);
      }
export type SuperToggleMutationHookResult = ReturnType<typeof useSuperToggleMutation>;
export type SuperToggleMutationResult = Apollo.MutationResult<SuperToggleMutation>;
export type SuperToggleMutationOptions = Apollo.BaseMutationOptions<SuperToggleMutation, SuperToggleMutationVariables>;
export const ActiveToggleDocument = gql`
    mutation activeToggle($id: ID!, $isActive: Boolean) {
  activeToggle(input: {id: $id, isActive: $isActive}) {
    clientMutationId
  }
}
    `;
export type ActiveToggleMutationFn = Apollo.MutationFunction<ActiveToggleMutation, ActiveToggleMutationVariables>;

/**
 * __useActiveToggleMutation__
 *
 * To run a mutation, you first call `useActiveToggleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActiveToggleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activeToggleMutation, { data, loading, error }] = useActiveToggleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useActiveToggleMutation(baseOptions?: Apollo.MutationHookOptions<ActiveToggleMutation, ActiveToggleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActiveToggleMutation, ActiveToggleMutationVariables>(ActiveToggleDocument, options);
      }
export type ActiveToggleMutationHookResult = ReturnType<typeof useActiveToggleMutation>;
export type ActiveToggleMutationResult = Apollo.MutationResult<ActiveToggleMutation>;
export type ActiveToggleMutationOptions = Apollo.BaseMutationOptions<ActiveToggleMutation, ActiveToggleMutationVariables>;
export const UserDeleteDocument = gql`
    mutation userDelete($id: ID, $isDeleted: Boolean) {
  userDelete(input: {id: $id, isDeleted: $isDeleted}) {
    user {
      id
    }
  }
}
    `;
export type UserDeleteMutationFn = Apollo.MutationFunction<UserDeleteMutation, UserDeleteMutationVariables>;

/**
 * __useUserDeleteMutation__
 *
 * To run a mutation, you first call `useUserDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userDeleteMutation, { data, loading, error }] = useUserDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useUserDeleteMutation(baseOptions?: Apollo.MutationHookOptions<UserDeleteMutation, UserDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserDeleteMutation, UserDeleteMutationVariables>(UserDeleteDocument, options);
      }
export type UserDeleteMutationHookResult = ReturnType<typeof useUserDeleteMutation>;
export type UserDeleteMutationResult = Apollo.MutationResult<UserDeleteMutation>;
export type UserDeleteMutationOptions = Apollo.BaseMutationOptions<UserDeleteMutation, UserDeleteMutationVariables>;
export const AnalyticListDocument = gql`
    query analyticList($first: Int, $last: Int, $after: String, $before: String) {
  analytics(first: $first, last: $last, after: $after, before: $before) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        anonymousId
        userId
        userTraits
        path
        url
        channel
        event
        eventItems
        createdAt
      }
    }
  }
}
    `;

/**
 * __useAnalyticListQuery__
 *
 * To run a query within a React component, call `useAnalyticListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnalyticListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnalyticListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAnalyticListQuery(baseOptions?: Apollo.QueryHookOptions<AnalyticListQuery, AnalyticListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnalyticListQuery, AnalyticListQueryVariables>(AnalyticListDocument, options);
      }
export function useAnalyticListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnalyticListQuery, AnalyticListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnalyticListQuery, AnalyticListQueryVariables>(AnalyticListDocument, options);
        }
export type AnalyticListQueryHookResult = ReturnType<typeof useAnalyticListQuery>;
export type AnalyticListLazyQueryHookResult = ReturnType<typeof useAnalyticListLazyQuery>;
export type AnalyticListQueryResult = Apollo.QueryResult<AnalyticListQuery, AnalyticListQueryVariables>;
export const AnalyticSelectDocument = gql`
    query analyticSelect($id: ID!) {
  analytic(id: $id) {
    anonymousId
    userId
    userTraits
    path
    url
    channel
    event
    eventItems
    createdAt
  }
}
    `;

/**
 * __useAnalyticSelectQuery__
 *
 * To run a query within a React component, call `useAnalyticSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnalyticSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnalyticSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAnalyticSelectQuery(baseOptions: Apollo.QueryHookOptions<AnalyticSelectQuery, AnalyticSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnalyticSelectQuery, AnalyticSelectQueryVariables>(AnalyticSelectDocument, options);
      }
export function useAnalyticSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnalyticSelectQuery, AnalyticSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnalyticSelectQuery, AnalyticSelectQueryVariables>(AnalyticSelectDocument, options);
        }
export type AnalyticSelectQueryHookResult = ReturnType<typeof useAnalyticSelectQuery>;
export type AnalyticSelectLazyQueryHookResult = ReturnType<typeof useAnalyticSelectLazyQuery>;
export type AnalyticSelectQueryResult = Apollo.QueryResult<AnalyticSelectQuery, AnalyticSelectQueryVariables>;
export const AnalyticCreateDocument = gql`
    mutation analyticCreate($anonymousId: String, $userId: String, $userTraits: String, $path: String, $url: String, $channel: String, $event: String, $eventItems: String) {
  analyticCreate(
    input: {anonymousId: $anonymousId, userId: $userId, userTraits: $userTraits, path: $path, url: $url, channel: $channel, event: $event, eventItems: $eventItems}
  ) {
    analytic {
      id
    }
  }
}
    `;
export type AnalyticCreateMutationFn = Apollo.MutationFunction<AnalyticCreateMutation, AnalyticCreateMutationVariables>;

/**
 * __useAnalyticCreateMutation__
 *
 * To run a mutation, you first call `useAnalyticCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnalyticCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [analyticCreateMutation, { data, loading, error }] = useAnalyticCreateMutation({
 *   variables: {
 *      anonymousId: // value for 'anonymousId'
 *      userId: // value for 'userId'
 *      userTraits: // value for 'userTraits'
 *      path: // value for 'path'
 *      url: // value for 'url'
 *      channel: // value for 'channel'
 *      event: // value for 'event'
 *      eventItems: // value for 'eventItems'
 *   },
 * });
 */
export function useAnalyticCreateMutation(baseOptions?: Apollo.MutationHookOptions<AnalyticCreateMutation, AnalyticCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AnalyticCreateMutation, AnalyticCreateMutationVariables>(AnalyticCreateDocument, options);
      }
export type AnalyticCreateMutationHookResult = ReturnType<typeof useAnalyticCreateMutation>;
export type AnalyticCreateMutationResult = Apollo.MutationResult<AnalyticCreateMutation>;
export type AnalyticCreateMutationOptions = Apollo.BaseMutationOptions<AnalyticCreateMutation, AnalyticCreateMutationVariables>;
export const AnalyticUpsertDocument = gql`
    mutation analyticUpsert($id: ID, $anonymousId: String, $userId: String, $userTraits: String, $path: String, $url: String, $channel: String, $event: String, $eventItems: String, $createdAt: String) {
  analyticUpsert(
    input: {id: $id, anonymousId: $anonymousId, userId: $userId, userTraits: $userTraits, path: $path, url: $url, channel: $channel, event: $event, eventItems: $eventItems, createdAt: $createdAt}
  ) {
    analytic {
      id
    }
  }
}
    `;
export type AnalyticUpsertMutationFn = Apollo.MutationFunction<AnalyticUpsertMutation, AnalyticUpsertMutationVariables>;

/**
 * __useAnalyticUpsertMutation__
 *
 * To run a mutation, you first call `useAnalyticUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnalyticUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [analyticUpsertMutation, { data, loading, error }] = useAnalyticUpsertMutation({
 *   variables: {
 *      id: // value for 'id'
 *      anonymousId: // value for 'anonymousId'
 *      userId: // value for 'userId'
 *      userTraits: // value for 'userTraits'
 *      path: // value for 'path'
 *      url: // value for 'url'
 *      channel: // value for 'channel'
 *      event: // value for 'event'
 *      eventItems: // value for 'eventItems'
 *      createdAt: // value for 'createdAt'
 *   },
 * });
 */
export function useAnalyticUpsertMutation(baseOptions?: Apollo.MutationHookOptions<AnalyticUpsertMutation, AnalyticUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AnalyticUpsertMutation, AnalyticUpsertMutationVariables>(AnalyticUpsertDocument, options);
      }
export type AnalyticUpsertMutationHookResult = ReturnType<typeof useAnalyticUpsertMutation>;
export type AnalyticUpsertMutationResult = Apollo.MutationResult<AnalyticUpsertMutation>;
export type AnalyticUpsertMutationOptions = Apollo.BaseMutationOptions<AnalyticUpsertMutation, AnalyticUpsertMutationVariables>;
export const AnalyticUpdateDocument = gql`
    mutation analyticUpdate($id: ID, $anonymousId: String, $userId: String, $userTraits: String, $path: String, $url: String, $channel: String, $event: String, $eventItems: String) {
  analyticUpdate(
    input: {id: $id, anonymousId: $anonymousId, userId: $userId, userTraits: $userTraits, path: $path, url: $url, channel: $channel, event: $event, eventItems: $eventItems}
  ) {
    analytic {
      id
    }
  }
}
    `;
export type AnalyticUpdateMutationFn = Apollo.MutationFunction<AnalyticUpdateMutation, AnalyticUpdateMutationVariables>;

/**
 * __useAnalyticUpdateMutation__
 *
 * To run a mutation, you first call `useAnalyticUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnalyticUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [analyticUpdateMutation, { data, loading, error }] = useAnalyticUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      anonymousId: // value for 'anonymousId'
 *      userId: // value for 'userId'
 *      userTraits: // value for 'userTraits'
 *      path: // value for 'path'
 *      url: // value for 'url'
 *      channel: // value for 'channel'
 *      event: // value for 'event'
 *      eventItems: // value for 'eventItems'
 *   },
 * });
 */
export function useAnalyticUpdateMutation(baseOptions?: Apollo.MutationHookOptions<AnalyticUpdateMutation, AnalyticUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AnalyticUpdateMutation, AnalyticUpdateMutationVariables>(AnalyticUpdateDocument, options);
      }
export type AnalyticUpdateMutationHookResult = ReturnType<typeof useAnalyticUpdateMutation>;
export type AnalyticUpdateMutationResult = Apollo.MutationResult<AnalyticUpdateMutation>;
export type AnalyticUpdateMutationOptions = Apollo.BaseMutationOptions<AnalyticUpdateMutation, AnalyticUpdateMutationVariables>;
export const BannerListDocument = gql`
    query bannerList($isActive: Boolean, $isDeleted: Boolean, $first: Int, $last: Int, $after: String, $before: String) {
  banners(
    isActive: $isActive
    isDeleted: $isDeleted
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        title
        content
        pic
        isActive
        createdAt
        isModified
        modifiedAt
        isDeleted
        deletedAt
        restoredAt
      }
    }
  }
}
    `;

/**
 * __useBannerListQuery__
 *
 * To run a query within a React component, call `useBannerListQuery` and pass it any options that fit your needs.
 * When your component renders, `useBannerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBannerListQuery({
 *   variables: {
 *      isActive: // value for 'isActive'
 *      isDeleted: // value for 'isDeleted'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useBannerListQuery(baseOptions?: Apollo.QueryHookOptions<BannerListQuery, BannerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BannerListQuery, BannerListQueryVariables>(BannerListDocument, options);
      }
export function useBannerListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BannerListQuery, BannerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BannerListQuery, BannerListQueryVariables>(BannerListDocument, options);
        }
export type BannerListQueryHookResult = ReturnType<typeof useBannerListQuery>;
export type BannerListLazyQueryHookResult = ReturnType<typeof useBannerListLazyQuery>;
export type BannerListQueryResult = Apollo.QueryResult<BannerListQuery, BannerListQueryVariables>;
export const BannerSelectDocument = gql`
    query bannerSelect($id: ID!) {
  banner(id: $id) {
    id
    title
    content
    pic
    isActive
    createdAt
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
  }
}
    `;

/**
 * __useBannerSelectQuery__
 *
 * To run a query within a React component, call `useBannerSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useBannerSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBannerSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBannerSelectQuery(baseOptions: Apollo.QueryHookOptions<BannerSelectQuery, BannerSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BannerSelectQuery, BannerSelectQueryVariables>(BannerSelectDocument, options);
      }
export function useBannerSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BannerSelectQuery, BannerSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BannerSelectQuery, BannerSelectQueryVariables>(BannerSelectDocument, options);
        }
export type BannerSelectQueryHookResult = ReturnType<typeof useBannerSelectQuery>;
export type BannerSelectLazyQueryHookResult = ReturnType<typeof useBannerSelectLazyQuery>;
export type BannerSelectQueryResult = Apollo.QueryResult<BannerSelectQuery, BannerSelectQueryVariables>;
export const BannerCreateDocument = gql`
    mutation bannerCreate($title: String!, $content: String, $pic: String) {
  bannerCreate(input: {title: $title, content: $content, pic: $pic}) {
    banner {
      id
    }
  }
}
    `;
export type BannerCreateMutationFn = Apollo.MutationFunction<BannerCreateMutation, BannerCreateMutationVariables>;

/**
 * __useBannerCreateMutation__
 *
 * To run a mutation, you first call `useBannerCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBannerCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bannerCreateMutation, { data, loading, error }] = useBannerCreateMutation({
 *   variables: {
 *      title: // value for 'title'
 *      content: // value for 'content'
 *      pic: // value for 'pic'
 *   },
 * });
 */
export function useBannerCreateMutation(baseOptions?: Apollo.MutationHookOptions<BannerCreateMutation, BannerCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BannerCreateMutation, BannerCreateMutationVariables>(BannerCreateDocument, options);
      }
export type BannerCreateMutationHookResult = ReturnType<typeof useBannerCreateMutation>;
export type BannerCreateMutationResult = Apollo.MutationResult<BannerCreateMutation>;
export type BannerCreateMutationOptions = Apollo.BaseMutationOptions<BannerCreateMutation, BannerCreateMutationVariables>;
export const BannerUpdateDocument = gql`
    mutation bannerUpdate($id: ID!, $title: String!, $content: String, $pic: String, $isActive: Boolean) {
  bannerUpdate(
    input: {id: $id, title: $title, content: $content, pic: $pic, isActive: $isActive}
  ) {
    banner {
      id
    }
  }
}
    `;
export type BannerUpdateMutationFn = Apollo.MutationFunction<BannerUpdateMutation, BannerUpdateMutationVariables>;

/**
 * __useBannerUpdateMutation__
 *
 * To run a mutation, you first call `useBannerUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBannerUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bannerUpdateMutation, { data, loading, error }] = useBannerUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      content: // value for 'content'
 *      pic: // value for 'pic'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useBannerUpdateMutation(baseOptions?: Apollo.MutationHookOptions<BannerUpdateMutation, BannerUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BannerUpdateMutation, BannerUpdateMutationVariables>(BannerUpdateDocument, options);
      }
export type BannerUpdateMutationHookResult = ReturnType<typeof useBannerUpdateMutation>;
export type BannerUpdateMutationResult = Apollo.MutationResult<BannerUpdateMutation>;
export type BannerUpdateMutationOptions = Apollo.BaseMutationOptions<BannerUpdateMutation, BannerUpdateMutationVariables>;
export const BannerDeleteDocument = gql`
    mutation bannerDelete($id: ID, $isDeleted: Boolean) {
  bannerDelete(input: {id: $id, isDeleted: $isDeleted}) {
    banner {
      id
    }
  }
}
    `;
export type BannerDeleteMutationFn = Apollo.MutationFunction<BannerDeleteMutation, BannerDeleteMutationVariables>;

/**
 * __useBannerDeleteMutation__
 *
 * To run a mutation, you first call `useBannerDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBannerDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bannerDeleteMutation, { data, loading, error }] = useBannerDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useBannerDeleteMutation(baseOptions?: Apollo.MutationHookOptions<BannerDeleteMutation, BannerDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BannerDeleteMutation, BannerDeleteMutationVariables>(BannerDeleteDocument, options);
      }
export type BannerDeleteMutationHookResult = ReturnType<typeof useBannerDeleteMutation>;
export type BannerDeleteMutationResult = Apollo.MutationResult<BannerDeleteMutation>;
export type BannerDeleteMutationOptions = Apollo.BaseMutationOptions<BannerDeleteMutation, BannerDeleteMutationVariables>;
export const BannerRemoveDocument = gql`
    mutation bannerRemove($id: ID) {
  bannerRemove(input: {id: $id}) {
    banner {
      id
    }
  }
}
    `;
export type BannerRemoveMutationFn = Apollo.MutationFunction<BannerRemoveMutation, BannerRemoveMutationVariables>;

/**
 * __useBannerRemoveMutation__
 *
 * To run a mutation, you first call `useBannerRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBannerRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bannerRemoveMutation, { data, loading, error }] = useBannerRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBannerRemoveMutation(baseOptions?: Apollo.MutationHookOptions<BannerRemoveMutation, BannerRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BannerRemoveMutation, BannerRemoveMutationVariables>(BannerRemoveDocument, options);
      }
export type BannerRemoveMutationHookResult = ReturnType<typeof useBannerRemoveMutation>;
export type BannerRemoveMutationResult = Apollo.MutationResult<BannerRemoveMutation>;
export type BannerRemoveMutationOptions = Apollo.BaseMutationOptions<BannerRemoveMutation, BannerRemoveMutationVariables>;
export const AccountCategoryListDocument = gql`
    query accountCategoryList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  accountcategories(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        description
        categoryAccounts {
          count
        }
      }
    }
  }
}
    `;

/**
 * __useAccountCategoryListQuery__
 *
 * To run a query within a React component, call `useAccountCategoryListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountCategoryListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountCategoryListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAccountCategoryListQuery(baseOptions?: Apollo.QueryHookOptions<AccountCategoryListQuery, AccountCategoryListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountCategoryListQuery, AccountCategoryListQueryVariables>(AccountCategoryListDocument, options);
      }
export function useAccountCategoryListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountCategoryListQuery, AccountCategoryListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountCategoryListQuery, AccountCategoryListQueryVariables>(AccountCategoryListDocument, options);
        }
export type AccountCategoryListQueryHookResult = ReturnType<typeof useAccountCategoryListQuery>;
export type AccountCategoryListLazyQueryHookResult = ReturnType<typeof useAccountCategoryListLazyQuery>;
export type AccountCategoryListQueryResult = Apollo.QueryResult<AccountCategoryListQuery, AccountCategoryListQueryVariables>;
export const AccountCategorySelectDocument = gql`
    query accountCategorySelect($id: ID!) {
  accountcategory(id: $id) {
    id
    name
    description
    categoryAccounts {
      count
    }
  }
}
    `;

/**
 * __useAccountCategorySelectQuery__
 *
 * To run a query within a React component, call `useAccountCategorySelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountCategorySelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountCategorySelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountCategorySelectQuery(baseOptions: Apollo.QueryHookOptions<AccountCategorySelectQuery, AccountCategorySelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountCategorySelectQuery, AccountCategorySelectQueryVariables>(AccountCategorySelectDocument, options);
      }
export function useAccountCategorySelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountCategorySelectQuery, AccountCategorySelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountCategorySelectQuery, AccountCategorySelectQueryVariables>(AccountCategorySelectDocument, options);
        }
export type AccountCategorySelectQueryHookResult = ReturnType<typeof useAccountCategorySelectQuery>;
export type AccountCategorySelectLazyQueryHookResult = ReturnType<typeof useAccountCategorySelectLazyQuery>;
export type AccountCategorySelectQueryResult = Apollo.QueryResult<AccountCategorySelectQuery, AccountCategorySelectQueryVariables>;
export const AccountCategoryCreateDocument = gql`
    mutation accountCategoryCreate($name: String, $description: String) {
  accountCategoryCreate(input: {name: $name, description: $description}) {
    category {
      id
    }
  }
}
    `;
export type AccountCategoryCreateMutationFn = Apollo.MutationFunction<AccountCategoryCreateMutation, AccountCategoryCreateMutationVariables>;

/**
 * __useAccountCategoryCreateMutation__
 *
 * To run a mutation, you first call `useAccountCategoryCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountCategoryCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountCategoryCreateMutation, { data, loading, error }] = useAccountCategoryCreateMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAccountCategoryCreateMutation(baseOptions?: Apollo.MutationHookOptions<AccountCategoryCreateMutation, AccountCategoryCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountCategoryCreateMutation, AccountCategoryCreateMutationVariables>(AccountCategoryCreateDocument, options);
      }
export type AccountCategoryCreateMutationHookResult = ReturnType<typeof useAccountCategoryCreateMutation>;
export type AccountCategoryCreateMutationResult = Apollo.MutationResult<AccountCategoryCreateMutation>;
export type AccountCategoryCreateMutationOptions = Apollo.BaseMutationOptions<AccountCategoryCreateMutation, AccountCategoryCreateMutationVariables>;
export const AccountCategoryUpdateDocument = gql`
    mutation accountCategoryUpdate($id: ID!, $name: String, $description: String) {
  accountCategoryUpdate(input: {id: $id, name: $name, description: $description}) {
    category {
      id
    }
  }
}
    `;
export type AccountCategoryUpdateMutationFn = Apollo.MutationFunction<AccountCategoryUpdateMutation, AccountCategoryUpdateMutationVariables>;

/**
 * __useAccountCategoryUpdateMutation__
 *
 * To run a mutation, you first call `useAccountCategoryUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountCategoryUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountCategoryUpdateMutation, { data, loading, error }] = useAccountCategoryUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAccountCategoryUpdateMutation(baseOptions?: Apollo.MutationHookOptions<AccountCategoryUpdateMutation, AccountCategoryUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountCategoryUpdateMutation, AccountCategoryUpdateMutationVariables>(AccountCategoryUpdateDocument, options);
      }
export type AccountCategoryUpdateMutationHookResult = ReturnType<typeof useAccountCategoryUpdateMutation>;
export type AccountCategoryUpdateMutationResult = Apollo.MutationResult<AccountCategoryUpdateMutation>;
export type AccountCategoryUpdateMutationOptions = Apollo.BaseMutationOptions<AccountCategoryUpdateMutation, AccountCategoryUpdateMutationVariables>;
export const AccountCategoryDeleteDocument = gql`
    mutation accountCategoryDelete($id: ID!, $isDeleted: Boolean) {
  accountCategoryDelete(input: {id: $id, isDeleted: false}) {
    category {
      id
    }
  }
}
    `;
export type AccountCategoryDeleteMutationFn = Apollo.MutationFunction<AccountCategoryDeleteMutation, AccountCategoryDeleteMutationVariables>;

/**
 * __useAccountCategoryDeleteMutation__
 *
 * To run a mutation, you first call `useAccountCategoryDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountCategoryDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountCategoryDeleteMutation, { data, loading, error }] = useAccountCategoryDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useAccountCategoryDeleteMutation(baseOptions?: Apollo.MutationHookOptions<AccountCategoryDeleteMutation, AccountCategoryDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountCategoryDeleteMutation, AccountCategoryDeleteMutationVariables>(AccountCategoryDeleteDocument, options);
      }
export type AccountCategoryDeleteMutationHookResult = ReturnType<typeof useAccountCategoryDeleteMutation>;
export type AccountCategoryDeleteMutationResult = Apollo.MutationResult<AccountCategoryDeleteMutation>;
export type AccountCategoryDeleteMutationOptions = Apollo.BaseMutationOptions<AccountCategoryDeleteMutation, AccountCategoryDeleteMutationVariables>;
export const AccountCategoryRemoveDocument = gql`
    mutation accountCategoryRemove($id: ID!) {
  accountCategoryRemove(input: {id: $id}) {
    category {
      id
    }
  }
}
    `;
export type AccountCategoryRemoveMutationFn = Apollo.MutationFunction<AccountCategoryRemoveMutation, AccountCategoryRemoveMutationVariables>;

/**
 * __useAccountCategoryRemoveMutation__
 *
 * To run a mutation, you first call `useAccountCategoryRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountCategoryRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountCategoryRemoveMutation, { data, loading, error }] = useAccountCategoryRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountCategoryRemoveMutation(baseOptions?: Apollo.MutationHookOptions<AccountCategoryRemoveMutation, AccountCategoryRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountCategoryRemoveMutation, AccountCategoryRemoveMutationVariables>(AccountCategoryRemoveDocument, options);
      }
export type AccountCategoryRemoveMutationHookResult = ReturnType<typeof useAccountCategoryRemoveMutation>;
export type AccountCategoryRemoveMutationResult = Apollo.MutationResult<AccountCategoryRemoveMutation>;
export type AccountCategoryRemoveMutationOptions = Apollo.BaseMutationOptions<AccountCategoryRemoveMutation, AccountCategoryRemoveMutationVariables>;
export const AccountListDocument = gql`
    query accountList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  accounts(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        balance
        currency
        createdAt
        isModified
        modifiedAt
        isDeleted
        deletedAt
        restoredAt
        user {
          id
          username
        }
        category {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useAccountListQuery__
 *
 * To run a query within a React component, call `useAccountListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAccountListQuery(baseOptions?: Apollo.QueryHookOptions<AccountListQuery, AccountListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountListQuery, AccountListQueryVariables>(AccountListDocument, options);
      }
export function useAccountListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountListQuery, AccountListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountListQuery, AccountListQueryVariables>(AccountListDocument, options);
        }
export type AccountListQueryHookResult = ReturnType<typeof useAccountListQuery>;
export type AccountListLazyQueryHookResult = ReturnType<typeof useAccountListLazyQuery>;
export type AccountListQueryResult = Apollo.QueryResult<AccountListQuery, AccountListQueryVariables>;
export const AccountSelectDocument = gql`
    query accountSelect($id: ID!) {
  account(id: $id) {
    id
    balance
    currency
    createdAt
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
    user {
      id
      username
    }
    category {
      id
      name
    }
  }
}
    `;

/**
 * __useAccountSelectQuery__
 *
 * To run a query within a React component, call `useAccountSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountSelectQuery(baseOptions: Apollo.QueryHookOptions<AccountSelectQuery, AccountSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountSelectQuery, AccountSelectQueryVariables>(AccountSelectDocument, options);
      }
export function useAccountSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountSelectQuery, AccountSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountSelectQuery, AccountSelectQueryVariables>(AccountSelectDocument, options);
        }
export type AccountSelectQueryHookResult = ReturnType<typeof useAccountSelectQuery>;
export type AccountSelectLazyQueryHookResult = ReturnType<typeof useAccountSelectLazyQuery>;
export type AccountSelectQueryResult = Apollo.QueryResult<AccountSelectQuery, AccountSelectQueryVariables>;
export const AccountCreateDocument = gql`
    mutation accountCreate($categoryId: ID!, $currency: String) {
  accountCreate(input: {categoryId: $categoryId, currency: $currency}) {
    account {
      id
    }
  }
}
    `;
export type AccountCreateMutationFn = Apollo.MutationFunction<AccountCreateMutation, AccountCreateMutationVariables>;

/**
 * __useAccountCreateMutation__
 *
 * To run a mutation, you first call `useAccountCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountCreateMutation, { data, loading, error }] = useAccountCreateMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      currency: // value for 'currency'
 *   },
 * });
 */
export function useAccountCreateMutation(baseOptions?: Apollo.MutationHookOptions<AccountCreateMutation, AccountCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountCreateMutation, AccountCreateMutationVariables>(AccountCreateDocument, options);
      }
export type AccountCreateMutationHookResult = ReturnType<typeof useAccountCreateMutation>;
export type AccountCreateMutationResult = Apollo.MutationResult<AccountCreateMutation>;
export type AccountCreateMutationOptions = Apollo.BaseMutationOptions<AccountCreateMutation, AccountCreateMutationVariables>;
export const AccountUpdateDocument = gql`
    mutation accountUpdate($id: ID!, $categoryId: ID!, $currency: String) {
  accountUpdate(input: {id: $id, categoryId: $categoryId, currency: $currency}) {
    account {
      id
    }
  }
}
    `;
export type AccountUpdateMutationFn = Apollo.MutationFunction<AccountUpdateMutation, AccountUpdateMutationVariables>;

/**
 * __useAccountUpdateMutation__
 *
 * To run a mutation, you first call `useAccountUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountUpdateMutation, { data, loading, error }] = useAccountUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      categoryId: // value for 'categoryId'
 *      currency: // value for 'currency'
 *   },
 * });
 */
export function useAccountUpdateMutation(baseOptions?: Apollo.MutationHookOptions<AccountUpdateMutation, AccountUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountUpdateMutation, AccountUpdateMutationVariables>(AccountUpdateDocument, options);
      }
export type AccountUpdateMutationHookResult = ReturnType<typeof useAccountUpdateMutation>;
export type AccountUpdateMutationResult = Apollo.MutationResult<AccountUpdateMutation>;
export type AccountUpdateMutationOptions = Apollo.BaseMutationOptions<AccountUpdateMutation, AccountUpdateMutationVariables>;
export const AccountDeleteDocument = gql`
    mutation accountDelete($id: ID!, $isDeleted: Boolean) {
  accountDelete(input: {id: $id, isDeleted: false}) {
    account {
      id
    }
  }
}
    `;
export type AccountDeleteMutationFn = Apollo.MutationFunction<AccountDeleteMutation, AccountDeleteMutationVariables>;

/**
 * __useAccountDeleteMutation__
 *
 * To run a mutation, you first call `useAccountDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountDeleteMutation, { data, loading, error }] = useAccountDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useAccountDeleteMutation(baseOptions?: Apollo.MutationHookOptions<AccountDeleteMutation, AccountDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountDeleteMutation, AccountDeleteMutationVariables>(AccountDeleteDocument, options);
      }
export type AccountDeleteMutationHookResult = ReturnType<typeof useAccountDeleteMutation>;
export type AccountDeleteMutationResult = Apollo.MutationResult<AccountDeleteMutation>;
export type AccountDeleteMutationOptions = Apollo.BaseMutationOptions<AccountDeleteMutation, AccountDeleteMutationVariables>;
export const AccountRemoveDocument = gql`
    mutation accountRemove($id: ID!) {
  accountRemove(input: {id: $id}) {
    account {
      id
    }
  }
}
    `;
export type AccountRemoveMutationFn = Apollo.MutationFunction<AccountRemoveMutation, AccountRemoveMutationVariables>;

/**
 * __useAccountRemoveMutation__
 *
 * To run a mutation, you first call `useAccountRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountRemoveMutation, { data, loading, error }] = useAccountRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountRemoveMutation(baseOptions?: Apollo.MutationHookOptions<AccountRemoveMutation, AccountRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountRemoveMutation, AccountRemoveMutationVariables>(AccountRemoveDocument, options);
      }
export type AccountRemoveMutationHookResult = ReturnType<typeof useAccountRemoveMutation>;
export type AccountRemoveMutationResult = Apollo.MutationResult<AccountRemoveMutation>;
export type AccountRemoveMutationOptions = Apollo.BaseMutationOptions<AccountRemoveMutation, AccountRemoveMutationVariables>;
export const TransactionListDocument = gql`
    query transactionList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  transactions(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        amount
        description
        createdAt
        account {
          id
          balance
          currency
          user {
            id
            username
          }
          category {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTransactionListQuery__
 *
 * To run a query within a React component, call `useTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useTransactionListQuery(baseOptions?: Apollo.QueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
      }
export function useTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
        }
export type TransactionListQueryHookResult = ReturnType<typeof useTransactionListQuery>;
export type TransactionListLazyQueryHookResult = ReturnType<typeof useTransactionListLazyQuery>;
export type TransactionListQueryResult = Apollo.QueryResult<TransactionListQuery, TransactionListQueryVariables>;
export const TransactionSelectDocument = gql`
    query transactionSelect($id: ID!) {
  transaction(id: $id) {
    id
    amount
    description
    createdAt
    account {
      id
      balance
      currency
      user {
        id
        username
      }
      category {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useTransactionSelectQuery__
 *
 * To run a query within a React component, call `useTransactionSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTransactionSelectQuery(baseOptions: Apollo.QueryHookOptions<TransactionSelectQuery, TransactionSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionSelectQuery, TransactionSelectQueryVariables>(TransactionSelectDocument, options);
      }
export function useTransactionSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionSelectQuery, TransactionSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionSelectQuery, TransactionSelectQueryVariables>(TransactionSelectDocument, options);
        }
export type TransactionSelectQueryHookResult = ReturnType<typeof useTransactionSelectQuery>;
export type TransactionSelectLazyQueryHookResult = ReturnType<typeof useTransactionSelectLazyQuery>;
export type TransactionSelectQueryResult = Apollo.QueryResult<TransactionSelectQuery, TransactionSelectQueryVariables>;
export const TransactionCreateDocument = gql`
    mutation transactionCreate($accountId: ID!, $amount: Float, $description: String) {
  transactionCreate(
    input: {accountId: $accountId, amount: $amount, description: $description}
  ) {
    transaction {
      id
    }
  }
}
    `;
export type TransactionCreateMutationFn = Apollo.MutationFunction<TransactionCreateMutation, TransactionCreateMutationVariables>;

/**
 * __useTransactionCreateMutation__
 *
 * To run a mutation, you first call `useTransactionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransactionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionCreateMutation, { data, loading, error }] = useTransactionCreateMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      amount: // value for 'amount'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useTransactionCreateMutation(baseOptions?: Apollo.MutationHookOptions<TransactionCreateMutation, TransactionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TransactionCreateMutation, TransactionCreateMutationVariables>(TransactionCreateDocument, options);
      }
export type TransactionCreateMutationHookResult = ReturnType<typeof useTransactionCreateMutation>;
export type TransactionCreateMutationResult = Apollo.MutationResult<TransactionCreateMutation>;
export type TransactionCreateMutationOptions = Apollo.BaseMutationOptions<TransactionCreateMutation, TransactionCreateMutationVariables>;
export const HelpCategoryListDocument = gql`
    query helpCategoryList($search: String, $slug: String, $isDeleted: Boolean, $first: Int, $last: Int, $after: String, $before: String) {
  helpCategories(
    search: $search
    slug: $slug
    isDeleted: $isDeleted
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        description
        slug
        pic
        createdAt
        isModified
        modifiedAt
        isDeleted
        deletedAt
        restoredAt
        categoryHelps {
          count
          edges {
            node {
              id
              title
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useHelpCategoryListQuery__
 *
 * To run a query within a React component, call `useHelpCategoryListQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelpCategoryListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelpCategoryListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      slug: // value for 'slug'
 *      isDeleted: // value for 'isDeleted'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useHelpCategoryListQuery(baseOptions?: Apollo.QueryHookOptions<HelpCategoryListQuery, HelpCategoryListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelpCategoryListQuery, HelpCategoryListQueryVariables>(HelpCategoryListDocument, options);
      }
export function useHelpCategoryListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelpCategoryListQuery, HelpCategoryListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelpCategoryListQuery, HelpCategoryListQueryVariables>(HelpCategoryListDocument, options);
        }
export type HelpCategoryListQueryHookResult = ReturnType<typeof useHelpCategoryListQuery>;
export type HelpCategoryListLazyQueryHookResult = ReturnType<typeof useHelpCategoryListLazyQuery>;
export type HelpCategoryListQueryResult = Apollo.QueryResult<HelpCategoryListQuery, HelpCategoryListQueryVariables>;
export const HelpCategorySelectDocument = gql`
    query helpCategorySelect($slug: String!) {
  helpCategory(slug: $slug) {
    id
    name
    description
    slug
    pic
    createdAt
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
    categoryHelps {
      count
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
        }
      }
    }
  }
}
    `;

/**
 * __useHelpCategorySelectQuery__
 *
 * To run a query within a React component, call `useHelpCategorySelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelpCategorySelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelpCategorySelectQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useHelpCategorySelectQuery(baseOptions: Apollo.QueryHookOptions<HelpCategorySelectQuery, HelpCategorySelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelpCategorySelectQuery, HelpCategorySelectQueryVariables>(HelpCategorySelectDocument, options);
      }
export function useHelpCategorySelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelpCategorySelectQuery, HelpCategorySelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelpCategorySelectQuery, HelpCategorySelectQueryVariables>(HelpCategorySelectDocument, options);
        }
export type HelpCategorySelectQueryHookResult = ReturnType<typeof useHelpCategorySelectQuery>;
export type HelpCategorySelectLazyQueryHookResult = ReturnType<typeof useHelpCategorySelectLazyQuery>;
export type HelpCategorySelectQueryResult = Apollo.QueryResult<HelpCategorySelectQuery, HelpCategorySelectQueryVariables>;
export const HelpCategoryCreateDocument = gql`
    mutation helpCategoryCreate($name: String, $description: String, $pic: String) {
  helpCategoryCreate(input: {name: $name, description: $description, pic: $pic}) {
    category {
      id
    }
  }
}
    `;
export type HelpCategoryCreateMutationFn = Apollo.MutationFunction<HelpCategoryCreateMutation, HelpCategoryCreateMutationVariables>;

/**
 * __useHelpCategoryCreateMutation__
 *
 * To run a mutation, you first call `useHelpCategoryCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpCategoryCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpCategoryCreateMutation, { data, loading, error }] = useHelpCategoryCreateMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      pic: // value for 'pic'
 *   },
 * });
 */
export function useHelpCategoryCreateMutation(baseOptions?: Apollo.MutationHookOptions<HelpCategoryCreateMutation, HelpCategoryCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpCategoryCreateMutation, HelpCategoryCreateMutationVariables>(HelpCategoryCreateDocument, options);
      }
export type HelpCategoryCreateMutationHookResult = ReturnType<typeof useHelpCategoryCreateMutation>;
export type HelpCategoryCreateMutationResult = Apollo.MutationResult<HelpCategoryCreateMutation>;
export type HelpCategoryCreateMutationOptions = Apollo.BaseMutationOptions<HelpCategoryCreateMutation, HelpCategoryCreateMutationVariables>;
export const HelpCategoryUpdateDocument = gql`
    mutation helpCategoryUpdate($id: ID, $name: String, $description: String, $pic: String) {
  helpCategoryUpdate(
    input: {id: $id, name: $name, description: $description, pic: $pic}
  ) {
    category {
      id
    }
  }
}
    `;
export type HelpCategoryUpdateMutationFn = Apollo.MutationFunction<HelpCategoryUpdateMutation, HelpCategoryUpdateMutationVariables>;

/**
 * __useHelpCategoryUpdateMutation__
 *
 * To run a mutation, you first call `useHelpCategoryUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpCategoryUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpCategoryUpdateMutation, { data, loading, error }] = useHelpCategoryUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      pic: // value for 'pic'
 *   },
 * });
 */
export function useHelpCategoryUpdateMutation(baseOptions?: Apollo.MutationHookOptions<HelpCategoryUpdateMutation, HelpCategoryUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpCategoryUpdateMutation, HelpCategoryUpdateMutationVariables>(HelpCategoryUpdateDocument, options);
      }
export type HelpCategoryUpdateMutationHookResult = ReturnType<typeof useHelpCategoryUpdateMutation>;
export type HelpCategoryUpdateMutationResult = Apollo.MutationResult<HelpCategoryUpdateMutation>;
export type HelpCategoryUpdateMutationOptions = Apollo.BaseMutationOptions<HelpCategoryUpdateMutation, HelpCategoryUpdateMutationVariables>;
export const HelpCategoryDeleteDocument = gql`
    mutation helpCategoryDelete($id: ID!, $isDeleted: Boolean) {
  helpCategoryDelete(input: {id: $id, isDeleted: $isDeleted}) {
    category {
      id
    }
  }
}
    `;
export type HelpCategoryDeleteMutationFn = Apollo.MutationFunction<HelpCategoryDeleteMutation, HelpCategoryDeleteMutationVariables>;

/**
 * __useHelpCategoryDeleteMutation__
 *
 * To run a mutation, you first call `useHelpCategoryDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpCategoryDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpCategoryDeleteMutation, { data, loading, error }] = useHelpCategoryDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useHelpCategoryDeleteMutation(baseOptions?: Apollo.MutationHookOptions<HelpCategoryDeleteMutation, HelpCategoryDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpCategoryDeleteMutation, HelpCategoryDeleteMutationVariables>(HelpCategoryDeleteDocument, options);
      }
export type HelpCategoryDeleteMutationHookResult = ReturnType<typeof useHelpCategoryDeleteMutation>;
export type HelpCategoryDeleteMutationResult = Apollo.MutationResult<HelpCategoryDeleteMutation>;
export type HelpCategoryDeleteMutationOptions = Apollo.BaseMutationOptions<HelpCategoryDeleteMutation, HelpCategoryDeleteMutationVariables>;
export const HelpCategoryRemoveDocument = gql`
    mutation helpCategoryRemove($id: ID!) {
  helpCategoryRemove(input: {id: $id}) {
    category {
      id
    }
  }
}
    `;
export type HelpCategoryRemoveMutationFn = Apollo.MutationFunction<HelpCategoryRemoveMutation, HelpCategoryRemoveMutationVariables>;

/**
 * __useHelpCategoryRemoveMutation__
 *
 * To run a mutation, you first call `useHelpCategoryRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpCategoryRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpCategoryRemoveMutation, { data, loading, error }] = useHelpCategoryRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHelpCategoryRemoveMutation(baseOptions?: Apollo.MutationHookOptions<HelpCategoryRemoveMutation, HelpCategoryRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpCategoryRemoveMutation, HelpCategoryRemoveMutationVariables>(HelpCategoryRemoveDocument, options);
      }
export type HelpCategoryRemoveMutationHookResult = ReturnType<typeof useHelpCategoryRemoveMutation>;
export type HelpCategoryRemoveMutationResult = Apollo.MutationResult<HelpCategoryRemoveMutation>;
export type HelpCategoryRemoveMutationOptions = Apollo.BaseMutationOptions<HelpCategoryRemoveMutation, HelpCategoryRemoveMutationVariables>;
export const HelpListDocument = gql`
    query helpList($search: String, $categoryId: ID, $isDeleted: Boolean, $first: Int, $last: Int, $after: String, $before: String) {
  helps(
    search: $search
    categoryId: $categoryId
    isDeleted: $isDeleted
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        title
        content
        pic
        category {
          id
          name
        }
        createdAt
        isModified
        modifiedAt
        deletedAt
        restoredAt
        isDeleted
      }
    }
  }
}
    `;

/**
 * __useHelpListQuery__
 *
 * To run a query within a React component, call `useHelpListQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelpListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelpListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      categoryId: // value for 'categoryId'
 *      isDeleted: // value for 'isDeleted'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useHelpListQuery(baseOptions?: Apollo.QueryHookOptions<HelpListQuery, HelpListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelpListQuery, HelpListQueryVariables>(HelpListDocument, options);
      }
export function useHelpListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelpListQuery, HelpListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelpListQuery, HelpListQueryVariables>(HelpListDocument, options);
        }
export type HelpListQueryHookResult = ReturnType<typeof useHelpListQuery>;
export type HelpListLazyQueryHookResult = ReturnType<typeof useHelpListLazyQuery>;
export type HelpListQueryResult = Apollo.QueryResult<HelpListQuery, HelpListQueryVariables>;
export const HelpSelectDocument = gql`
    query helpSelect($id: ID!) {
  help(id: $id) {
    id
    title
    content
    pic
    category {
      id
      name
    }
    createdAt
    isModified
    modifiedAt
    deletedAt
    restoredAt
    isDeleted
  }
}
    `;

/**
 * __useHelpSelectQuery__
 *
 * To run a query within a React component, call `useHelpSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelpSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelpSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHelpSelectQuery(baseOptions: Apollo.QueryHookOptions<HelpSelectQuery, HelpSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelpSelectQuery, HelpSelectQueryVariables>(HelpSelectDocument, options);
      }
export function useHelpSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelpSelectQuery, HelpSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelpSelectQuery, HelpSelectQueryVariables>(HelpSelectDocument, options);
        }
export type HelpSelectQueryHookResult = ReturnType<typeof useHelpSelectQuery>;
export type HelpSelectLazyQueryHookResult = ReturnType<typeof useHelpSelectLazyQuery>;
export type HelpSelectQueryResult = Apollo.QueryResult<HelpSelectQuery, HelpSelectQueryVariables>;
export const HelpCreateDocument = gql`
    mutation helpCreate($title: String, $content: String, $pic: String, $categoryId: ID) {
  helpCreate(
    input: {title: $title, content: $content, pic: $pic, categoryId: $categoryId}
  ) {
    help {
      id
    }
  }
}
    `;
export type HelpCreateMutationFn = Apollo.MutationFunction<HelpCreateMutation, HelpCreateMutationVariables>;

/**
 * __useHelpCreateMutation__
 *
 * To run a mutation, you first call `useHelpCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpCreateMutation, { data, loading, error }] = useHelpCreateMutation({
 *   variables: {
 *      title: // value for 'title'
 *      content: // value for 'content'
 *      pic: // value for 'pic'
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useHelpCreateMutation(baseOptions?: Apollo.MutationHookOptions<HelpCreateMutation, HelpCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpCreateMutation, HelpCreateMutationVariables>(HelpCreateDocument, options);
      }
export type HelpCreateMutationHookResult = ReturnType<typeof useHelpCreateMutation>;
export type HelpCreateMutationResult = Apollo.MutationResult<HelpCreateMutation>;
export type HelpCreateMutationOptions = Apollo.BaseMutationOptions<HelpCreateMutation, HelpCreateMutationVariables>;
export const HelpUpdateDocument = gql`
    mutation helpUpdate($id: ID, $title: String, $content: String, $pic: String, $categoryId: ID) {
  helpUpdate(
    input: {id: $id, title: $title, content: $content, pic: $pic, categoryId: $categoryId}
  ) {
    help {
      id
    }
  }
}
    `;
export type HelpUpdateMutationFn = Apollo.MutationFunction<HelpUpdateMutation, HelpUpdateMutationVariables>;

/**
 * __useHelpUpdateMutation__
 *
 * To run a mutation, you first call `useHelpUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpUpdateMutation, { data, loading, error }] = useHelpUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      content: // value for 'content'
 *      pic: // value for 'pic'
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useHelpUpdateMutation(baseOptions?: Apollo.MutationHookOptions<HelpUpdateMutation, HelpUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpUpdateMutation, HelpUpdateMutationVariables>(HelpUpdateDocument, options);
      }
export type HelpUpdateMutationHookResult = ReturnType<typeof useHelpUpdateMutation>;
export type HelpUpdateMutationResult = Apollo.MutationResult<HelpUpdateMutation>;
export type HelpUpdateMutationOptions = Apollo.BaseMutationOptions<HelpUpdateMutation, HelpUpdateMutationVariables>;
export const HelpDeleteDocument = gql`
    mutation helpDelete($id: ID!, $isDeleted: Boolean) {
  helpDelete(input: {id: $id, isDeleted: $isDeleted}) {
    help {
      id
    }
  }
}
    `;
export type HelpDeleteMutationFn = Apollo.MutationFunction<HelpDeleteMutation, HelpDeleteMutationVariables>;

/**
 * __useHelpDeleteMutation__
 *
 * To run a mutation, you first call `useHelpDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpDeleteMutation, { data, loading, error }] = useHelpDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useHelpDeleteMutation(baseOptions?: Apollo.MutationHookOptions<HelpDeleteMutation, HelpDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpDeleteMutation, HelpDeleteMutationVariables>(HelpDeleteDocument, options);
      }
export type HelpDeleteMutationHookResult = ReturnType<typeof useHelpDeleteMutation>;
export type HelpDeleteMutationResult = Apollo.MutationResult<HelpDeleteMutation>;
export type HelpDeleteMutationOptions = Apollo.BaseMutationOptions<HelpDeleteMutation, HelpDeleteMutationVariables>;
export const HelpRemoveDocument = gql`
    mutation helpRemove($id: ID!) {
  helpRemove(input: {id: $id}) {
    help {
      id
    }
  }
}
    `;
export type HelpRemoveMutationFn = Apollo.MutationFunction<HelpRemoveMutation, HelpRemoveMutationVariables>;

/**
 * __useHelpRemoveMutation__
 *
 * To run a mutation, you first call `useHelpRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHelpRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [helpRemoveMutation, { data, loading, error }] = useHelpRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHelpRemoveMutation(baseOptions?: Apollo.MutationHookOptions<HelpRemoveMutation, HelpRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HelpRemoveMutation, HelpRemoveMutationVariables>(HelpRemoveDocument, options);
      }
export type HelpRemoveMutationHookResult = ReturnType<typeof useHelpRemoveMutation>;
export type HelpRemoveMutationResult = Apollo.MutationResult<HelpRemoveMutation>;
export type HelpRemoveMutationOptions = Apollo.BaseMutationOptions<HelpRemoveMutation, HelpRemoveMutationVariables>;
export const ReviewListDocument = gql`
    query reviewList($itemId: String, $itemType: String, $userId: ID, $isDeleted: Boolean, $first: Int, $last: Int, $after: String, $before: String) {
  reviews(
    itemId: $itemId
    itemType: $itemType
    userId: $userId
    isDeleted: $isDeleted
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        content
        rating
        user {
          id
          username
        }
        itemId
        itemType
        createdAt
        isModified
        modifiedAt
        isDeleted
        deletedAt
        restoredAt
      }
    }
  }
}
    `;

/**
 * __useReviewListQuery__
 *
 * To run a query within a React component, call `useReviewListQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewListQuery({
 *   variables: {
 *      itemId: // value for 'itemId'
 *      itemType: // value for 'itemType'
 *      userId: // value for 'userId'
 *      isDeleted: // value for 'isDeleted'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useReviewListQuery(baseOptions?: Apollo.QueryHookOptions<ReviewListQuery, ReviewListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewListQuery, ReviewListQueryVariables>(ReviewListDocument, options);
      }
export function useReviewListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewListQuery, ReviewListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewListQuery, ReviewListQueryVariables>(ReviewListDocument, options);
        }
export type ReviewListQueryHookResult = ReturnType<typeof useReviewListQuery>;
export type ReviewListLazyQueryHookResult = ReturnType<typeof useReviewListLazyQuery>;
export type ReviewListQueryResult = Apollo.QueryResult<ReviewListQuery, ReviewListQueryVariables>;
export const ReviewSelectDocument = gql`
    query reviewSelect($id: ID!) {
  review(id: $id) {
    id
    content
    rating
    user {
      id
      username
    }
    itemId
    itemType
    createdAt
    isModified
    modifiedAt
    isDeleted
    deletedAt
    restoredAt
  }
}
    `;

/**
 * __useReviewSelectQuery__
 *
 * To run a query within a React component, call `useReviewSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReviewSelectQuery(baseOptions: Apollo.QueryHookOptions<ReviewSelectQuery, ReviewSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewSelectQuery, ReviewSelectQueryVariables>(ReviewSelectDocument, options);
      }
export function useReviewSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewSelectQuery, ReviewSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewSelectQuery, ReviewSelectQueryVariables>(ReviewSelectDocument, options);
        }
export type ReviewSelectQueryHookResult = ReturnType<typeof useReviewSelectQuery>;
export type ReviewSelectLazyQueryHookResult = ReturnType<typeof useReviewSelectLazyQuery>;
export type ReviewSelectQueryResult = Apollo.QueryResult<ReviewSelectQuery, ReviewSelectQueryVariables>;
export const ReviewCreateDocument = gql`
    mutation reviewCreate($content: String, $rating: Float, $itemId: String, $itemType: String) {
  reviewCreate(
    input: {content: $content, rating: $rating, itemId: $itemId, itemType: $itemType}
  ) {
    review {
      id
    }
  }
}
    `;
export type ReviewCreateMutationFn = Apollo.MutationFunction<ReviewCreateMutation, ReviewCreateMutationVariables>;

/**
 * __useReviewCreateMutation__
 *
 * To run a mutation, you first call `useReviewCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReviewCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reviewCreateMutation, { data, loading, error }] = useReviewCreateMutation({
 *   variables: {
 *      content: // value for 'content'
 *      rating: // value for 'rating'
 *      itemId: // value for 'itemId'
 *      itemType: // value for 'itemType'
 *   },
 * });
 */
export function useReviewCreateMutation(baseOptions?: Apollo.MutationHookOptions<ReviewCreateMutation, ReviewCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReviewCreateMutation, ReviewCreateMutationVariables>(ReviewCreateDocument, options);
      }
export type ReviewCreateMutationHookResult = ReturnType<typeof useReviewCreateMutation>;
export type ReviewCreateMutationResult = Apollo.MutationResult<ReviewCreateMutation>;
export type ReviewCreateMutationOptions = Apollo.BaseMutationOptions<ReviewCreateMutation, ReviewCreateMutationVariables>;
export const ReviewDeleteDocument = gql`
    mutation reviewDelete($id: ID!, $isDeleted: Boolean) {
  reviewDelete(input: {id: $id, isDeleted: $isDeleted}) {
    clientMutationId
    review {
      id
    }
  }
}
    `;
export type ReviewDeleteMutationFn = Apollo.MutationFunction<ReviewDeleteMutation, ReviewDeleteMutationVariables>;

/**
 * __useReviewDeleteMutation__
 *
 * To run a mutation, you first call `useReviewDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReviewDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reviewDeleteMutation, { data, loading, error }] = useReviewDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useReviewDeleteMutation(baseOptions?: Apollo.MutationHookOptions<ReviewDeleteMutation, ReviewDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReviewDeleteMutation, ReviewDeleteMutationVariables>(ReviewDeleteDocument, options);
      }
export type ReviewDeleteMutationHookResult = ReturnType<typeof useReviewDeleteMutation>;
export type ReviewDeleteMutationResult = Apollo.MutationResult<ReviewDeleteMutation>;
export type ReviewDeleteMutationOptions = Apollo.BaseMutationOptions<ReviewDeleteMutation, ReviewDeleteMutationVariables>;
export const ReviewRemoveDocument = gql`
    mutation reviewRemove($id: ID) {
  reviewRemove(input: {id: $id}) {
    review {
      id
    }
  }
}
    `;
export type ReviewRemoveMutationFn = Apollo.MutationFunction<ReviewRemoveMutation, ReviewRemoveMutationVariables>;

/**
 * __useReviewRemoveMutation__
 *
 * To run a mutation, you first call `useReviewRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReviewRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reviewRemoveMutation, { data, loading, error }] = useReviewRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReviewRemoveMutation(baseOptions?: Apollo.MutationHookOptions<ReviewRemoveMutation, ReviewRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReviewRemoveMutation, ReviewRemoveMutationVariables>(ReviewRemoveDocument, options);
      }
export type ReviewRemoveMutationHookResult = ReturnType<typeof useReviewRemoveMutation>;
export type ReviewRemoveMutationResult = Apollo.MutationResult<ReviewRemoveMutation>;
export type ReviewRemoveMutationOptions = Apollo.BaseMutationOptions<ReviewRemoveMutation, ReviewRemoveMutationVariables>;
export const StockListDocument = gql`
    query stockList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  stocks(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        symbol
        name
        description
        exchange
        createdAt
      }
    }
  }
}
    `;

/**
 * __useStockListQuery__
 *
 * To run a query within a React component, call `useStockListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useStockListQuery(baseOptions?: Apollo.QueryHookOptions<StockListQuery, StockListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StockListQuery, StockListQueryVariables>(StockListDocument, options);
      }
export function useStockListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockListQuery, StockListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StockListQuery, StockListQueryVariables>(StockListDocument, options);
        }
export type StockListQueryHookResult = ReturnType<typeof useStockListQuery>;
export type StockListLazyQueryHookResult = ReturnType<typeof useStockListLazyQuery>;
export type StockListQueryResult = Apollo.QueryResult<StockListQuery, StockListQueryVariables>;
export const StockSelectDocument = gql`
    query stockSelect($id: ID!) {
  stock(id: $id) {
    id
    symbol
    name
    description
    exchange
    createdAt
  }
}
    `;

/**
 * __useStockSelectQuery__
 *
 * To run a query within a React component, call `useStockSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStockSelectQuery(baseOptions: Apollo.QueryHookOptions<StockSelectQuery, StockSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StockSelectQuery, StockSelectQueryVariables>(StockSelectDocument, options);
      }
export function useStockSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockSelectQuery, StockSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StockSelectQuery, StockSelectQueryVariables>(StockSelectDocument, options);
        }
export type StockSelectQueryHookResult = ReturnType<typeof useStockSelectQuery>;
export type StockSelectLazyQueryHookResult = ReturnType<typeof useStockSelectLazyQuery>;
export type StockSelectQueryResult = Apollo.QueryResult<StockSelectQuery, StockSelectQueryVariables>;
export const StockCreateDocument = gql`
    mutation stockCreate($symbol: String, $name: String, $description: String, $exchange: String) {
  stockCreate(
    input: {symbol: $symbol, name: $name, description: $description, exchange: $exchange}
  ) {
    stock {
      id
    }
  }
}
    `;
export type StockCreateMutationFn = Apollo.MutationFunction<StockCreateMutation, StockCreateMutationVariables>;

/**
 * __useStockCreateMutation__
 *
 * To run a mutation, you first call `useStockCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStockCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stockCreateMutation, { data, loading, error }] = useStockCreateMutation({
 *   variables: {
 *      symbol: // value for 'symbol'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      exchange: // value for 'exchange'
 *   },
 * });
 */
export function useStockCreateMutation(baseOptions?: Apollo.MutationHookOptions<StockCreateMutation, StockCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StockCreateMutation, StockCreateMutationVariables>(StockCreateDocument, options);
      }
export type StockCreateMutationHookResult = ReturnType<typeof useStockCreateMutation>;
export type StockCreateMutationResult = Apollo.MutationResult<StockCreateMutation>;
export type StockCreateMutationOptions = Apollo.BaseMutationOptions<StockCreateMutation, StockCreateMutationVariables>;
export const StockUpdateDocument = gql`
    mutation stockUpdate($id: ID!, $symbol: String, $name: String, $description: String, $exchange: String) {
  stockUpdate(
    input: {id: $id, symbol: $symbol, name: $name, description: $description, exchange: $exchange}
  ) {
    stock {
      id
    }
  }
}
    `;
export type StockUpdateMutationFn = Apollo.MutationFunction<StockUpdateMutation, StockUpdateMutationVariables>;

/**
 * __useStockUpdateMutation__
 *
 * To run a mutation, you first call `useStockUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStockUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stockUpdateMutation, { data, loading, error }] = useStockUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      symbol: // value for 'symbol'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      exchange: // value for 'exchange'
 *   },
 * });
 */
export function useStockUpdateMutation(baseOptions?: Apollo.MutationHookOptions<StockUpdateMutation, StockUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StockUpdateMutation, StockUpdateMutationVariables>(StockUpdateDocument, options);
      }
export type StockUpdateMutationHookResult = ReturnType<typeof useStockUpdateMutation>;
export type StockUpdateMutationResult = Apollo.MutationResult<StockUpdateMutation>;
export type StockUpdateMutationOptions = Apollo.BaseMutationOptions<StockUpdateMutation, StockUpdateMutationVariables>;
export const StockDeleteDocument = gql`
    mutation stockDelete($id: ID!, $isDeleted: Boolean) {
  stockDelete(input: {id: $id, isDeleted: false}) {
    stock {
      id
    }
  }
}
    `;
export type StockDeleteMutationFn = Apollo.MutationFunction<StockDeleteMutation, StockDeleteMutationVariables>;

/**
 * __useStockDeleteMutation__
 *
 * To run a mutation, you first call `useStockDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStockDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stockDeleteMutation, { data, loading, error }] = useStockDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDeleted: // value for 'isDeleted'
 *   },
 * });
 */
export function useStockDeleteMutation(baseOptions?: Apollo.MutationHookOptions<StockDeleteMutation, StockDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StockDeleteMutation, StockDeleteMutationVariables>(StockDeleteDocument, options);
      }
export type StockDeleteMutationHookResult = ReturnType<typeof useStockDeleteMutation>;
export type StockDeleteMutationResult = Apollo.MutationResult<StockDeleteMutation>;
export type StockDeleteMutationOptions = Apollo.BaseMutationOptions<StockDeleteMutation, StockDeleteMutationVariables>;
export const StockRemoveDocument = gql`
    mutation stockRemove($id: ID!) {
  stockRemove(input: {id: $id}) {
    stock {
      id
    }
  }
}
    `;
export type StockRemoveMutationFn = Apollo.MutationFunction<StockRemoveMutation, StockRemoveMutationVariables>;

/**
 * __useStockRemoveMutation__
 *
 * To run a mutation, you first call `useStockRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStockRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stockRemoveMutation, { data, loading, error }] = useStockRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStockRemoveMutation(baseOptions?: Apollo.MutationHookOptions<StockRemoveMutation, StockRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StockRemoveMutation, StockRemoveMutationVariables>(StockRemoveDocument, options);
      }
export type StockRemoveMutationHookResult = ReturnType<typeof useStockRemoveMutation>;
export type StockRemoveMutationResult = Apollo.MutationResult<StockRemoveMutation>;
export type StockRemoveMutationOptions = Apollo.BaseMutationOptions<StockRemoveMutation, StockRemoveMutationVariables>;
export const StockpriceListDocument = gql`
    query stockpriceList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  stockprices(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        open
        high
        low
        close
        volume
        createdAt
        stock {
          id
          symbol
          name
        }
      }
    }
  }
}
    `;

/**
 * __useStockpriceListQuery__
 *
 * To run a query within a React component, call `useStockpriceListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockpriceListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockpriceListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useStockpriceListQuery(baseOptions?: Apollo.QueryHookOptions<StockpriceListQuery, StockpriceListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StockpriceListQuery, StockpriceListQueryVariables>(StockpriceListDocument, options);
      }
export function useStockpriceListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockpriceListQuery, StockpriceListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StockpriceListQuery, StockpriceListQueryVariables>(StockpriceListDocument, options);
        }
export type StockpriceListQueryHookResult = ReturnType<typeof useStockpriceListQuery>;
export type StockpriceListLazyQueryHookResult = ReturnType<typeof useStockpriceListLazyQuery>;
export type StockpriceListQueryResult = Apollo.QueryResult<StockpriceListQuery, StockpriceListQueryVariables>;
export const StockpriceSelectDocument = gql`
    query stockpriceSelect($id: ID!) {
  stockprice(id: $id) {
    id
    open
    high
    low
    close
    volume
    createdAt
    stock {
      id
      symbol
      name
    }
  }
}
    `;

/**
 * __useStockpriceSelectQuery__
 *
 * To run a query within a React component, call `useStockpriceSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockpriceSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockpriceSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStockpriceSelectQuery(baseOptions: Apollo.QueryHookOptions<StockpriceSelectQuery, StockpriceSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StockpriceSelectQuery, StockpriceSelectQueryVariables>(StockpriceSelectDocument, options);
      }
export function useStockpriceSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockpriceSelectQuery, StockpriceSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StockpriceSelectQuery, StockpriceSelectQueryVariables>(StockpriceSelectDocument, options);
        }
export type StockpriceSelectQueryHookResult = ReturnType<typeof useStockpriceSelectQuery>;
export type StockpriceSelectLazyQueryHookResult = ReturnType<typeof useStockpriceSelectLazyQuery>;
export type StockpriceSelectQueryResult = Apollo.QueryResult<StockpriceSelectQuery, StockpriceSelectQueryVariables>;
export const StockpriceCreateDocument = gql`
    mutation stockpriceCreate($open: Float, $high: Float, $low: Float, $close: Float, $volume: Float, $stockId: ID!) {
  stockpriceCreate(
    input: {open: $open, high: $high, low: $low, close: $close, volume: $volume, stockId: $stockId}
  ) {
    stockprice {
      id
    }
  }
}
    `;
export type StockpriceCreateMutationFn = Apollo.MutationFunction<StockpriceCreateMutation, StockpriceCreateMutationVariables>;

/**
 * __useStockpriceCreateMutation__
 *
 * To run a mutation, you first call `useStockpriceCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStockpriceCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stockpriceCreateMutation, { data, loading, error }] = useStockpriceCreateMutation({
 *   variables: {
 *      open: // value for 'open'
 *      high: // value for 'high'
 *      low: // value for 'low'
 *      close: // value for 'close'
 *      volume: // value for 'volume'
 *      stockId: // value for 'stockId'
 *   },
 * });
 */
export function useStockpriceCreateMutation(baseOptions?: Apollo.MutationHookOptions<StockpriceCreateMutation, StockpriceCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StockpriceCreateMutation, StockpriceCreateMutationVariables>(StockpriceCreateDocument, options);
      }
export type StockpriceCreateMutationHookResult = ReturnType<typeof useStockpriceCreateMutation>;
export type StockpriceCreateMutationResult = Apollo.MutationResult<StockpriceCreateMutation>;
export type StockpriceCreateMutationOptions = Apollo.BaseMutationOptions<StockpriceCreateMutation, StockpriceCreateMutationVariables>;
export const PortfolioAddDocument = gql`
    mutation portfolioAdd($stockids: String!) {
  portfolioAdd(stockids: $stockids) {
    user {
      id
    }
  }
}
    `;
export type PortfolioAddMutationFn = Apollo.MutationFunction<PortfolioAddMutation, PortfolioAddMutationVariables>;

/**
 * __usePortfolioAddMutation__
 *
 * To run a mutation, you first call `usePortfolioAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePortfolioAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [portfolioAddMutation, { data, loading, error }] = usePortfolioAddMutation({
 *   variables: {
 *      stockids: // value for 'stockids'
 *   },
 * });
 */
export function usePortfolioAddMutation(baseOptions?: Apollo.MutationHookOptions<PortfolioAddMutation, PortfolioAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PortfolioAddMutation, PortfolioAddMutationVariables>(PortfolioAddDocument, options);
      }
export type PortfolioAddMutationHookResult = ReturnType<typeof usePortfolioAddMutation>;
export type PortfolioAddMutationResult = Apollo.MutationResult<PortfolioAddMutation>;
export type PortfolioAddMutationOptions = Apollo.BaseMutationOptions<PortfolioAddMutation, PortfolioAddMutationVariables>;
export const PortfolioRemoveDocument = gql`
    mutation portfolioRemove($stockId: ID!) {
  portfolioRemove(input: {stockId: $stockId}) {
    user {
      id
    }
  }
}
    `;
export type PortfolioRemoveMutationFn = Apollo.MutationFunction<PortfolioRemoveMutation, PortfolioRemoveMutationVariables>;

/**
 * __usePortfolioRemoveMutation__
 *
 * To run a mutation, you first call `usePortfolioRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePortfolioRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [portfolioRemoveMutation, { data, loading, error }] = usePortfolioRemoveMutation({
 *   variables: {
 *      stockId: // value for 'stockId'
 *   },
 * });
 */
export function usePortfolioRemoveMutation(baseOptions?: Apollo.MutationHookOptions<PortfolioRemoveMutation, PortfolioRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PortfolioRemoveMutation, PortfolioRemoveMutationVariables>(PortfolioRemoveDocument, options);
      }
export type PortfolioRemoveMutationHookResult = ReturnType<typeof usePortfolioRemoveMutation>;
export type PortfolioRemoveMutationResult = Apollo.MutationResult<PortfolioRemoveMutation>;
export type PortfolioRemoveMutationOptions = Apollo.BaseMutationOptions<PortfolioRemoveMutation, PortfolioRemoveMutationVariables>;
export const StrategyListDocument = gql`
    query strategyList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  strategies(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        performOrder
        priority
        createdAt
      }
    }
  }
}
    `;

/**
 * __useStrategyListQuery__
 *
 * To run a query within a React component, call `useStrategyListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStrategyListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStrategyListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useStrategyListQuery(baseOptions?: Apollo.QueryHookOptions<StrategyListQuery, StrategyListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StrategyListQuery, StrategyListQueryVariables>(StrategyListDocument, options);
      }
export function useStrategyListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StrategyListQuery, StrategyListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StrategyListQuery, StrategyListQueryVariables>(StrategyListDocument, options);
        }
export type StrategyListQueryHookResult = ReturnType<typeof useStrategyListQuery>;
export type StrategyListLazyQueryHookResult = ReturnType<typeof useStrategyListLazyQuery>;
export type StrategyListQueryResult = Apollo.QueryResult<StrategyListQuery, StrategyListQueryVariables>;
export const StrategySelectDocument = gql`
    query strategySelect($id: ID!) {
  strategy(id: $id) {
    id
    name
    performOrder
    priority
    createdAt
  }
}
    `;

/**
 * __useStrategySelectQuery__
 *
 * To run a query within a React component, call `useStrategySelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useStrategySelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStrategySelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStrategySelectQuery(baseOptions: Apollo.QueryHookOptions<StrategySelectQuery, StrategySelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StrategySelectQuery, StrategySelectQueryVariables>(StrategySelectDocument, options);
      }
export function useStrategySelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StrategySelectQuery, StrategySelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StrategySelectQuery, StrategySelectQueryVariables>(StrategySelectDocument, options);
        }
export type StrategySelectQueryHookResult = ReturnType<typeof useStrategySelectQuery>;
export type StrategySelectLazyQueryHookResult = ReturnType<typeof useStrategySelectLazyQuery>;
export type StrategySelectQueryResult = Apollo.QueryResult<StrategySelectQuery, StrategySelectQueryVariables>;
export const StrategyCreateDocument = gql`
    mutation strategyCreate($name: String) {
  strategyCreate(input: {name: $name}) {
    strategy {
      id
    }
  }
}
    `;
export type StrategyCreateMutationFn = Apollo.MutationFunction<StrategyCreateMutation, StrategyCreateMutationVariables>;

/**
 * __useStrategyCreateMutation__
 *
 * To run a mutation, you first call `useStrategyCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStrategyCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [strategyCreateMutation, { data, loading, error }] = useStrategyCreateMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useStrategyCreateMutation(baseOptions?: Apollo.MutationHookOptions<StrategyCreateMutation, StrategyCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StrategyCreateMutation, StrategyCreateMutationVariables>(StrategyCreateDocument, options);
      }
export type StrategyCreateMutationHookResult = ReturnType<typeof useStrategyCreateMutation>;
export type StrategyCreateMutationResult = Apollo.MutationResult<StrategyCreateMutation>;
export type StrategyCreateMutationOptions = Apollo.BaseMutationOptions<StrategyCreateMutation, StrategyCreateMutationVariables>;
export const OrderListDocument = gql`
    query orderList($search: String, $first: Int, $last: Int, $after: String, $before: String) {
  orders(
    search: $search
    first: $first
    last: $last
    after: $after
    before: $before
  ) {
    count
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        quantity
        active
        short
        buyPrice
        buyTime
        sellPrice
        sellTime
        user {
          id
          username
        }
        strategy {
          id
          name
        }
        account {
          id
          balance
          user {
            id
            username
          }
        }
        createdAt
      }
    }
  }
}
    `;

/**
 * __useOrderListQuery__
 *
 * To run a query within a React component, call `useOrderListQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useOrderListQuery(baseOptions?: Apollo.QueryHookOptions<OrderListQuery, OrderListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderListQuery, OrderListQueryVariables>(OrderListDocument, options);
      }
export function useOrderListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderListQuery, OrderListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderListQuery, OrderListQueryVariables>(OrderListDocument, options);
        }
export type OrderListQueryHookResult = ReturnType<typeof useOrderListQuery>;
export type OrderListLazyQueryHookResult = ReturnType<typeof useOrderListLazyQuery>;
export type OrderListQueryResult = Apollo.QueryResult<OrderListQuery, OrderListQueryVariables>;
export const OrderSelectDocument = gql`
    query orderSelect($id: ID!) {
  order(id: $id) {
    id
    quantity
    active
    short
    buyPrice
    buyTime
    sellPrice
    sellTime
    user {
      id
      username
    }
    strategy {
      id
      name
    }
    account {
      id
      balance
    }
    createdAt
  }
}
    `;

/**
 * __useOrderSelectQuery__
 *
 * To run a query within a React component, call `useOrderSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderSelectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderSelectQuery(baseOptions: Apollo.QueryHookOptions<OrderSelectQuery, OrderSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderSelectQuery, OrderSelectQueryVariables>(OrderSelectDocument, options);
      }
export function useOrderSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderSelectQuery, OrderSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderSelectQuery, OrderSelectQueryVariables>(OrderSelectDocument, options);
        }
export type OrderSelectQueryHookResult = ReturnType<typeof useOrderSelectQuery>;
export type OrderSelectLazyQueryHookResult = ReturnType<typeof useOrderSelectLazyQuery>;
export type OrderSelectQueryResult = Apollo.QueryResult<OrderSelectQuery, OrderSelectQueryVariables>;
export const OrderCreateDocument = gql`
    mutation orderCreate($accountId: ID!, $strategyId: ID!, $stockId: ID!, $quantity: Float, $buyPrice: Float, $sellPrice: Float) {
  orderCreate(
    input: {accountId: $accountId, strategyId: $strategyId, stockId: $stockId, quantity: $quantity, buyPrice: $buyPrice, sellPrice: $sellPrice}
  ) {
    order {
      id
    }
  }
}
    `;
export type OrderCreateMutationFn = Apollo.MutationFunction<OrderCreateMutation, OrderCreateMutationVariables>;

/**
 * __useOrderCreateMutation__
 *
 * To run a mutation, you first call `useOrderCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderCreateMutation, { data, loading, error }] = useOrderCreateMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      strategyId: // value for 'strategyId'
 *      stockId: // value for 'stockId'
 *      quantity: // value for 'quantity'
 *      buyPrice: // value for 'buyPrice'
 *      sellPrice: // value for 'sellPrice'
 *   },
 * });
 */
export function useOrderCreateMutation(baseOptions?: Apollo.MutationHookOptions<OrderCreateMutation, OrderCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrderCreateMutation, OrderCreateMutationVariables>(OrderCreateDocument, options);
      }
export type OrderCreateMutationHookResult = ReturnType<typeof useOrderCreateMutation>;
export type OrderCreateMutationResult = Apollo.MutationResult<OrderCreateMutation>;
export type OrderCreateMutationOptions = Apollo.BaseMutationOptions<OrderCreateMutation, OrderCreateMutationVariables>;