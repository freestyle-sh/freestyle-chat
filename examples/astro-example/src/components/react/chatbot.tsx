import { Chat } from "./chat";
import { useCloud } from "freestyle-sh";
import type {
  ChatbotConversationCS,
  CounterMessageCS,
} from "../../cloudstate/chatbot";
import type { TextMessageCS } from "../../../../../src/chat";
import { Counter } from "./counter-message";
import { TextMessage } from "./text-message";

export function Chatbot(props: { conversationId: string }) {
  const chatbot = useCloud<typeof ChatbotConversationCS>(props.conversationId);

  return (
    <div className="h-full px-4">
      <Chat<[TextMessageCS, CounterMessageCS], ChatbotConversationCS>
        chatbot={chatbot}
        displayMessage={(message, _i, { lastMessage }) => {
          switch (message.data.type) {
            case "TEXT_MESSAGE": {
              return (
                <TextMessage message={message} lastMessage={lastMessage} />
              );
            }
            case "COUNTER": {
              return <Counter message={message} />;
            }
          }
        }}
      />

      <div className="flex items-center justify-center w-full mx-auto">
        <button
          className="bg-blue-600 px-2 py-1 rounded-full text-white text-sm mt-4"
          onClick={async () => chatbot.sendCounterMessage()}
        >
          Add Counter
        </button>
      </div>
    </div>
  );
}
