import { Chat } from "./chat";
import { useCloud } from "freestyle-sh";
import type { ChatbotCS, CounterMessageCS } from "../../cloudstate/chatbot";
import type { TextMessageCS } from "../../../../../src/chat";
import { Counter } from "./counter";
import { MessageBubble } from "./message-bubble";

export function Chatbot() {
  const chatbot = useCloud<typeof ChatbotCS>("chatbot");

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <button onClick={async () => chatbot.sendCounterMessage()}>
        Add Counter
      </button>
      <Chat<[TextMessageCS, CounterMessageCS], ChatbotCS>
        chatbot={chatbot}
        displayMessage={(message, i, { lastMessage, nextMessage }) => {
          if (message.data.type === "TEXT_MESSAGE") {
            return (
              <MessageBubble
                side={message.isSelf ? "right" : "left"}
                showTail={lastMessage?.isSelf === message.isSelf}
                backgroundColor={message.isSelf ? "#2563eb" : "#e5e5e5"}
                textColor={message.isSelf ? "white" : "black"}
              >
                {message.data.text}
              </MessageBubble>
            );
          } else if (message.data.type === "COUNTER") {
            return <Counter message={message} />;
          } else {
            return <div>unknown message type</div>;
          }
        }}
      />
    </div>
  );
}
