import { Chat } from "../src/react/chat";
import { cloudstate } from "freestyle-sh";
import { BaseUserCS } from "freestyle-auth/passkey";
import { ChatCS } from "../src/chat";

const SERVER_USER = {
  id: "chatbot",
  username: "chatbot",
  displayName: "Chatbot",
};

@cloudstate
export class ChatbotCS extends ChatCS {
  static id = "chatbot";

  override getCurrentUser(): BaseUserCS {
    const user = useLocal(AuthenticationCS).getCurrentUser();
    return {
      id: crypto.randomUUID(),
      username: user.username,
    };
  }

  override _onMessageReceived(message) {
    const openai = new OpenAI();

    super._startTyping(SERVER_USER);
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [this.messages],
    });
    super._endTyping(SERVER_USER);

    super._sendTextMessage({ text: "response from server" }, SERVER_USER);
  }
}

export function Chatbot() {
  const chatbot = useCloud<ChatbotCS>("chatbot");
  return <Chat chatbot={chatbot} />;
}
