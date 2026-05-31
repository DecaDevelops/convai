"use server";

import db from "@/data/db";
import { Chat } from "@/data/schema";
import { eq } from "drizzle-orm";

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
