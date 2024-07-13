import { Chat } from "./chat";
import { useCloud } from "freestyle-sh";
import type { ChatbotCS, CustomMessageCS } from "../../cloudstate/chatbot";
import type { TextMessageCS } from "../../../../../src/chat";

export function Chatbot() {
  const chatbot = useCloud<typeof ChatbotCS>("chatbot");

  return (
    <Chat<[TextMessageCS, CustomMessageCS], ChatbotCS>
      chatbot={chatbot}
      displayMessage={(message, i, { lastMessage, nextMessage }) => {
        if (message.data.type === "TEXT_MESSAGE") {
          return (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: message.isSelf ? "flex-end" : "flex-start",
                paddingTop:
                  lastMessage?.isSelf === message.isSelf ? "1pt" : "0.5rem",
                maxWidth: "30rem",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  backgroundColor: message.isSelf ? "#2563eb" : "#e5e5e5",
                  padding: "0.5rem",
                  borderRadius: "1rem",
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  fontFamily: "sans-serif",
                  marginLeft: message.isSelf ? "2rem" : "0rem",
                  marginRight: message.isSelf ? "0rem" : "2rem",
                  display: "inline",
                  color: message.isSelf ? "white" : "black",
                }}
              >
                {message.data.text}
              </div>
              <svg
                style={{
                  position: "absolute",
                  right: message.isSelf ? 0 : undefined,
                  bottom: 0,
                  translate: message.isSelf ? "47%" : "-47%",
                  scale: message.isSelf ? "0.8" : "-0.8 0.8",
                  opacity: nextMessage?.isSelf === message.isSelf ? 0 : 1,
                }}
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.2073 15.5528C10.1051 17.2078 3.17494 12.4498 0.847656 9.86391L1.10624 2.10629C3.60592 2.62347 9.01901 3.08892 10.674 0.813354C10.4154 10.1225 17.3972 14.7771 19.2073 15.5528Z"
                  fill={message.isSelf ? "#2563eb" : "#e5e5e5"}
                />
              </svg>
            </div>
          );
        } else {
          return <div>unknown message type</div>;
        }
      }}
    />
  );
}
