import { Chat } from "@/data/schema";
import { Role } from "../chat-message/enum";

export type ChatSelect = typeof Chat.$inferSelect;
export type ChatInsert = typeof Chat.$inferInsert;
export type ChatRequest = Pick<
  ChatInsert,
  "characterId" | "personaId" | "interferenceProfileId"
>;

export type ChatWithCharacterAndPersona = {
  Chat: string | null;
  Character: string | null;
  Persona: string | null;
  Message: {
    content: string | null;
    role: Role | null;
  };
};
