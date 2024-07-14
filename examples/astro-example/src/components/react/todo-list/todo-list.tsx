import TodoItemView from "./todo-item";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { TodoListCS } from "../../../cloudstate/todo-list";

export function TodoList(props: { todoListId: string }) {
  const todoList = useCloud<typeof TodoListCS>(props.todoListId);
  const { data: items, loading } = useCloudQuery(todoList.getItems);

  if (loading && !items) {
    return <div aria-busy="true" />;
  }

  return (
    <>
      {items?.map((item) => (
        <div key={item.id}>
          <TodoItemView
            id={item.id}
            text={item.text}
            completed={item.completed}
          />
        </div>
      ))}
    </>
  );
}
