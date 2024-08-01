import { cloudstate, useLocal } from "freestyle-sh";
import type { TodoListCS } from "../../todo-list/cloudstate/todo-list";
import type { BaseUserCS } from "freestyle-auth/passkey";
import type { MessageCS } from "freestyle-chat";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/index.mjs";
import {
  ChatbotConversationCS,
  SERVER_USER,
} from "../../../cloudstate/chatbot";

@cloudstate
export class SelectTodoListMessageCS
  implements MessageCS<{ type: "SELECT_TODO_LIST" }>
{
  id = crypto.randomUUID();
  readBy = [];
  sender: BaseUserCS;
  lists: Map<string, TodoListCS>;
  toolCall: ChatCompletionMessageToolCall;
  itemToAdd: string;
  conversationId: string;

  constructor({
    sender,
    lists,
    toolCall,
    itemToAdd,
    conversationId,
  }: {
    sender: BaseUserCS;
    lists: TodoListCS[];
    toolCall: ChatCompletionMessageToolCall;
    itemToAdd: string;
    conversationId: string;
  }) {
    this.sender = sender;
    this.lists = new Map<string, TodoListCS>();
    for (const list of lists) {
      this.lists.set(list.id, list);
    }
    this.lists;
    this.toolCall = toolCall;
    this.itemToAdd = itemToAdd;
    this.conversationId = conversationId;
  }

  getData() {
    return {
      type: "SELECT_TODO_LIST" as const,
      lists: Array.from(this.lists.values()).map((list) => ({
        id: list.id,
        name: list.name,
      })),
    };
  }

  async selectTodoList(listId: string) {
    const list = useLocal(listId);
    list?.addItem(this.itemToAdd);

    const conversation = useLocal<typeof ChatbotConversationCS>(
      this.conversationId
    );

    await conversation._addTodoListMessage({
      todoList: list,
      toolCall: this.toolCall,
      user: SERVER_USER,
    });
  }

  asChatCompletions(): ChatCompletionMessageParam[] {
    return [
      {
        role: "assistant",
        content: "",
        tool_calls: [this.toolCall],
      },
      {
        role: "tool",
        content: JSON.stringify({
          id: this.id,
          lists: Array.from(this.lists.values()).map((list) => ({
            id: list.id,
            name: list.name,
          })),
        }),
        tool_call_id: this.toolCall?.id,
      },
    ];
  }
}
