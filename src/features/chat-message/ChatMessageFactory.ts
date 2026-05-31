import { Role } from "./enum";
import { ChatMessageRequest } from "./types";

export class ChatMessageFactory {
  public static Create(
    content: string,
    role: Role,
    chatId: string,
  ): ChatMessageRequest {
    return {
      chatId,
      content,
      role,
    };
  }
}
