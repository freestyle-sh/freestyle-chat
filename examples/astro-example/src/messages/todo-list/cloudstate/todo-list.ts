import { cloudstate, invalidate, useCloud } from "freestyle-sh";

@cloudstate
export class TodoListCS {
  id = crypto.randomUUID();
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  items = new Map<string, TodoItemCS>();

  addItem(text: string) {
    const item = new TodoItemCS(text, this);
    this.items.set(item.id, item);

    // forces the client to refetch the list
    invalidate(useCloud<typeof TodoListCS>(this.id).getData);

    return item.info();
  }

  getData() {
    return {
      items: Array.from(this.items.values())
        .map((item) => item.info())
        .toReversed(),
      name: this.name,
    };
  }
}

@cloudstate
export class TodoItemCS {
  id = crypto.randomUUID();
  completed = false;
  list: TodoListCS;

  constructor(public text: string, list: TodoListCS) {
    this.list = list;
    this.text = text;
  }

  info() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
    };
  }

  toggleCompletion() {
    this.completed = !this.completed;

    // forces the client to refetch the list
    invalidate(useCloud<typeof TodoListCS>(this.list.id).getData);

    return {
      completed: this.completed,
    };
  }
}
