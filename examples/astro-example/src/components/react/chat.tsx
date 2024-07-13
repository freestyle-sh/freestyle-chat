import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { MessageCS, MessageListCS } from "../../../../../src/chat";

import * as React from "react";
export function Chat<
  MessageTypes extends MessageCS<any>[],
  T extends MessageListCS<MessageTypes>
>(props: {
  chatbot: ReturnType<typeof useCloud<typeof MessageListCS>>;
  displayMessage: (
    message: ReturnType<T["getMessages"]>[number],
    i: number,
    options: {
      lastMessage: ReturnType<T["getMessages"]>[number] | undefined;
      nextMessage: ReturnType<T["getMessages"]>[number] | undefined;
    }
  ) => React.JSX.Element;
  placeholder?: string;
}) {
  const { data: messages } = useCloudQuery(props.chatbot.getMessages);
  return (
    <div
      style={{
        height: "100%",
        minHeight: "12rem",
        position: "relative",
        justifyContent: "center",
        display: "flex",
        minWidth: "12rem",
        fontFamily: "sans-serif",
        fontSize: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "3rem",
          width: "100%",
        }}
      >
        {messages?.map((message, i) => {
          return props.displayMessage(message, i, {
            lastMessage: messages[i - 1],
            nextMessage: messages[i + 1],
          });
        })}
      </div>
      <form
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxWidth: "30rem",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(e.target);
          const text = e.target.elements.text.value;
          if (text.length > 0) {
            await props.chatbot.sendTextMessage({ text });
          }
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <textarea
            style={{
              width: "100%",
              padding: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              border: "#d4d4d4 solid 1px",
              borderRadius: "2rem",
              resize: "none",
              fontFamily: "sans-serif",
              fontSize: "0.85rem",
            }}
            rows={1}
            id="text"
            name="text"
            placeholder={props.placeholder ?? "Message"}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "calc(0.5rem - 2px)",
              top: "calc(0.25rem + 1px)",
              backgroundColor: "#d4d4d4",
              border: "none",
              borderRadius: "2rem",
              height: "1.5rem",
              width: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{
                transform: "scale(1.8)",
              }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
