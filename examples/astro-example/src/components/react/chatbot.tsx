import { Chat } from "./chat";
import { useCloud } from "freestyle-sh";
import type { ChatbotConversationCS } from "../../cloudstate/chatbot";
import type { TextMessageCS } from "../../../../../packages/freestyle-chat/src/chat";
import { Counter } from "./counter-message";
import { TextMessage } from "./text-message";
import type { CounterMessageCS } from "../../cloudstate/counter-message";
import { TodoListMessage } from "./todo-list/todo-list-message";
import type { TodoListMessageCS } from "../../cloudstate/todo-list-message";

export function Chatbot(props: { conversationId: string }) {
  const chatbot = useCloud<typeof ChatbotConversationCS>(props.conversationId);

  return (
    <div className="h-full px-4">
      <Chat<
        [TextMessageCS, CounterMessageCS, TodoListMessageCS],
        ChatbotConversationCS
      >
        chatbot={chatbot}
        displayMessage={(message, _i, { lastMessage }) => {
          switch (message.data.type) {
            case "TEXT_MESSAGE": {
              return (
                <TextMessage
                  key={message.id}
                  message={message}
                  lastMessage={lastMessage}
                />
              );
            }
            case "COUNTER": {
              return <Counter key={message.id} message={message} />;
            }
            case "TODO_LIST": {
              return <TodoListMessage key={message.id} message={message} />;
            }
          }
        }}
      />

      <div className="flex items-center justify-center w-full mx-auto gap-2">
        <button
          className="bg-blue-600 px-2 py-1 rounded-full text-white text-sm mt-4"
          onClick={async () => chatbot.sendCounterMessage()}
        >
          Add Counter
        </button>
        <button
          className="bg-blue-600 px-2 py-1 rounded-full text-white text-sm mt-4"
          onClick={async () => chatbot.sendTodoListMessage()}
        >
          Add Todo List
        </button>
      </div>
    </div>
  );
}
