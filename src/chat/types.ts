import {
  type MessageEdge,
  type MessagePageInfo,
} from "../../__generated__/resolvers-types";

export interface MessagesData {
  messages: {
    edges: MessageEdge[];
    pageInfo: MessagePageInfo;
  };
}

export interface MessagesVars {
  first?: number;
  last?: number;
  after?: string | null;
}
