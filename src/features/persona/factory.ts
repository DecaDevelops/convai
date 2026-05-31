import { PersonaInsert, PersonaRequest } from "./types";
import { v4 as uuidv4 } from "uuid";
export class PersonaFactory {
  public static Create(req: PersonaRequest): PersonaInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      name: req.name,
      description: req.description,
      createdAt: date,
      updatedAt: date,
    };
  }
}
