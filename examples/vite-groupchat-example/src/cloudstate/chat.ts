import { cloudstate, useRequest } from "freestyle-sh";
import { MessageListCS } from "freestyle-chat";
import { BaseUserCS } from "freestyle-auth/passkey";
import { parse as parseCookie } from "cookie";

@cloudstate
export class ChatCS extends MessageListCS {
  static id = "chat" as const;

  override getCurrentUser(): BaseUserCS {
    const req = useRequest();
    const cookie = req.headers.get("cookie");
    const parsedCookie = parseCookie(cookie ?? "");
    const sessionId = parsedCookie["freestyle-session-id"];

    return {
      id: sessionId,
      username: sessionId,
    };
  }
}
