import { useCloud } from "freestyle-sh";
import type { CounterMessageCS } from "../../cloudstate/chatbot";
import { useCloudQuery } from "freestyle-sh/react";
import { MessageBubble } from "./message-bubble";

export function Counter(props: {
  message: {
    id: string;
    isSelf: boolean;
    // data: ReturnType<CounterMessageCS["getData"]>;
  };
}) {
  const message = useCloud<typeof CounterMessageCS>(props.message.id);
  const { data } = useCloudQuery(message.getData);
  return (
    <MessageBubble
      side={props.message.isSelf ? "right" : "left"}
      showTail={false}
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
