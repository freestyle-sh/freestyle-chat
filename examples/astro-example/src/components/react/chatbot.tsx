import { Chat } from "./chat";
import { useCloud } from "freestyle-sh";
import type { ChatbotCS, CustomMessageCS } from "../../cloudstate/chatbot";
import type { TextMessageCS } from "../../../../../src/chat";

export function Chatbot() {
  const chatbot = useCloud<typeof ChatbotCS>("chatbot");

  return (
    <Chat<[TextMessageCS, CustomMessageCS], ChatbotCS>
      chatbot={chatbot}
      displayMessage={(message) => {
        if (message.data.type === "TEXT_MESSAGE") {
          return (
            <div
              style={{
                backgroundColor: message.isSelf ? "#2563eb" : "#e5e5e5",
                padding: "0.5rem",
                borderRadius: "2rem",
                paddingRight: "1rem",
                paddingLeft: "1rem",
                fontFamily: "sans-serif",
                marginLeft: message.isSelf ? "2rem" : "0rem",
                marginRight: message.isSelf ? "0rem" : "2rem",
                display: "inline",
              }}
            >
              {message.data.text}
            </div>
          );
        } else {
          return <div>unknown message type</div>;
        }
      }}
    />
  );
}
