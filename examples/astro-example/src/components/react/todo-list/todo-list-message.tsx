import { useRef, useState } from "react";
import { MessageBubble } from "../message-bubble";
import { CreateTodoItem } from "./create-todo-item";
import { TodoList } from "./todo-list";
import type { ChatbotConversationCS } from "../../../cloudstate/chatbot";

export function TodoListMessage(props: {
  message: {
    id: string;
    isSelf: boolean;
    data: {
      type: "TODO_LIST";
      todoList: {
        id: string;
      };
    };
  };
  nextMessage?: {
    isSelf: boolean;
  };
  lastMessage?: {
    isSelf: boolean;
  };
  renderedMessages: ReturnType<ChatbotConversationCS["getMessages"]>[number][];
  key?: string;
}) {
  const ref = useRef<HTMLStyleElement>(null);

  const isLast =
    props.renderedMessages.findLast(
      (message) =>
        message.data.type === "TODO_LIST" &&
        message.data.todoList.id === props.message.data.todoList.id
    )?.id === props.message.id;

  if (!isLast) {
    return (
      <MessageBubble
        backgroundColor="transparent"
        textColor="#737373"
        side={props.message.isSelf ? "right" : "left"}
        showTail={props.nextMessage?.isSelf !== props.message.isSelf}
      >
        <div className="flex gap-2 text-neutral-500">
          <input type="checkbox" checked={true} disabled={true} />
          Todo List
        </div>
      </MessageBubble>
    );
  }

  return (
    <MessageBubble
      height="unset"
      spacing={
        props.lastMessage?.isSelf === props.message.isSelf && props.nextMessage
          ? "1pt"
          : "0.5rem"
      }
      backgroundColor="#e5e5e5"
      textColor="black"
      side={props.message.isSelf ? "right" : "left"}
      showTail={props.nextMessage?.isSelf !== props.message.isSelf}
    >
      <div className="px-2 py-2 flex flex-col gap-2">
        <div>
          <CreateTodoItem id={props.message.data.todoList.id} />
        </div>
        <div>
          <TodoList todoListId={props.message.data.todoList.id} />
        </div>
      </div>
    </MessageBubble>
  );
}
