import { Chat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import type { ChatbotConversationCS } from "../cloudstate/chatbot";
import { TextMessage } from "freestyle-chat/react/messages/text";
import { TodoListMessage } from "../messages/todo-list/components/todo-list-message";
import type { TodoListMessageCS } from "../messages/todo-list/cloudstate/todo-list-message";
import type { CustomTextMessageCS } from "../messages/text/text-message";

export function Chatbot(props: { conversationId: string }) {
  const chatbot = useCloud<typeof ChatbotConversationCS>(props.conversationId);

  return (
    <div className="h-full px-4">
      <Chat<[CustomTextMessageCS, TodoListMessageCS], ChatbotConversationCS>
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
          }
        }}
      />
    </div>
  );
}
