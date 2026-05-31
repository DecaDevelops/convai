import { Chat } from "@/data/schema";

export type ChatSelect = typeof Chat.$inferSelect;
export type ChatInsert = typeof Chat.$inferInsert;
export type ChatRequest = Pick<
  ChatInsert,
  "characterId" | "personaId" | "interferenceProfileId"
>;
