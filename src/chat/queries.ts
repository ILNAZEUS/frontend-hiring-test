import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query Messages(
    $first: Int
    $after: MessagesCursor
    $last: Int
    $before: MessagesCursor
  ) {
    messages(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          text
          status
          updatedAt
          sender
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      id
      text
      status
      updatedAt
      sender
    }
  }
`;

export const MESSAGE_UPDATED = gql`
  subscription {
    messageUpdated {
      id
      text
      status
      updatedAt
      sender
    }
  }
`;
