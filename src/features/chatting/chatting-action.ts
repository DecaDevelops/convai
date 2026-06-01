"use server";

import db from "@/data/db";
import { Character, Chat, ChatMessage, Persona } from "@/data/schema";
import { deepseekRules } from "@/lib/openai/deepseek-client";
import { eq, asc } from "drizzle-orm";
import { ChatMessageSelect } from "../chat-message/types";
import { ChatCompletionMessageParam } from "openai/resources";
import { sendRequest } from "@/lib/openai/send-message";
import { ChatMessageFactory } from "../chat-message/ChatMessageFactory";
import { Role } from "../chat-message/enum";
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
    .where(eq(Chat.id, chatId))
    .limit(1);

  if (!found) throw new Error("Chat not found");
  if (!found.characters)
    throw new Error("Could not find a character linked to this chat");

  const { characters, personas } = found;
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

  const aiResponse = await sendRequest(chatMessageCompletions);
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
