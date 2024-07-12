import { Chat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import type { ChatbotCS } from "../../cloudstate/chatbot";

export function Chatbot() {
  const chatbot = useCloud<typeof ChatbotCS>("chatbot");
  return (
    <Chat
      chatbot={chatbot}
      displayMessage={(message) => {
        if (message.data.type === "TEXT_MESSAGE") {
          return <div>{message.data.text}</div>;
        } else {
          return <div>unknown message type</div>;
        }
      }}
    />
  );
}
