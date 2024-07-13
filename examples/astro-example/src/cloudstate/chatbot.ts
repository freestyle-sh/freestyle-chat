import { cloudstate, useLocal } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import {
  MessageListCS,
  TextMessageCS,
  TypingIndicatorsCS,
  type MessageCS,
} from "../../../../src/chat";
import OpenAI from "openai";

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

type MessageTypes = [TextMessageCS, CustomMessageCS];

@cloudstate
export class ChatbotCS extends MessageListCS<MessageTypes> {
  static id = "chatbot";

  override getCurrentUser(): BaseUserCS {
    return {
      id: "anonymous",
      username: "Anonymous",
    };
  }

  override async _onMessageAdded(message: MessageTypes[number]) {
    // only respond to messages sent by the user
    if (message.sender.id !== this.getCurrentUser().id) {
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const res = await openai.chat.completions.create({
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

    console.log(res.choices[0].message.content);

    await this._addTextMessage(
      { text: res.choices[0].message.content! },
      SERVER_USER
    );
  }
}
