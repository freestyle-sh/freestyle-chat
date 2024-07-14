import { cloudstate, invalidate, useCloud } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import { MessageListCS, TextMessageCS } from "../../../../src/chat";
import OpenAI from "openai";
import { CounterMessageCS } from "./counter-message";
import { TodoListMessageCS } from "./todo-list-message";

const SERVER_USER: BaseUserCS = {
  id: "chatbot",
  username: "chatbot",
};

type MessageTypes = [TextMessageCS, CounterMessageCS, TodoListMessageCS];

@cloudstate
export class ChatbotConversationCS extends MessageListCS<MessageTypes> {
  id = crypto.randomUUID();

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

  override getCurrentUser(): BaseUserCS {
    return {
      id: "anonymous",
      username: "Anonymous",
    };
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

  async sendCounterMessage() {
    await this._addCounterMessage(this.getCurrentUser());
  }

  async _addTodoListMessage(sender: BaseUserCS) {
    const message = new TodoListMessageCS({
      sender: this.getCurrentUser(),
    });

    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  async sendTodoListMessage() {
    await this._addTodoListMessage(this.getCurrentUser());
  }
}
