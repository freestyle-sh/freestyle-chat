import { cloudstate, useLocal } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import {
  MessageListCS,
  TextMessageCS,
  TypingIndicatorsCS,
  type MessageCS,
} from "freestyle-chat";
import OpenAI from "openai";
import { AuthCS } from "./auth";

const SERVER_USER: BaseUserCS = {
  id: "chatbot",
  username: "chatbot",
};

@cloudstate
export class TypingCS extends TypingIndicatorsCS {
  static id = "typing";
}

export class CustomMessageCS
  implements MessageCS<{ count: number; type: "CUSTOM" }>
{
  id = crypto.randomUUID();
  count: number = 0;
  readBy: BaseUserCS[] = [];
  sender: BaseUserCS;

  constructor(sender: BaseUserCS) {
    this.sender = sender;
  }

  getData() {
    return { count: this.count, type: "CUSTOM" as const };
  }
}

@cloudstate
export class ChatbotCS extends MessageListCS<{
  TEXT_MESSAGE: TextMessageCS;
  CUSTOM_MESSAGE: CustomMessageCS;
}> {
  static id = "chatbot";

  override getCurrentUser(): BaseUserCS {
    const user = useLocal(AuthCS).getDefiniteCurrentUser();
    return {
      id: crypto.randomUUID(),
      username: user.username,
    };
  }

  override _onMessageReceived() {
    const openai = new OpenAI();
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: Array.from(this.messages.values())
        .filter((message) => message instanceof TextMessageCS)
        .map((message) => {
          let role: "user" | "assistant" = "user";
          if (message.sender.id === this.getCurrentUser().id) {
            role = "user";
          } else if (message.sender.id === SERVER_USER.id) {
            role = "assistant";
          }
          return {
            role,
            content: message.text,
          };
        }),
    });
  }
}
