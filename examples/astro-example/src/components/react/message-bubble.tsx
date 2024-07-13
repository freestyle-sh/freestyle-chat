export function MessageBubble(props: {
  showTail: boolean;
  side: "left" | "right";
  children: React.JSX.Element | string;
  backgroundColor: string;
  textColor: string;
  onClick?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: props.side === "right" ? "flex-end" : "flex-start",
        paddingTop: props.showTail ? "1pt" : "0.5rem",
        maxWidth: "30rem",
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: props.backgroundColor,
          padding: "0.5rem",
          borderRadius: "1rem",
          paddingRight: "1rem",
          paddingLeft: "1rem",
          fontFamily: "sans-serif",
          marginLeft: props.side == "right" ? "2rem" : "0rem",
          marginRight: props.side == "right" ? "0rem" : "2rem",
          display: "inline",
          color: props.textColor,
        }}
        onClick={props.onClick}
      >
        {props.children}
      </div>
      <svg
        style={{
          position: "absolute",
          right: props.side === "right" ? 0 : undefined,
          bottom: 0,
          translate: props.side === "right" ? "47%" : "-47%",
          scale: props.side === "right" ? "0.8" : "-0.8 0.8",
          opacity: props.showTail ? 0 : 1,
        }}
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.2073 15.5528C10.1051 17.2078 3.17494 12.4498 0.847656 9.86391L1.10624 2.10629C3.60592 2.62347 9.01901 3.08892 10.674 0.813354C10.4154 10.1225 17.3972 14.7771 19.2073 15.5528Z"
          fill={props.backgroundColor}
        />
      </svg>
    </div>
  );
}
