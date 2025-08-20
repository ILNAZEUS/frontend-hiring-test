import React, { memo, useRef, useState } from "react";
import { ItemContent, Virtuoso } from "react-virtuoso";
import cn from "clsx";
import {
  MessageSender,
  type Message,
} from "../../../__generated__/resolvers-types";
import css from "../chat.module.css";
import { MessagesData, MessagesVars } from "../types";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES } from "../queries";

const Item: React.FC<Message> = memo(({ text, sender }) => (
  <div className={css.item}>
    <div
      className={cn(
        css.message,
        sender === MessageSender.Admin ? css.out : css.in
      )}
    >
      {text}
    </div>
  </div>
));

const getItem: ItemContent<Message, unknown> = (_, data) => <Item {...data} />;

const Scroller = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div {...props} ref={ref} />
));

export const List: React.FC = memo(() => {
  const { data, fetchMore, loading } = useQuery<MessagesData, MessagesVars>(
    GET_MESSAGES,
    {
      variables: { last: 10 },
      fetchPolicy: "cache-and-network",
    }
  );

  const [firstItemIndex, setFirstItemIndex] = useState(0);

  const firstLoad = useRef(true);

  const loadMore = async () => {
    if (!data?.messages?.pageInfo.hasPreviousPage) return;

    const { data: fm } = await fetchMore({
      variables: { last: 10, before: data.messages.pageInfo.startCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          messages: {
            ...prev.messages,
            edges: [...fetchMoreResult.messages.edges, ...prev.messages.edges],
            pageInfo: fetchMoreResult.messages.pageInfo,
          },
        };
      },
    });

    const added = fm?.messages?.edges.length ?? 0;
    if (added > 0) {
      setFirstItemIndex((v) => v - added);
    }
  };

  const messages = data?.messages?.edges.map((edge) => edge.node) || [];

  if (loading && !data) return <p className={css.loading}>Loading...</p>;

  return (
    <Virtuoso
      className={css.list}
      data={messages}
      itemContent={getItem}
      firstItemIndex={firstItemIndex}
      followOutput={"auto"}
      initialTopMostItemIndex={Math.max(0, messages.length - 1)}
      atTopThreshold={100}
      increaseViewportBy={{ top: 400, bottom: 0 }}
      computeItemKey={(index, item) => (item as Message).id}
      components={{
        Scroller,
      }}
      atTopStateChange={(atTop) => {
        if (firstLoad.current) {
          firstLoad.current = false;
          return;
        }
        if (atTop) loadMore();
      }}
    />
  );
});
