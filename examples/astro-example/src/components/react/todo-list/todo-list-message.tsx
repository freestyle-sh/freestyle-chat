import { useRef, useState } from "react";
import { MessageBubble } from "../message-bubble";
import { CreateTodoItem } from "./create-todo-item";
import { TodoList } from "./todo-list";
import root from "react-shadow";
import styles from "../../../../public/todo-list.css?raw";

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
  key?: string;
}) {
  const ref = useRef<HTMLStyleElement>(null);

  return (
    <MessageBubble
      height="20rem"
      spacing={
        props.lastMessage?.isSelf === props.message.isSelf && props.nextMessage
          ? "1pt"
          : "0.5rem"
      }
      backgroundColor="#f5f5f5"
      textColor="black"
      side={props.message.isSelf ? "right" : "left"}
      showTail={props.nextMessage?.isSelf === props.message.isSelf}
    >
      <root.div
        style={{
          height: "20rem",
        }}
        styleSheets={[ref.current?.sheet || new CSSStyleSheet()]}
      >
        <style ref={ref} type="text/css">
          {styles}
        </style>
        <body
          data-theme="light"
          style={{
            height: "100%",
            display: "grid",
          }}
        >
          <div
            style={{
              paddingTop: "1rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <h1>
              <a href="https://www.freestyle.sh" target="_blank">
                freestyle.sh
              </a>
            </h1>
            <CreateTodoItem id={props.message.data.todoList.id} />
          </div>
          <div
            style={{
              paddingLeft: "1rem",
              paddingRight: "1rem",
              overflow: "scroll",
            }}
          >
            <TodoList todoListId={props.message.data.todoList.id} />
          </div>
        </body>
      </root.div>
    </MessageBubble>
  );
}
