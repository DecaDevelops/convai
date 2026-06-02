import { PersonaInsert, PersonaRequest, PersonaSelect } from "./persona-types";
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

  public static Update(
    persona: PersonaSelect,
    req: {
      [K in keyof PersonaRequest]: PersonaRequest[K];
    },
  ): PersonaInsert {
    return {
      id: persona.id,
      name: req.name ?? "",
      description: req.description ?? "",
      createdAt: persona.createdAt,
      updatedAt: new Date(),
      image: persona.image,
    };
  }
}
