import { BaseUserCS } from "freestyle-auth/passkey";

export class TypingIndicatorsCS {
  typingUsers = new Map<string, BaseUserCS>();

  startTyping(user: BaseUserCS) {
    this.typingUsers.set(user.id, user);
  }

  endTyping(user: BaseUserCS) {
    this.typingUsers.delete(user.id);
  }
}
