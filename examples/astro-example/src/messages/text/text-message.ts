import { TextMessageCS as TextMessageCS } from "freestyle-chat";
import type { ChatCompletionMessageParam } from "openai/resources/index";
import { SERVER_USER } from "../../cloudstate/chatbot";
import { cloudstate } from "freestyle-sh";

@cloudstate
export class CustomTextMessageCS extends TextMessageCS {
  asChatCompletions(): ChatCompletionMessageParam[] {
    return [
      {
        role: this.sender.id !== SERVER_USER.id ? "user" : "assistant",
        content: this.text,
      },
    ];
  }
}
