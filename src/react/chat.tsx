import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { MessageListCS } from "../chat";
import * as React from "react";

export function Chat(props: {
  chatbot: ReturnType<typeof useCloud<typeof MessageListCS>>;
}) {
  const { data: messages } = useCloudQuery(props.chatbot.getMessages);

  return (
    <div>
      <div>
        {messages.map((message) => {
          if (message.data.type === "TEXT_MESSAGE") {
            message.data.text;
          }
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.target.elements.text.value;
          props.chatbot.sendTextMessage({ text });
        }}
      >
        <input type="text" placeholder="Type a message" />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
