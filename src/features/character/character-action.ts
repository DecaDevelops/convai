"use server";

import db from "@/data/db";
import { CharacterFactory } from "./character-factory";
import { characterRequest } from "./character-type";
import { Character, Chat } from "@/data/schema";
import { eq } from "drizzle-orm";
import { deleteFile, transferFile } from "../image/transfer";
import { ImageFactory } from "../image/ImageFactory";
import { FormDataConverter } from "@/lib/form-data";

export async function createCharacter(formData: FormData) {
  const data = FormDataConverter.fromFormData(formData);

  // Extract files from FormData
  const uploads = FormDataConverter.getFiles(formData, "uploads");

  const req: characterRequest = {
    name: (data.name as string) || "",
    greeting: (data.greeting as string) || "",
    personality: (data.personality as string) || "",
    description: (data.description as string) || "",
    exampleDialogue: (data.exampleDialogue as string) || "",
    instructions: (data.instructions as string) || "",
    scenario: (data.scenario as string) || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    uploads,
  };

  const character = CharacterFactory.Create(req);
  for (const upload of req.uploads) {
    const fileName = await transferFile(
      await ImageFactory.Create(upload),
      "characters",
    );

    character.image.push(fileName);
  }
  await db.insert(Character).values(character);
  return true;
}

export async function getCharacters() {
  return await db.query.Character.findMany();
}

export async function updateCharacter({
  id,
  req,
}: {
  id: string;
  req: characterRequest;
}) {
  await db.update(Character).set(req).where(eq(Character.id, id));
  return true;
}

export async function deleteCharacter(id: string) {
  const [character] = await db
    .delete(Character)
    .where(eq(Character.id, id))
    .returning();

  for (const image of character.image) {
    await deleteFile(image);
  }
  return true;
}

export async function getCharacterFromChatId(id: string) {
  const [result] = await db
    .select()
    .from(Chat)
    .leftJoin(Character, eq(Character.id, Chat.characterId))
    .where(eq(Chat.id, id))
    .limit(1);

  return result?.characters ?? null;
}
