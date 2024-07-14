import { cloudstate } from "freestyle-sh";
import type { MessageCS } from "../../../../src/chat";
import type { BaseUserCS } from "freestyle-auth/passkey";
import { TodoListCS } from "./todo-list";

@cloudstate
export class TodoListMessageCS implements MessageCS<{ type: "TODO_LIST" }> {
  id = crypto.randomUUID();
  readBy = [];
  sender: BaseUserCS;
  todoList: TodoListCS;

  constructor({ sender }: { sender: BaseUserCS }) {
    this.todoList = new TodoListCS();
    this.sender = sender;
  }

  getData() {
    return { type: "TODO_LIST" as const, todoList: { id: this.todoList.id } };
  }
}
