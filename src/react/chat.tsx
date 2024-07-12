import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { MessageListCS } from "../chat";
import * as React from "react";

export function Chat<T extends MessageListCS>(props: {
  chatbot: ReturnType<typeof useCloud<typeof MessageListCS>>;
  displayMessage: (
    message: ReturnType<T["getMessages"]>[number]
  ) => React.JSX.Element;
}) {
  const { data: messages } = useCloudQuery(props.chatbot.getMessages);

  return (
    <div>
      <div>
        {messages.map((message) => {
          return props.displayMessage(message);
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
