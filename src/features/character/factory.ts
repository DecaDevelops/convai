import { characterInsert, characterRequest } from "./type";
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
}
