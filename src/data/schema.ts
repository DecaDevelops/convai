import { Role } from "@/features/chat-message/enum";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: int("created_at", { mode: "timestamp" }),
  updatedAt: int("updated_at", { mode: "timestamp" }),
};

export const Character = sqliteTable("characters", {
  id: text().primaryKey(),
  name: text().notNull(),
  image: text({ mode: "json" }).$type<string[]>().notNull(),
  tags: text({ mode: "json" }).$type<string[]>(),
  description: text(),
  greeting: text().notNull(),
  personality: text().notNull(),
  scenario: text(),
  exampleDialogue: text("example_dialogue"),
  instructions: text("instructions"),
  ...timestamps,
});

export const Persona = sqliteTable("personas", {
  id: text().primaryKey(),
  name: text().notNull(),
  image: text(),
  description: text(),
  ...timestamps,
});

export const Chat = sqliteTable("chats", {
  id: text().primaryKey(),
  characterId: text("character_id").references(() => Character.id, {
    onDelete: "set null",
  }),
  personaId: text("persona_id").references(() => Persona.id, {
    onDelete: "set null",
  }),
  interferenceProfileId: text("interference_profile_id").references(
    () => InterferenceProfile.id,
  ),
  ...timestamps,
});

export const ChatMessage = sqliteTable("chat_messages", {
  id: int().primaryKey({ autoIncrement: true }),
  chatId: text("chat_id").references(() => Chat.id, { onDelete: "cascade" }),
  content: text(),
  role: int().default(Role.Assistant),
  ...timestamps,
});

export const InterferenceProfile = sqliteTable("interference_profile", {
  id: text().primaryKey(),
});
