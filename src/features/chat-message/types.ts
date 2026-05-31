import { ChatMessage } from "@/data/schema";

export type ChatMessageSelect = typeof ChatMessage.$inferSelect;
export type ChatMessageInsert = typeof ChatMessage.$inferInsert;

export type ChatMessageRequest = Pick<
  ChatMessageInsert,
  "chatId" | "content" | "role"
>;
