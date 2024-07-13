import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { MessageCS, MessageListCS } from "../../../../../src/chat";
import { useLayoutEffect, useRef, useState } from "react";

const MIN_TEXTAREA_HEIGHT = 31.5; /* - 19.5 */

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
  const { data: messages, mutate } = useCloudQuery(props.chatbot.getMessages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    textareaRef.current.style.height = "inherit";
    // Set height
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight /* - 19.5 */,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [value]);

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
          // paddingLeft: "1rem",
          // paddingRight: "1rem",
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
            value={value}
            onKeyPress={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                mutate([
                  ...messages,
                  {
                    id: crypto.randomUUID(),
                    sender: {
                      id: "",
                      displayName: "",
                    },
                    isSelf: true,
                    data: {
                      type: "TEXT_MESSAGE",
                      text: value,
                    },
                  },
                ]);
                const text = value;
                if (text.length > 0) {
                  setValue("");
                  await props.chatbot.sendTextMessage({ text });
                }
              }
              console.log(e.key);
            }}
            ref={textareaRef}
            style={{
              width: "100%",
              border: "#d4d4d4 solid 1px",
              borderRadius: "1rem",
              resize: "none",
              fontFamily: "sans-serif",
              fontSize: "0.85rem",
              paddingTop: "0.3rem",
              paddingBottom: "0.3rem",
              display: "block",
              boxSizing: "border-box",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }}
            rows={1}
            onChange={onChange}
            id="text"
            name="text"
            placeholder={props.placeholder ?? "Message"}
          />
          <button
            type="submit"
            className="bg-blue-600"
            style={{
              position: "absolute",
              right: "calc(0.25rem + 1px)",
              top: "0.25rem",
              border: "none",
              borderRadius: "2rem",
              height: "1.5rem",
              width: "1.5rem",
              display: value.length > 0 ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              // style={{
              //   transform: "scale(1.8)",
              // }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="white"
            >
              <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
