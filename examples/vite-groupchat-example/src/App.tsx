import "./App.css";
import { useCloud } from "freestyle-sh";
import { ChatCS } from "./cloudstate/chat";
import { Chat } from "../../../packages/freestyle-chat/src/react/chat";
import { TextMessage } from "../../../packages/freestyle-chat/src/react/messages/text";

function App() {
  const chat = useCloud<typeof ChatCS>("chat");

  return (
    <Chat
      chatbot={chat}
      displayMessage={(
        message,
        i,
        { nextMessage, lastMessage, messageHeight }
      ) => {
        return (
          <TextMessage
            key={i}
            message={message}
            nextMessage={nextMessage}
            lastMessage={lastMessage}
            messageHeight={messageHeight}
            messageWidth={message.width}
          />
        );
      }}
    />
  );
}

export default App;
