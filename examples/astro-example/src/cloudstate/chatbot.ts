import { cloudstate, invalidate, useCloud, useLocal } from "freestyle-sh";
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

@cloudstate
export class CounterMessageCS
  implements MessageCS<{ count: number; type: "COUNTER" }>
{
  id = crypto.randomUUID();
  count: number = 0;
  readBy: BaseUserCS[] = [];
  sender: BaseUserCS;

  constructor({ sender }: { sender: BaseUserCS }) {
    this.sender = sender;
  }

  getData() {
    return { count: this.count, type: "COUNTER" as const };
  }

  increment() {
    invalidate(useCloud<typeof CounterMessageCS>(this.id).getData);
    return ++this.count;
  }
}

type MessageTypes = [TextMessageCS, CounterMessageCS];

@cloudstate
export class ChatbotCS extends MessageListCS<MessageTypes> {
  static id = "chatbot";

  override getCurrentUser(): BaseUserCS {
    return {
      id: "anonymous",
      username: "Anonymous",
    };
  }

  async sendCounterMessage() {
    await this._addCounterMessage(this.getCurrentUser());
  }

  async _addCounterMessage(sender: BaseUserCS) {
    const message = new CounterMessageCS({
      sender: this.getCurrentUser(),
    });

    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  override async _onMessageAdded(message: MessageTypes[number]) {
    // only respond to messages sent by the user
    if (message.sender.id !== this.getCurrentUser().id) {
      return;
    }

    if (message.getData().type !== "TEXT_MESSAGE") {
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

    await this._addTextMessage(
      { text: res.choices[0].message.content! },
      SERVER_USER
    );
  }
}
