import { cloudstate } from "freestyle-sh";
import type { MessageCS } from "freestyle-chat";
import type { BaseUserCS } from "freestyle-auth/passkey";
import { TodoListCS } from "./todo-list";
import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

@cloudstate
export class TodoListMessageCS implements MessageCS<{ type: "TODO_LIST" }> {
  id = crypto.randomUUID();
  readBy = [];
  sender: BaseUserCS;
  todoList: TodoListCS;
  toolCall?: ChatCompletionMessageToolCall;

  constructor({ sender }: { sender: BaseUserCS }) {
    this.todoList = new TodoListCS();
    this.sender = sender;
  }

  getData() {
    return { type: "TODO_LIST" as const, todoList: { id: this.todoList.id } };
  }
}
