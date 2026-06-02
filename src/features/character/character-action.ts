"use server";

import db from "@/data/db";
import { CharacterFactory } from "./character-factory";
import { characterRequest } from "./character-type";
import { Character, Chat } from "@/data/schema";
import { eq } from "drizzle-orm";
import { deleteFile, transferFile } from "../image/transfer";
import { ImageFactory } from "../image/ImageFactory";
import { FormDataConverter } from "@/lib/form-data";
import { CharacterModel } from "./character-model";
import { ValueOf } from "next/dist/shared/lib/constants";
import { CharacterMapper } from "./character-mapper";

export async function createCharacter(formData: FormData) {
  const data = FormDataConverter.fromFormData(formData);

  // Extract files from FormData
  const upload = formData.get("file");

  const req: characterRequest = {
    name: (data.name as string) || "",
    greeting: (data.greeting as string) || "",
    personality: (data.personality as string) || "",
    description: (data.description as string) || "",
    exampleDialogue: (data.exampleDialogue as string) || "",
    instructions: (data.instructions as string) || "",
    scenario: (data.scenario as string) || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
  };

  const character = CharacterFactory.Create(req);
  if (upload instanceof File) {
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

export async function getCharacter(id: string) {
  const [character] = await db
    .select()
    .from(Character)
    .where(eq(Character.id, id))
    .limit(1);

  return character ?? null;
}

export async function updateCharacter({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const data = FormDataConverter.fromFormData(formData) as {
    [K in keyof characterRequest]: characterRequest[K];
  };
  const [character] = await db
    .select()
    .from(Character)
    .where(eq(Character.id, id))
    .limit(1);

  if (!character) {
    throw new Error(`Character with id ${id} not found`);
  }

  const upload = formData.get("file");

  const updatedCharacter = CharacterMapper.updateSelect(character, data);
  console.log(upload);
  if (upload instanceof File) {
    const fileName = await transferFile(
      await ImageFactory.Create(upload),
      "characters",
    );
    updatedCharacter.image = [fileName];
    await deleteFile(character.image?.[0]);
  }
  await db.update(Character).set(updatedCharacter).where(eq(Character.id, id));
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
