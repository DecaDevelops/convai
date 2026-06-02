import { PersonaImport, PersonaRequest, PersonaSelect } from "./persona-types";

export class PersonaMapper {
  public static mapToRequest(persona: PersonaSelect): PersonaRequest {
    return {
      name: persona.name,
      description: persona.description,
    };
  }

  public static mapToImport(persona: PersonaSelect): PersonaImport {
    let image: Blob | null = null;

    if (persona.image) {
      const [, base64] = persona.image.split(",");
      const buffer = Buffer.from(base64, "base64");
      image = new Blob([buffer], { type: "image/webp" });
    }
    return {
      ...persona,
      image,
    };
  }
}
