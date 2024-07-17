import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { MessageCS, MessageListCS } from "../chat";
import * as React from "react";

export function Chat<
  MessageTypes extends MessageCS<any>[],
  T extends MessageListCS<MessageTypes>
>(props: {
  chatbot: ReturnType<typeof useCloud<typeof MessageListCS>>;
  displayMessage: (
    message: ReturnType<T["getMessages"]>[number]
  ) => React.JSX.Element;
}) {
  const { data: messages } = useCloudQuery(props.chatbot.getMessages);
  return (
    <div>
      <div>
        {messages?.map((message) => {
          return props.displayMessage(message);
        })}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(e.target);
          const text = e.target.elements.text.value;
          await props.chatbot.sendTextMessage({ text });
        }}
      >
        <input type="text" id="text" name="text" placeholder="Type a message" />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
