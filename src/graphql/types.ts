/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename: 'Mutation';
  activateUser: Maybe<ActivateUserPayload>;
  suspendUser: Maybe<SuspendUserPayload>;
};


export type MutationActivateUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationSuspendUserArgs = {
  userId: Scalars['ID']['input'];
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['String']['output'];
  hasPreviousPage: Scalars['String']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename: 'Query';
  users: UserConnection;
  viewer: User;
};


export type QueryUsersArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  suspendedAt: Maybe<Scalars['String']['output']>;
};

export type UserConnection = {
  __typename: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC'
}

export type ActivateUserPayload = {
  __typename: 'activateUserPayload';
  user: Maybe<User>;
};

export type SuspendUserPayload = {
  __typename: 'suspendUserPayload';
  user: Maybe<User>;
};

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { viewer: { __typename: 'User', id: string, name: string, role: UserRole } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { viewer: { __typename: 'User', id: string }, users: { __typename: 'UserConnection', edges: Array<{ __typename: 'UserEdge', node: { __typename: 'User', id: string, name: string, email: string, suspendedAt: string | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: string } } };

export type SuspendUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type SuspendUserMutation = { suspendUser: { __typename: 'suspendUserPayload', user: { __typename: 'User', id: string, suspendedAt: string | null } | null } | null };

export type ActivateUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type ActivateUserMutation = { activateUser: { __typename: 'activateUserPayload', user: { __typename: 'User', id: string, suspendedAt: string | null } | null } | null };
