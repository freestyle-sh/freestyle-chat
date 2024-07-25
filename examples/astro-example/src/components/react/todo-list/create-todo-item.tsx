import { useCloudMutation, useCloudQuery } from "freestyle-sh/react";
import { useCloud } from "freestyle-sh";
import { useState } from "react";
import type { TodoListCS } from "../../../cloudstate/todo-list";

export function CreateTodoItem(props: { id: string }) {
  const [text, setText] = useState<string>("");
  const todoList = useCloud<typeof TodoListCS>(props.id);
  const { data: items, mutate: setItems } = useCloudQuery(todoList.getItems);
  const { mutate: addItem } = useCloudMutation(todoList.addItem);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // optimistically update the list
        setItems([
          {
            id: crypto.randomUUID(),
            text,
            completed: false,
          },
          ...(items ?? []),
        ]);

        // add item to cloudstate
        addItem(text);

        // reset the form
        setText("");
      }}
    >
      <fieldset role="group" className="flex gap-2">
        <input
          placeholder="Create a new todo"
          value={text}
          type="text"
          onInput={(e) => setText(e.currentTarget.value)}
          className="bg-white py-1 px-2 rounded"
        />
        {/* <input type="submit" value="Add Item" className="bg-blue-500" /> */}
      </fieldset>
    </form>
  );
}
