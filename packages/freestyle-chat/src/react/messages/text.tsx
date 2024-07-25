import { MessageBubble } from "../message-bubble";

export function TextMessage(props: {
  message: {
    id: string;
    isSelf: boolean;
    data: {
      type: "TEXT_MESSAGE";
      text: string;
    };
  };
  nextMessage?: {
    isSelf: boolean;
  };
  lastMessage?: {
    isSelf: boolean;
  };
}) {
  const message = props.message;
  const nextMessage = props.nextMessage;
  const lastMessage = props.lastMessage;

  return (
    <MessageBubble
      key={message.id}
      side={message.isSelf ? "right" : "left"}
      showTail={nextMessage?.isSelf !== message.isSelf}
      backgroundColor={message.isSelf ? "#2563eb" : "#e5e5e5"}
      textColor={message.isSelf ? "white" : "black"}
      spacing={lastMessage?.isSelf === message.isSelf ? "1pt" : "0.5rem"}
    >
      {message.data.text}
    </MessageBubble>
  );
}
