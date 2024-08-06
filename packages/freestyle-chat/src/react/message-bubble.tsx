import type { JSX, ReactNode } from "react";
import { motion } from "framer-motion";

export function MessageBubble(props: {
  showTail: boolean;
  side: "left" | "right";
  children: JSX.Element | ReactNode | string;
  backgroundColor: string;
  textColor: string;
  onClick?: () => void;
  spacing?: string;
  height?: string;
  paddingTop?: string;
  paddingBottom?: string;
  bubbleWidth?: string;
  wooshAnimation?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: props.side === "right" ? "flex-end" : "flex-start",
        paddingTop: props.spacing ?? "0.5rem",
        maxWidth: "30rem",
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
        boxSizing: "initial",
      }}
    >
      <motion.div
        style={{
          backgroundColor: props.backgroundColor,
          padding: "0.5rem",
          paddingTop: props.paddingTop ?? "0.3rem",
          paddingBottom: props.paddingBottom ?? "0.3rem",
          borderRadius: "1rem",
          fontFamily: "sans-serif",
          // marginLeft:
          //   !props.bubbleWidth && props.side == "right" ? "2rem" : "0rem",
          // marginRight: props.side == "right" ? "0rem" : "2rem",
          display: "flex",
          color: props.textColor,
          // minWidth: "2rem",
          height: props.height,
          boxSizing: "initial",
        }}
        initial={{
          width: props.wooshAnimation && props.bubbleWidth ? "200%" : "unset",
          backgroundColor:
            props.wooshAnimation && props.bubbleWidth
              ? `color-mix(in srgb, ${props.backgroundColor}, transparent 100%)`
              : props.backgroundColor,
          color: props.wooshAnimation ? "black" : undefined,
          zIndex: props.wooshAnimation ? 1 : "unset",
        }}
        animate={{
          width: props.bubbleWidth,
          backgroundColor: props.wooshAnimation
            ? `color-mix(in srgb, ${props.backgroundColor}, transparent 0%)`
            : props.backgroundColor,
          color: props.textColor,
          zIndex: "unset",
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          zIndex: {
            delay: 0.3,
          },
        }}
        onClick={props.onClick}
      >
        <span
          style={{
            marginLeft: "minmax(0.5rem, auto)",
            marginRight: "minmax(0.5rem, auto)",
          }}
        >
          {props.children}
        </span>
      </motion.div>
      <svg
        style={{
          position: "absolute",
          right: props.side === "right" ? 0 : undefined,
          bottom: 0,
          translate: props.side === "right" ? "47%" : "-47%",
          scale: props.side === "right" ? "0.8" : "-0.8 0.8",
          opacity: props.showTail ? 1 : 0,
        }}
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          d="M19.2073 15.5528C10.1051 17.2078 3.17494 12.4498 0.847656 9.86391L1.10624 2.10629C3.60592 2.62347 9.01901 3.08892 10.674 0.813354C10.4154 10.1225 17.3972 14.7771 19.2073 15.5528Z"
          fill={props.backgroundColor}
        />
      </svg>
    </div>
  );
}
