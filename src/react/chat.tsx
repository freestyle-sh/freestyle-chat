import { useCloud } from "freestyle-sh";
import { ChatCS } from "../chat";

export function Chat(props: {
  chatbot: ReturnType<typeof useCloud<typeof ChatCS>>;
}) {
  const { data: messages } = useCloudQuery(props.chatbot.getMessages);

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div>{message.data.text}</div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.target.elements.text.value;
          props.chatbot.sendTextMessage({ text });
        }}
      >
        <input type="text" placeholder="Type a message" />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
