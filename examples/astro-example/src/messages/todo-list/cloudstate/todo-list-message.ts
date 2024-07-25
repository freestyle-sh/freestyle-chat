import { cloudstate } from "freestyle-sh";
import type { MessageCS } from "freestyle-chat";
import type { BaseUserCS } from "freestyle-auth/passkey";
import { TodoListCS } from "./todo-list";
import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/index";

@cloudstate
export class TodoListMessageCS implements MessageCS<{ type: "TODO_LIST" }> {
  id = crypto.randomUUID();
  readBy = [];
  sender: BaseUserCS;
  todoList: TodoListCS;
  toolCall?: ChatCompletionMessageToolCall;

  constructor({
    sender,
    todoList,
    toolCall,
  }: {
    sender: BaseUserCS;
    todoList: TodoListCS;
    toolCall?: ChatCompletionMessageToolCall;
  }) {
    this.todoList = todoList;
    this.sender = sender;
    this.toolCall = toolCall;
  }

  getData() {
    return { type: "TODO_LIST" as const, todoList: { id: this.todoList.id } };
  }

  asChatCompletions(): ChatCompletionMessageParam[] {
    // openai doesn't have a built in way to represent user tool calls
    if (!this.toolCall) {
      return [];
    }

    return [
      {
        role: "assistant",
        content: "",
        tool_calls: [this.toolCall],
      },
      {
        role: "tool",
        content: JSON.stringify({
          id: this.todoList.id,
          items: Array.from(this.todoList.items).map(([id, item]) => ({
            text: item.text,
            completed: item.completed,
            id: id,
          })),
        }),
        tool_call_id: this.toolCall.id,
      },
    ];
  }
}
