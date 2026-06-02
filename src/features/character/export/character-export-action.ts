"use server";

import db from "@/data/db";
import ConvertToJson from "@/lib/json-func";
import { Character } from "@/data/schema";
import { eq } from "drizzle-orm";
import { CharacterFactory } from "../character-factory";
import { characterSelect } from "../character-type";

export async function exportCharacters() {
  const characters = await db.query.Character.findMany();
  if (characters.length === 0)
    throw new Error("There are no characters to export");

  const characterExport: characterSelect[] = [];
  for (const character of characters) {
    const result = await CharacterFactory.CreateExport(character);
    characterExport.push(result);
  }

  return ConvertToJson(characterExport);
}

export async function exportCharacter(characterId: string) {
  const [character] = await db
    .select()
    .from(Character)
    .where(eq(Character.id, characterId))
    .limit(1);

  const characterExport = await CharacterFactory.CreateExport(character);

  return ConvertToJson(characterExport);
}
