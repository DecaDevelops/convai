"use server";

import db from "@/data/db";
import {
  ApiKey,
  Character,
  Chat,
  ChatMessage,
  InterferenceProfile,
  Model,
  Persona,
  Provider as ProviderTable,
} from "@/data/schema";
import { deepseekRules } from "@/lib/openai/deepseek-client";
import { eq, asc } from "drizzle-orm";
import { ChatMessageSelect } from "../chat-message/types";
import { ChatCompletionMessageParam } from "openai/resources";
import { ChatMessageFactory } from "../chat-message/ChatMessageFactory";
import { Role } from "../chat-message/enum";
import { Provider } from "@/features/provider/provider-class";
function convertToChatMessageParam(
  message: ChatMessageSelect,
): ChatCompletionMessageParam {
  return {
    content: message.content ?? "",
    role: message.role === 0 ? "user" : "assistant",
  };
}

export async function updateActivePersona({
  chatId,
  personaId,
}: {
  chatId: string;
  personaId: string | null;
}) {
  const affected = await db
    .update(Chat)
    .set({ personaId })
    .where(eq(Chat.id, chatId));

  if (affected.changes === 0) throw new Error("Could not update value");

  return;
}

export async function updateActiveProfile({
  chatId,
  profileId,
}: {
  chatId: string;
  profileId: string | null;
}) {
  const affected = await db
    .update(Chat)
    .set({ interferenceProfileId: profileId })
    .where(eq(Chat.id, chatId));

  if (affected.changes === 0) throw new Error("Could not update value");

  return;
}

export async function sendMessage({
  chatId,
  content,
}: {
  chatId: string;
  content: string;
}) {
  const [found] = await db
    .select()
    .from(Chat)
    .leftJoin(Character, eq(Character.id, Chat.characterId))
    .leftJoin(Persona, eq(Persona.id, Chat.personaId))
    .leftJoin(
      InterferenceProfile,
      eq(InterferenceProfile.id, Chat.interferenceProfileId),
    )
    .leftJoin(Model, eq(Model.id, InterferenceProfile.modelId))
    .leftJoin(ProviderTable, eq(ProviderTable.id, Model.providerId))
    .leftJoin(ApiKey, eq(ApiKey.id, ProviderTable.apiKeyId))
    .where(eq(Chat.id, chatId))
    .limit(1);

  if (!found) throw new Error("Chat not found");
  if (!found.characters)
    throw new Error("Could not find a character linked to this chat");
  if (!found.interference_profile)
    throw new Error("No interference profile selected");
  if (!found.models)
    throw new Error("Interference profile has no model configured");
  if (!found.providers) throw new Error("Model has no provider configured");
  if (!found.api_keys) throw new Error("Provider has no API key configured");

  const {
    characters,
    personas,
    interference_profile,
    models,
    providers,
    api_keys,
  } = found;

  // Create dynamic provider client
  const providerClient = new Provider(providers.path ?? "", api_keys.value);

  const chatMessages = await db
    .select()
    .from(ChatMessage)
    .where(eq(ChatMessage.chatId, chatId))
    .orderBy(asc(ChatMessage.id));

  const rules = deepseekRules(characters, personas);
  const greeting = characters.greeting ?? "";

  const messages = chatMessages.map((x) => convertToChatMessageParam(x));

  const userMessage: ChatCompletionMessageParam = { role: "user", content };
  const chatMessageCompletions: ChatCompletionMessageParam[] = [
    { role: "system", content: rules },
    { role: "assistant", content: greeting },
    ...messages,
    userMessage,
  ];

  // Convert stored integers back to decimals (stored as int * 100)
  const temperature = interference_profile.temperature / 100;
  const topP = interference_profile.topP / 100;

  const aiResponse = await providerClient.sendMessage({
    messages: chatMessageCompletions,
    model: models.providerModelName,
    maxTokens: interference_profile.maxResponseTokens ?? 300,
    temperature,
    topK: interference_profile.topK,
    topP,
  });

  if (!aiResponse) throw new Error("Could not create response");

  const toInsert = [
    ChatMessageFactory.Create(content, Role.User, chatId),
    ChatMessageFactory.Create(aiResponse, Role.Assistant, chatId),
  ];

  const insertedRows = await db
    .insert(ChatMessage)
    .values(toInsert)
    .returning();

  return insertedRows;
}
