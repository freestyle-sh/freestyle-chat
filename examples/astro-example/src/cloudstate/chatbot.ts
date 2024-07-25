import { cloudstate, invalidate, useCloud, useLocal } from "freestyle-sh";
import { type BaseUserCS } from "freestyle-auth/passkey";
import { MessageListCS, TextMessageCS } from "freestyle-chat";
import OpenAI from "openai";
import { CounterMessageCS } from "./counter-message";
import { TodoListMessageCS } from "./todo-list-message";
import {
  QuickReplyMessageCS,
  type QuickReplyItem,
} from "./quick-reply-message";
import type { ChatCompletionMessageToolCall } from "openai/resources/index";
import { TodoListCS } from "./todo-list";

const SERVER_USER: BaseUserCS = {
  id: "chatbot",
  username: "chatbot",
};

type MessageTypes = [
  TextMessageCS,
  CounterMessageCS,
  TodoListMessageCS,
  QuickReplyMessageCS
];

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
      tools: [ADD_TODO_ITEM_TOOL, CREATE_TODO_LIST_TOOL],
      messages: Array.from(this.messages.values())
        // .filter((message) => message instanceof TextMessageCS)
        .map((message) => {
          let role: "user" | "assistant" = "user";
          if (message.sender.id === this.getCurrentUser().id) {
            role = "user";
          } else if (message.sender.id === SERVER_USER.id) {
            role = "assistant";
          }

          const messageData = message.getData();

          if (messageData.type === "TEXT_MESSAGE") {
            return [
              {
                role,
                content: messageData.text,
              },
            ];
          } else if (message instanceof TodoListMessageCS) {
            return [
              {
                role: "assistant",
                content: "",
                tool_calls: [message.toolCall],
              },
              {
                role: "tool",
                content: JSON.stringify({
                  id: message.todoList.id,
                  items: Array.from(message.todoList.items).map(
                    ([id, item]) => ({
                      text: item.text,
                      completed: item.completed,
                      id: id,
                    })
                  ),
                }),
                tool_call_id: message.toolCall.id,
              },
            ];
          }
        })
        .flat(),
    });

    for (const call of res.choices[0].message.tool_calls ?? []) {
      console.log(call);

      if (call.function.name === "create-todo-list") {
        const todoList = await this._addTodoListMessage(
          {
            todoList: new TodoListCS(),
            toolCall: call,
          },
          SERVER_USER
        );
        for (const item of JSON.parse(call.function.arguments).items) {
          todoList.todoList.addItem(item);
        }
      } else if (call.function.name === "add-todo-item") {
        const args = JSON.parse(call.function.arguments);
        const todoListMessage = Array.from(this.messages.values()).find(
          (message) =>
            message instanceof TodoListMessageCS &&
            message.todoList.id === args.todoListId
        )! as TodoListMessageCS;
        this._addTodoListMessage(
          {
            todoList: todoListMessage.todoList,
            toolCall: call,
          },
          SERVER_USER
        );
        for (const item of args.newItems) {
          todoListMessage.todoList.addItem(item);
        }
      } else {
        console.log(call);
      }
    }

    if (res.choices[0].message.content?.trim()) {
      await this._addTextMessage(
        { text: res.choices[0].message.content! },
        SERVER_USER
      );
    }
  }

  override getCurrentUser(): BaseUserCS {
    return {
      id: "anonymous",
      username: "Anonymous",
    };
  }

  async _addQuickReplyMessage(items: QuickReplyItem[], sender: BaseUserCS) {
    const message = new QuickReplyMessageCS(sender, items);

    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  async _addCounterMessage(sender: BaseUserCS) {
    const message = new CounterMessageCS({
      sender: sender,
    });

    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  async sendCounterMessage() {
    await this._addCounterMessage(this.getCurrentUser());
  }

  async _addTodoListMessage(
    options: {
      todoList: TodoListCS;
      toolCall?: ChatCompletionMessageToolCall;
    },
    sender: BaseUserCS
  ) {
    const message = new TodoListMessageCS({
      sender: sender,
      todoList: options.todoList,
    });
    message.toolCall = options.toolCall;

    this.messages.set(message.id, message);
    invalidate(useCloud<typeof MessageListCS>(this.id).getMessages);
    await this._onMessageAdded(message);
    return message;
  }

  async sendTodoListMessage() {
    await this._addTodoListMessage(
      {
        todoList: new TodoListCS(),
      },
      this.getCurrentUser()
    );
  }
}

const CREATE_TODO_LIST_TOOL = {
  type: "function",
  function: {
    name: "create-todo-list",
    description:
      "Send a todo list message to the user that allows the user to add items to the list",
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
      },
    },
  },
};

const ADD_TODO_ITEM_TOOL = {
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
