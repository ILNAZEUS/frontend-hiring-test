import { useSubscription } from "@apollo/client";
import { MessageEdge } from "../../../__generated__/resolvers-types";
import { MESSAGE_ADDED, MESSAGE_UPDATED } from "../queries";

export const useChatSubscriptions = () => {
  useSubscription(MESSAGE_ADDED, {
    onData: ({ client, data }) => {
      const newMessage = data.data?.messageAdded;
      if (!newMessage) return;

      client.cache.modify({
        fields: {
          messages(existing) {
            const edges: MessageEdge[] = existing?.edges || [];
            if (edges.some((edge) => edge.node.id === newMessage.id)) {
              return existing;
            }

            return {
              ...existing,
              edges: [...edges, { node: newMessage, cursor: newMessage.id }],
            };
          },
        },
      });
    },
  });

  // Подписка на обновление сообщений
  useSubscription(MESSAGE_UPDATED, {
    onData: ({ client, data }) => {
      const updatedMessage = data.data?.messageUpdated;
      if (!updatedMessage) return;

      client.cache.modify({
        fields: {
          messages(existing) {
            const edges: MessageEdge[] = existing.edges.map(
              (edge: MessageEdge) =>
                edge.node.id === updatedMessage.id &&
                new Date(updatedMessage.updatedAt) >
                  new Date(edge.node.updatedAt)
                  ? { ...edge, node: updatedMessage }
                  : edge
            );

            return { ...existing, edges };
          },
        },
      });
    },
  });
};
