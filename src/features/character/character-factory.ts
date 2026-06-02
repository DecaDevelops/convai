import { encodeFileBase64 } from "../image/transfer";
import {
  characterInsert,
  characterRequest,
  characterSelect,
} from "./character-type";
import { v4 as uuidv4 } from "uuid";
import { CharacterImport } from "./import/character-import-types";
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

  public static CreateImport(character: characterSelect): CharacterImport {
    const images: Blob[] = [];
    for (const image of character.image) {
      const [, base64] = image.split(",");
      const buffer = Buffer.from(base64, "base64");
      images.push(new Blob([buffer], { type: "image/webp" }));
    }

    return {
      ...character,
      image: images,
    };
  }
}
