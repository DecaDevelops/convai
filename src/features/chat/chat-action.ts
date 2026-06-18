"use server";

import db from "@/data/db";
import { ChatRequest } from "./chat-types";
import { Character, Chat, ChatMessage, Persona } from "@/data/schema";
import { ChatFactory } from "./chat-factory";
import { and, desc, eq, isNotNull, not, sql } from "drizzle-orm";
import { ChatMessageFactory } from "../chat-message/ChatMessageFactory";
import { Role } from "../chat-message/enum";

export async function createChat(req: ChatRequest) {
  const [latestChat] = await db
    .select()
    .from(Chat)
    .where(eq(Chat.characterId, req.characterId ?? ""))
    .orderBy(desc(Chat.updatedAt));
  if (latestChat) return latestChat.id;

  return await createNewChat(req);
}

export async function createNewChat(req: ChatRequest) {
  const characterId = req.characterId;
  if (!characterId) throw new Error("Character not found");
  const [character] = await db
    .select()
    .from(Character)
    .where(eq(Character.id, characterId))
    .limit(1);

  if (!character) throw new Error("Character not found");
  const { greeting } = character;
  const chat = ChatFactory.Create({ characterId });

  const [{ id }] = await db.insert(Chat).values(chat).returning();

  const greetingMessage = ChatMessageFactory.Create(
    greeting,
    Role.Assistant,
    id,
  );

  await db.insert(ChatMessage).values(greetingMessage);

  return id;
}

export async function getChats() {
  return await db.query.Chat.findMany();
}

export async function getChat(chatId: string) {
  const [res] = await db
    .select()
    .from(Chat)
    .where(eq(Chat.id, chatId))
    .limit(1);

  return res ?? null;
}

export async function updateTimestampChat(chatId: string) {
  await db
    .update(Chat)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(Chat.id, chatId));
}

export async function getChatsWithChatbotAndPersona() {
  const sq = db
    .select({
      id: ChatMessage.id,
      chatId: ChatMessage.chatId,
      content: ChatMessage.content,
      role: ChatMessage.role,
      createdAt: ChatMessage.createdAt,
      updatedAt: ChatMessage.updatedAt,
      rowNumber:
        sql<number>`row_number() over (partition by ${ChatMessage.chatId} order by ${ChatMessage.createdAt} desc)`.as(
          "row_number",
        ),
    })
    .from(ChatMessage)
    .as("sq");

  const result = await db
    .select({
      Chat: Chat.id,
      Character: Character.id,
      Persona: Persona.id,
      Message: {
        content: sq.content,
        role: sq.role,
      },
    })
    .from(sq)
    .innerJoin(Chat, eq(Chat.id, sq.chatId))
    .leftJoin(Character, eq(Chat.characterId, Character.id))
    .leftJoin(Persona, eq(Persona.id, Chat.personaId))
    .where(eq(sq.rowNumber, 1));

  return result.filter((x) => x.Chat !== null);
}

export async function deleteChat(chatId: string) {
  await db.delete(Chat).where(eq(Chat.id, chatId));

  return true;
}
