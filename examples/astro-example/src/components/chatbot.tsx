import { Chat } from "../../../../packages/freestyle-chat/src/react/chat";
import { useCloud } from "freestyle-sh";
import type { ChatbotConversationCS } from "../cloudstate/chatbot";
import { TextMessage } from "freestyle-chat/react/messages/text";
import { TodoListMessage } from "../messages/todo-list/components/todo-list-message";
import type { TodoListMessageCS } from "../messages/todo-list/cloudstate/todo-list-message";
import type { CustomTextMessageCS } from "../messages/text/text-message";
import type { SelectTodoListMessageCS } from "../messages/select-todo-list/cloudstate/select-todo-list-message";
import { SelectTodoListMessage } from "../messages/select-todo-list/components/select-todo-list";
import { useCloudMutation } from "freestyle-sh/react";

export function Chatbot(props: { conversationId: string }) {
  const chatbot = useCloud<typeof ChatbotConversationCS>(props.conversationId);
  const { mutate: removeLastMessage } = useCloudMutation(
    chatbot.removeLastMessage
  );

  return (
    <div className="h-full px-4">
      <div>
        <button
          onClick={async () => {
            await removeLastMessage();
          }}
        >
          Remove Last Message
        </button>
      </div>
      <Chat<
        [CustomTextMessageCS, TodoListMessageCS, SelectTodoListMessageCS],
        ChatbotConversationCS
      >
        chatbot={chatbot}
        displayMessage={(
          message,
          _i,
          { lastMessage, nextMessage, renderedMessages }
        ) => {
          switch (message.data.type) {
            case "TEXT_MESSAGE": {
              return (
                <TextMessage
                  key={message.id}
                  message={message}
                  lastMessage={lastMessage}
                  nextMessage={nextMessage}
                />
              );
            }
            case "TODO_LIST": {
              return (
                <TodoListMessage
                  key={message.id}
                  message={message}
                  renderedMessages={renderedMessages}
                />
              );
            }
            case "SELECT_TODO_LIST": {
              return (
                <SelectTodoListMessage
                  id={message.id}
                  key={message.id}
                  items={message.data.lists}
                />
              );
            }
          }
        }}
      />
    </div>
  );
}
