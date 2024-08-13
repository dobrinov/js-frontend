/* eslint-disable */
import * as Types from '../types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';
import { ViewerFragment } from './ViewerFragment.generated';
export type ViewerQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ViewerQuery = { viewer: { __typename: 'User', id: string, name: string, role: Types.UserRole } };


export const ViewerQuery = gql`
    query ViewerQuery {
  viewer {
    ...ViewerFragment
  }
}
    ${ViewerFragment}` as unknown as DocumentNode<ViewerQuery, ViewerQueryVariables>;