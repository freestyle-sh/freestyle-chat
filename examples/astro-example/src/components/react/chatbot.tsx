import { Chat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import type { ChatbotCS } from "../../cloudstate/chatbot";

export function Chatbot() {
  const chatbot = useCloud<typeof ChatbotCS>("chatbot");
  return <Chat chatbot={chatbot} />;
}
