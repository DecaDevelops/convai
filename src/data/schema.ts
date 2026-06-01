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

export const ApiKey = sqliteTable("api_keys", {
  id: text().primaryKey(),
  name: text(),
  description: text(),
  value: text().notNull(),
  ...timestamps,
});

export const Provider = sqliteTable("providers", {
  id: text().primaryKey(),
  name: text(),
  description: text(),
  path: text(),
  apiKeyId: text("api_key_id").references(() => ApiKey.id),
  ...timestamps,
});

export const Model = sqliteTable("models", {
  id: text().primaryKey(),
  providerId: text("provider_id").references(() => Provider.id, {
    onDelete: "set null",
  }),
  name: text("name"),
  description: text(),
  tags: text({ mode: "json" }).$type<string[]>(),
  providerModelName: text("provider_model_name").notNull(),
  contextSize: text("context_size"),
  maxTokenResponse: int("max_token_response"),
  ...timestamps,
});

export const InterferenceProfile = sqliteTable("interference_profile", {
  id: text().primaryKey(),
  modelId: text("model_id").references(() => Model.id, { onDelete: "cascade" }),
  topK: int("top_k").notNull().default(70),
  topP: int("top_p").notNull().default(40),
  temperature: int("temperature").notNull(),
  maxResponseTokens: int("max_response_tokens").default(300),
  ...timestamps,
});
