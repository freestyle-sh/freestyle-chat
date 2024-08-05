import { useRef } from "react";
import { MessageBubble } from "../message-bubble";
import { AnimatePresence, motion } from "framer-motion";

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
  /** only used for woosh animation */
  messageHeight?: string;
  messageWidth?: string;
}) {
  const message = props.message;
  const nextMessage = props.nextMessage;
  const lastMessage = props.lastMessage;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{
        // marginRight: message.isSelf ? "100%" : "0",
        marginTop: message.isSelf ? props.messageHeight : "0",
      }}
      animate={{
        // marginRight: "0",
        marginTop: "0",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MessageBubble
        wooshAnimation={message.isSelf ? true : false}
        bubbleWidth={props.messageWidth}
        key={message.id}
        side={message.isSelf ? "right" : "left"}
        showTail={nextMessage?.isSelf !== message.isSelf}
        backgroundColor={message.isSelf ? "#2563eb" : "#e5e5e5"}
        textColor={message.isSelf ? "white" : "black"}
        spacing={lastMessage?.isSelf === message.isSelf ? "1pt" : "0.5rem"}
      >
        {message.data.text}
      </MessageBubble>
    </motion.div>
  );
}
