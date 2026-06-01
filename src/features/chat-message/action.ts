"use server";

import db from "@/data/db";
import { ChatMessage } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function getChatMessages(chatId: string) {
  return await db
    .select()
    .from(ChatMessage)
    .where(eq(ChatMessage.chatId, chatId));
}
