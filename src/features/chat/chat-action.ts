"use server";

import db from "@/data/db";
import { ChatRequest } from "./chat-types";
import { Character, Chat, ChatMessage } from "@/data/schema";
import { ChatFactory } from "./chat-factory";
import { desc, eq } from "drizzle-orm";
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
