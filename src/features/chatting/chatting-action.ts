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
import { updateTimestampChat } from "../chat/chat-action";
import { ModelSelect } from "../model/model-types";
import { ApiKeysSelect } from "../apiKey/api-keys-types";
import { InterferenceProfileSelect } from "../interference-profile/interference-profile-types";
import { AirVent } from "lucide-react";
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

async function getChatData(chatId: string) {
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
  if (!found.characters) throw new Error("Character not found");
  if (!found.providers) throw new Error("Provider was not found");
  if (!found.models) throw new Error("Model was not found");
  if (!found.interference_profile)
    throw new Error("Interference Profile not found");
  if (!found.api_keys) throw new Error("Could not find the API Key");

  const chatMessages = await db
    .select()
    .from(ChatMessage)
    .where(eq(ChatMessage.chatId, chatId))
    .orderBy(asc(ChatMessage.id));

  return {
    character: found.characters,
    persona: found.personas,
    api_key: found.api_keys,
    provider: found.providers,
    model: found.models,
    interference_profile: found.interference_profile,
    chat_messages: chatMessages,
    rules: deepseekRules(found.characters, found.personas),
  };
}

export async function sendMessage({
  chatId,
  content,
}: {
  chatId: string;
  content: string;
}) {
  const {
    api_key,
    character,
    chat_messages,
    interference_profile,
    model,
    persona,
    provider,
    rules,
  } = await getChatData(chatId);
  const providerClient = new Provider(provider.path ?? "", api_key.value);
  const messages = chat_messages.map((x) => convertToChatMessageParam(x));

  const userMessage: ChatCompletionMessageParam = { role: "user", content };
  const chatMessageCompletions: ChatCompletionMessageParam[] = [
    { role: "system", content: rules },
    ...messages,
    userMessage,
  ];

  // Convert stored integers back to decimals (stored as int * 100)
  const temperature = interference_profile.temperature / 100;
  const topP = interference_profile.topP / 100;

  const aiResponse = await providerClient.sendMessage({
    messages: chatMessageCompletions,
    model: model.providerModelName,
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

  void updateTimestampChat(chatId);
  return insertedRows;
}

export async function continueMessage(chatId: string) {
  const {
    api_key,
    character,
    chat_messages,
    interference_profile,
    model,
    persona,
    provider,
    rules,
  } = await getChatData(chatId);

  const providerClient = new Provider(provider.path!, api_key.value);
  const messages = chat_messages.map((x) => convertToChatMessageParam(x));
  const completions: ChatCompletionMessageParam[] = [
    { role: "system", content: rules },
    ...messages,
    {
      role: "user",
      content: [
        "The previous assistant response was cut off.",
        "Continue writing from the exact point where it ended.",
        "Do not repeat, summarize, or rewrite any existing text.",
        "Output only the continuation.",
      ].join(" "),
    },
  ];

  const temperature = interference_profile.temperature / 100;
  const topP = interference_profile.topP / 100;

  const aiResponse = await providerClient.sendMessage({
    messages: completions,
    model: model.providerModelName,
    maxTokens: interference_profile.maxResponseTokens ?? 300,
    temperature,
    topK: interference_profile.topK,
    topP,
  });

  if (!aiResponse) throw new Error("Could not create response");
  const toInsert = ChatMessageFactory.Create(
    aiResponse,
    Role.Assistant,
    chatId,
  );
  const [chatMessage] = await db
    .insert(ChatMessage)
    .values(toInsert)
    .returning();

  return chatMessage;
}
