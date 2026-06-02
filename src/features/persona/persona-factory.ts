import { encodeFileBase64 } from "../image/transfer";
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
  public static async CreateExport(req: PersonaSelect): Promise<PersonaSelect> {
    const base64 = req?.image ? await encodeFileBase64(req.image) : null;
    const image = base64 ? `data:image/webp;base64,${base64}` : null;
    return {
      ...req,
      image,
    };
  }
}
