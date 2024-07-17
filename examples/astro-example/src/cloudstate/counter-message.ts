import { cloudstate, invalidate, useCloud } from "freestyle-sh";
import type { BaseUserCS } from "freestyle-auth/passkey";
import type { MessageCS } from "freestyle-chat";

@cloudstate
export class CounterMessageCS
  implements MessageCS<{ count: number; type: "COUNTER" }>
{
  id = crypto.randomUUID();
  count: number = 0;
  readBy: BaseUserCS[] = [];
  sender: BaseUserCS;

  constructor({ sender }: { sender: BaseUserCS }) {
    this.sender = sender;
  }

  getData() {
    return { count: this.count, type: "COUNTER" as const };
  }

  increment() {
    invalidate(useCloud<typeof CounterMessageCS>(this.id).getData);
    return ++this.count;
  }
}
