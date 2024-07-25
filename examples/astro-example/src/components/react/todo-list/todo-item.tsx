import { useCloudMutation } from "freestyle-sh/react";
import { useCloud } from "freestyle-sh";
import { useEffect, useState } from "react";
import type { TodoItemCS } from "../../../cloudstate/todo-list";

export default function TodoItem(props: {
  id: string;
  text: string;
  completed: boolean;
}) {
  const item = useCloud<typeof TodoItemCS>(props.id);
  const [completed, setComplete] = useState(props.completed);

  const { mutate: toggleCompletion } = useCloudMutation(item.toggleCompletion);

  useEffect(() => {
    setComplete(props.completed);
  }, [props.completed]);

  return (
    <label className="flex gap-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => {
          setComplete(!completed);
          toggleCompletion();
        }}
      />
      {props.text}
    </label>
  );
}
