import { encodeFileBase64 } from "../image/transfer";
import {
  CharacterImport,
  characterInsert,
  characterRequest,
  characterSelect,
  CharacterStore,
} from "./character-type";
import { v4 as uuidv4 } from "uuid";
export class CharacterFactory {
  public static Create(character: characterRequest): characterInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      name: character.name,
      description: character.description,
      greeting: character.greeting,
      personality: character.personality,
      exampleDialogue: character.exampleDialogue,
      instructions: character.instructions,
      scenario: character.scenario,
      image: [],
      tags: character.tags,
      createdAt: date,
      updatedAt: date,
    };
  }

  public static async CreateExport(
    character: characterSelect,
  ): Promise<characterSelect> {
    const images: string[] = [];
    for (const image of character.image) {
      const base64 = await encodeFileBase64(image);
      images.push(`data:image/webp;base64,${base64}`);
    }
    return {
      ...character,
      image: images,
    };
  }
}
