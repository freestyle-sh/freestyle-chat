import { cloudstate } from "freestyle-sh";
import { ChatbotConversationCS } from "./chatbot";

@cloudstate
export class ConversationManagerCS {
  static id = "conversation-manager";
  conversations = new Map<string, ChatbotConversationCS>();

  async createConversation() {
    const conversation = new ChatbotConversationCS();
    this.conversations.set(conversation.id, conversation);
    return {
      id: conversation.id,
    };
  }
}
