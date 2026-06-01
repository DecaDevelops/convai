"use server";

import db from "@/data/db";
import { Character, Chat, ChatMessage, Persona } from "@/data/schema";
import { deepseekRules } from "@/lib/openai/deepseek-client";
import { asc, eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "openai/resources";
import { ChatMessageSelect } from "./types";
import { Role } from "./enum";
import { sendRequest } from "@/lib/openai/send-message";
import { ChatMessageFactory } from "./ChatMessageFactory";

export async function getChatMessages(chatId: string) {
  return await db
    .select()
    .from(ChatMessage)
    .where(eq(ChatMessage.chatId, chatId));
}
