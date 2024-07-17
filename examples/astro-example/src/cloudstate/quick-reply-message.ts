import { cloudstate } from "freestyle-sh";
import type { MessageCS } from "freestyle-chat";
import type { BaseUserCS } from "freestyle-auth/passkey";

export interface QuickReplyItem {
  text: string;
  value: string;
  id: string;
}

@cloudstate
export class QuickReplyMessageCS
  implements MessageCS<{ type: "QUICK_REPLY"; items: QuickReplyItem[] }>
{
  id = crypto.randomUUID();
  items: QuickReplyItem[];
  sender: BaseUserCS;
  readBy: BaseUserCS[] = [];

  selectedValue: string | undefined;

  constructor(sender: BaseUserCS, items: QuickReplyItem[]) {
    this.sender = sender;
    this.items = items;
  }

  select(id: string) {
    this.selectedValue = id;
  }

  getData() {
    return { type: "QUICK_REPLY" as const, items: this.items };
  }
}
