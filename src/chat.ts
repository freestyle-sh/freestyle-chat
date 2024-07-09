import { cloudstate, invalidate, useCloud } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";

interface ChatEvent {
  id: string;
  data: ChatSendTextMessage;
}

enum ChatEventType {
  SEND_TEXT_MESSAGE = "SEND_TEXT_MESSAGE",
}

interface ChatSendTextMessage {
  type: ChatEventType.SEND_TEXT_MESSAGE;
  text: string;
}

@cloudstate
export class ChatCS {
  id = crypto.randomUUID();
  events = new Map<string, ChatEvent>();

  sendTextMessage(message: { text: string }) {
    return this._sendTextMessage(text, this.getCurrentUser());
  }

  _sendTextMessage(message: { text: string }, user: BaseUserCS) {
    const event: ChatEvent = {
      id: crypto.randomUUID(),
      data: {
        type: ChatEventType.SEND_TEXT_MESSAGE,
        text: message.text,
      },
    };
    this.events.set(event.id, event);
    invalidate(useCloud<typeof ChatCS>("chat").getMessages);
    return event;
  }

  getMessages() {}

  markMessagesAsRead(ids: string[]) {}

  getUnreadMessages() {}

  getCurrentUser(): BaseUserCS {
    throw new Error("Please override method getCurrentUser on ChatCS");
  }
}
