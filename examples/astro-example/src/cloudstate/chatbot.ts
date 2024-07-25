import { cloudstate } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import { MessageListCS, TextMessageCS as _TextMessageCS } from "freestyle-chat";
import OpenAI from "openai";
import { TodoListMessageCS } from "../messages/todo-list/cloudstate/todo-list-message";
import type {
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from "openai/resources/index";
import { TodoListCS } from "../messages/todo-list/cloudstate/todo-list";
import { CustomTextMessageCS } from "../messages/text/text-message";

export const SERVER_USER: BaseUserCS = {
  id: "chatbot",
  username: "chatbot",
};

type MessageTypes = [CustomTextMessageCS, TodoListMessageCS];

@cloudstate
export class ChatbotConversationCS extends MessageListCS<MessageTypes> {
  id = crypto.randomUUID();

  override getCurrentUser(): BaseUserCS {
    return {
      id: "anonymous",
      username: "Anonymous",
    };
  }

  override async _addTextMessage({
    text,
    user,
  }: {
    text: string;
    user: BaseUserCS;
  }): Promise<_TextMessageCS> {
    const message = new CustomTextMessageCS({
      text,
      sender: user,
    });
    await this._addMessage(message);
    return message;
  }

  async _addTodoListMessage({
    todoList,
    toolCall,
    user,
  }: {
    todoList: TodoListCS;
    toolCall?: ChatCompletionMessageToolCall;
    user: BaseUserCS;
  }) {
    const message = new TodoListMessageCS({
      sender: user,
      todoList: todoList,
      toolCall: toolCall,
    });
    await this._addMessage(message);
    return message;
  }

  override async _onMessageAdded(message: MessageTypes[number]) {
    // only respond to messages sent by the user
    if (message.sender.id !== this.getCurrentUser().id) {
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      tools: [ADD_TODO_ITEM_TOOL, CREATE_TODO_LIST_TOOL],
      messages: Array.from(this.messages.values())
        .map((message) => {
          console.log(message);
          return message.asChatCompletions();
        })
        .flat(),
    });

    if (res.choices[0].message.content?.trim()) {
      await this._addTextMessage({
        text: res.choices[0].message.content!,
        user: SERVER_USER,
      });
    }

    for (const call of res.choices[0].message.tool_calls ?? []) {
      const args = JSON.parse(call.function.arguments);
      switch (call.function.name) {
        case "create-todo-list": {
          const todoList = await this._addTodoListMessage({
            todoList: new TodoListCS({
              name: args.name,
            }),
            toolCall: call,
            user: SERVER_USER,
          });
          for (const item of args.items) {
            todoList.todoList.addItem(item);
          }
          break;
        }
        case "add-todo-item":
          {
            let todoListMessage = Array.from(this.messages.values()).find(
              (message) =>
                message instanceof TodoListMessageCS &&
                message.todoList.id === args.todoListId
            ) as TodoListMessageCS;
            let todoList =
              todoListMessage?.todoList || new TodoListCS({ name: "Unnamed" });
            await this._addTodoListMessage({
              todoList: todoList,
              toolCall: call,
              user: SERVER_USER,
            });
            for (const item of args.newItems) {
              todoList.addItem(item);
            }
          }
          break;
      }
    }
  }
}

const CREATE_TODO_LIST_TOOL: ChatCompletionTool = {
  type: "function",
  function: {
    name: "create-todo-list",
    description:
      "Send a todo list message to the user that allows the user to add items to the list. When creating a list, choose a good name for it if the user hasn't provided one.",
    parameters: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            text: {
              type: "string",
            },
          },
          required: ["text"],
        },
        name: {
          type: "string",
        },
      },
      required: ["name"],
    },
  },
};

const ADD_TODO_ITEM_TOOL: ChatCompletionTool = {
  type: "function",
  function: {
    name: "add-todo-item",
    description:
      "Add an item to an existing todo list. Can only be used if a todo list was already created in this conversation.",
    parameters: {
      type: "object",
      properties: {
        todoListId: {
          type: "string",
        },
        newItems: {
          type: "array",
          items: {
            text: {
              type: "string",
            },
          },
        },
      },
    },
  },
};
