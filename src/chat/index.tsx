import React from "react";
import css from "./chat.module.css";
import { SendMessage } from "./components/SendMessage";
import { List } from "./components/List";
import { useChatSubscriptions } from "./hooks/useChatSubscription";

export const Chat: React.FC = () => {
  useChatSubscriptions();

  return (
    <div className={css.root}>
      <div className={css.container}>
        <List />
      </div>
      <SendMessage />
    </div>
  );
};
