/* eslint-disable */
import * as Types from '../types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';
export type ViewerFragment = { __typename: 'User', id: string, name: string, role: Types.UserRole };

export const ViewerFragment = gql`
    fragment ViewerFragment on User {
  id
  name
  role
}
    ` as unknown as DocumentNode<ViewerFragment, unknown>;