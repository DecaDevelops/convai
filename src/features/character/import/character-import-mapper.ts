import { characterRequest } from "../character-type";
import { CharacterImport } from "./character-import-types";

export class CharacterImportMapper {
  public static toRequest(req: CharacterImport): characterRequest {
    return {
      name: req.name,
      personality: req.personality,
      description: req.description,
      exampleDialogue: req.exampleDialogue,
      instructions: req.instructions,
      scenario: req.scenario,
      tags: req.tags,
      greeting: req.greeting,
    };
  }
}
