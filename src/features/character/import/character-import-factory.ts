import { v4 } from "uuid";
import { characterSelect } from "../character-type";
import { CharacterImport } from "./character-import-types";

export class CharacterImportFactory {
  public static Create(req: characterSelect): CharacterImport {
    const images: Blob[] = [];
    for (const image of req.image) {
      const [, base64] = image.split(",");
      const buffer = Buffer.from(base64, "base64");
      images.push(new Blob([buffer], { type: "image/webp" }));
    }

    return {
      id: v4(),
      name: req.name,
      description: req.description,
      greeting: req.greeting,
      personality: req.personality,
      scenario: req.scenario,
      exampleDialogue: req.exampleDialogue,
      instructions: req.instructions,
      image: images,
      tags: req.tags,
      createdAt: req.createdAt,
      updatedAt: req.createdAt,
    };
  }
}
