import { MessageBubble } from "freestyle-chat/react/message-bubble";
import { useCloud } from "freestyle-sh";
import type { SelectTodoListMessageCS } from "../cloudstate/select-todo-list-message";

export function SelectTodoListMessage(props: {
  items: {
    id: string;
    name: string;
  }[];
  id: string;
}) {
  return (
    <>
      <MessageBubble
        backgroundColor="#e5e5e5"
        textColor="black"
        showTail={false}
        side="left"
      >
        Which todo list would you like to use?
      </MessageBubble>
      <MessageBubble
        backgroundColor="#e5e5e5"
        textColor="black"
        showTail={true}
        side="left"
      >
        <div className="divide-y grid divide-neutral-400">
          {props.items.map((item) => (
            <div key={item.id}>
              <button
                className="text-blue-500"
                onClick={async () => {
                  const selectTodoListMessage = useCloud<
                    typeof SelectTodoListMessageCS
                  >(props.id);

                  await selectTodoListMessage.selectTodoList(item.id);
                }}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
      </MessageBubble>
    </>
  );
}
