import {
  characterInsert,
  characterRequest,
  characterSelect,
} from "./character-type";

export class CharacterMapper {
  public static toRequest(character: characterSelect): characterRequest {
    return {
      name: character.name,
      personality: character.personality,
      description: character.description,
      exampleDialogue: character.exampleDialogue,
      instructions: character.instructions,
      scenario: character.scenario,
      tags: character.tags,
      greeting: character.greeting,
    };
  }

  public static updateSelect(
    character: characterSelect,
    value: {
      [K in keyof characterRequest]: characterRequest[K];
    },
  ): characterInsert {
    return {
      id: character.id,
      name: value.name ?? "",
      description: value.description ?? "",
      personality: value.personality ?? "",
      scenario: value.scenario ?? "",
      tags: Array.isArray(value.tags) ? value.tags : [],
      exampleDialogue: value.exampleDialogue ?? "",
      greeting: value.greeting ?? "",
      instructions: value.instructions ?? "",
      image: character.image,
      createdAt: character.createdAt,
      updatedAt: new Date(),
    };
  }
}
