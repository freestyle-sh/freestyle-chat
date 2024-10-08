import { MessageBubble } from "../../../../../../packages/freestyle-chat/src/react/message-bubble";
import { CreateTodoItem } from "./create-todo-item";
import { TodoList } from "./todo-list";
import type { ChatbotConversationCS } from "../../../cloudstate/chatbot";
import { useCloudQuery } from "freestyle-sh/react";
import { useCloud } from "freestyle-sh";
import { TodoListCS } from "../cloudstate/todo-list";
import { motion, AnimatePresence } from "framer-motion";

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
  const todoList = useCloud<typeof TodoListCS>(props.message.data.todoList.id);
  const { data } = useCloudQuery(todoList.getData);

  const isLast =
    props.renderedMessages.findLast(
      (message) =>
        message.data.type === "TODO_LIST" &&
        message.data.todoList.id === props.message.data.todoList.id
    )?.id === props.message.id;

  return (
    <div className="stack">
      <AnimatePresence>
        {(() => {
          if (!isLast) {
            return (
              <motion.div
                initial={{
                  opacity: 0,
                  gridTemplateRows: "0fr",
                  display: "grid",
                }}
                animate={{
                  opacity: 1,
                  gridTemplateRows: "1fr",
                  display: "grid",
                }}
                exit={{ opacity: 0, gridTemplateRows: "0fr", display: "grid" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <MessageBubble
                  backgroundColor="transparent"
                  textColor="#737373"
                  side={props.message.isSelf ? "right" : "left"}
                  showTail={props.nextMessage?.isSelf !== props.message.isSelf}
                >
                  <div className="flex gap-2 text-neutral-500">
                    <input type="checkbox" checked={true} disabled={true} />
                    {data?.name}
                  </div>
                </MessageBubble>
              </motion.div>
            );
          }

          return (
            <motion.div
              initial={{
                opacity: 0,
                gridTemplateRows: "0fr",
                display: "grid",
              }}
              animate={{
                opacity: 1,
                gridTemplateRows: "1fr",
                display: "grid",
              }}
              exit={{ opacity: 0, gridTemplateRows: "0fr", display: "grid" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <MessageBubble
                height="unset"
                spacing={
                  props.lastMessage?.isSelf === props.message.isSelf &&
                  props.nextMessage
                    ? "1pt"
                    : "0.5rem"
                }
                backgroundColor="#e5e5e5"
                textColor="black"
                side={props.message.isSelf ? "right" : "left"}
                showTail={props.nextMessage?.isSelf !== props.message.isSelf}
              >
                <div className="px-2 py-2 flex flex-col gap-2">
                  <div className="font-bold">{data?.name}</div>
                  <div>
                    <CreateTodoItem id={props.message.data.todoList.id} />
                  </div>
                  <div>
                    <TodoList todoListId={props.message.data.todoList.id} />
                  </div>
                </div>
              </MessageBubble>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
