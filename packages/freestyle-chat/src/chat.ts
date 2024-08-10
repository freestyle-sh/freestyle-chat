import { cloudstate, invalidate, useCloud, useRequest } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import { parse as parseCookie } from "cookie";
export { TypingIndicatorsCS } from "./typing";

export interface MessageCS<Data extends { type: string }> {
  id: string;
  sender: BaseUserCS;
  readBy: BaseUserCS[];
  getData(): Data;
}

@cloudstate
export class TextMessageCS
  implements MessageCS<{ text: string; type: "TEXT_MESSAGE" }>
{
  id = crypto.randomUUID();
  text: string;
  sender: BaseUserCS;
  readBy: BaseUserCS[] = [];

  constructor({ text, sender }: { text: string; sender: BaseUserCS }) {
    this.sender = sender;
    this.text = text;
  }

  getData() {
    return {
      type: "TEXT_MESSAGE" as const,
      text: this.text,
    };
  }
}

export type DefaultMessageTypes = [TextMessageCS];

@cloudstate
export class MessageListCS<
  MessageTypes extends MessageCS<any>[] = DefaultMessageTypes
> {
  id = crypto.randomUUID();
  messages = new Map<string, MessageTypes[number]>();

  async _addMessage(message: MessageTypes[number]) {
    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  async sendTextMessage(message: { text: string }) {
    return await this._addTextMessage({
      text: message.text,
      user: this.getCurrentUser(),
    });
  }

  async _addTextMessage({ text, user }: { text: string; user: BaseUserCS }) {
    const message = new TextMessageCS({
      text,
      sender: user,
    });
    await this._addMessage(message);
    return message;
  }

  _onMessageAdded(message: MessageTypes[number]) {}

  getMessages() {
    return Array.from(this.messages.values()).map((message) => ({
      data: message.getData() as ReturnType<MessageTypes[number]["getData"]>,
      sender: {
        id: message.sender.id,
        displayName: message.sender.username,
      },
      id: message.id,
      isSelf: message.sender.id === this.getCurrentUser().id,
    }));
  }

  // markMessagesAsRead(ids: string[]) {
  //   for (const id of ids) {
  //     const message = this.messages.get(id);
  //     if (message) {
  //       message.readBy.push(this.getCurrentUser());
  //     }
  //   }
  //   invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
  // }

  getCurrentUser(): BaseUserCS {
    const req = useRequest();
    const cookie = req.headers.get("cookie");
    const parsedCookie = parseCookie(cookie ?? "");
    const sessionId = parsedCookie["freestyle-session-id"];

    return {
      id: sessionId,
      username: sessionId,
    };
  }
}
