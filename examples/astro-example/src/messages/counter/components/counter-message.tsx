import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import { MessageBubble } from "freestyle-chat/react/message-bubble";
import type { CounterMessageCS } from "../cloudstate/counter-message";

export function Counter(props: {
  message: {
    id: string;
    isSelf: boolean;
  };
  nextMessage?: {
    isSelf: boolean;
  };
}) {
  const message = useCloud<typeof CounterMessageCS>(props.message.id);
  const { data } = useCloudQuery(message.getData);
  return (
    <MessageBubble
      side={props.message.isSelf ? "right" : "left"}
      showTail={props.nextMessage?.isSelf === props.message.isSelf}
      backgroundColor={"#d4d4d4"}
      textColor={"black"}
      onClick={async () => {
        await message.increment();
      }}
    >
      <div
        style={{
          fontWeight: "600",
          fontSize: "0.75rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        {data ? (
          <>This button has been clicked {data?.count} times</>
        ) : (
          "loading..."
        )}
      </div>
    </MessageBubble>
  );
}
