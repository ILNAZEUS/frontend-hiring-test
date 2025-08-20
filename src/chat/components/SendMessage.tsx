import css from "../chat.module.css";
import { gql, useMutation } from "@apollo/client";
import { MessageSender } from "../../../__generated__/resolvers-types";
import { useState } from "react";

const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
      status
      updatedAt
      sender
    }
  }
`;

export const SendMessage = () => {
  const [text, setText] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    const payload = text;
    setText("");
    await sendMessage({
      variables: { text: payload },
      optimisticResponse: {
        sendMessage: {
          id: "temp-" + Date.now(),
          text,
          status: "Sending",
          updatedAt: new Date().toISOString(),
          sender: MessageSender.Admin,
          __typename: "Message",
        },
      },
    });
  };
  return (
    <div className={css.footer}>
      <input
        type="text"
        className={css.textInput}
        value={text}
        onChange={handleChange}
        placeholder="Message text"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
